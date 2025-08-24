import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type MeiliIndexSettings = { primaryKey?: string };

export interface SearchFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
}

interface SearchOptions {
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'created_desc';
  facets?: string[];
  attributesToHighlight?: string[];
  attributesToCrop?: string[];
  cropLength?: number;
}

export interface SearchResult {
  hits: any[];
  estimatedTotalHits?: number;
  page: number;
  pageSize: number;
  facetDistribution?: Record<string, any>;
  processingTimeMs?: number;
  query?: string;
  suggestions?: string[];
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private url: string;
  private key?: string;
  private indexName = 'products';

  constructor(private readonly config: ConfigService) {
    this.url = this.config.get<string>('MEILI_URL') ?? 'http://localhost:7700';
    this.key = this.config.get<string>('MEILI_MASTER_KEY') ?? undefined;
  }

  private headers() {
    return {
      'content-type': 'application/json',
      ...(this.key ? { Authorization: `Bearer ${this.key}` } : {}),
    } as Record<string, string>;
  }

  async ensureIndex(): Promise<void> {
    try {
      await fetch(`${this.url}/indexes/${this.indexName}`, {
        method: 'PUT',
        headers: this.headers(),
        body: JSON.stringify({ primaryKey: 'id' } satisfies MeiliIndexSettings),
      });

      // Configure advanced search settings
      await fetch(`${this.url}/indexes/${this.indexName}/settings`, {
        method: 'PATCH',
        headers: this.headers(),
        body: JSON.stringify({
          filterableAttributes: [
            'categoryId',
            'priceCents',
            'brand',
            'inStock',
            'featured',
            'tags',
            'createdAt'
          ],
          sortableAttributes: [
            'priceCents',
            'name',
            'createdAt',
            'updatedAt'
          ],
          searchableAttributes: [
            'name',
            'description',
            'brand',
            'tags'
          ],
          displayedAttributes: [
            'id',
            'name',
            'description',
            'priceCents',
            'imageUrl',
            'slug',
            'categoryId',
            'brand',
            'inStock',
            'featured',
            'tags'
          ],
          rankingRules: [
            'words',
            'typo',
            'proximity',
            'attribute',
            'sort',
            'exactness'
          ],
          stopWords: ['và', 'của', 'cho', 'với', 'từ', 'tại', 'trong'],
          synonyms: {
            'tai nghe': ['headphone', 'earphone'],
            'loa': ['speaker'],
            'ampli': ['amplifier', 'amp']
          }
        }),
      });

      this.logger.log('Search index configured successfully');
    } catch (error) {
      this.logger.error('Failed to configure search index:', error);
    }
  }

  async indexDocuments(docs: unknown[]): Promise<void> {
    await this.ensureIndex();
    await fetch(`${this.url}/indexes/${this.indexName}/documents`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(docs),
    });
  }

  async deleteDocument(id: string): Promise<void> {
    await this.ensureIndex();
    await fetch(`${this.url}/indexes/${this.indexName}/documents/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
  }

  async search(
    q: string,
    page: number,
    pageSize: number,
    filters?: SearchFilters,
    options?: SearchOptions,
  ): Promise<SearchResult> {
    await this.ensureIndex();

    const offset = (page - 1) * pageSize;
    const filterClauses: string[] = [];

    // Build filter clauses
    if (filters?.categoryId) {
      filterClauses.push(`categoryId = ${JSON.stringify(filters.categoryId)}`);
    }
    if (typeof filters?.minPrice === 'number') {
      filterClauses.push(`priceCents >= ${filters.minPrice}`);
    }
    if (typeof filters?.maxPrice === 'number') {
      filterClauses.push(`priceCents <= ${filters.maxPrice}`);
    }
    if (filters?.brand) {
      filterClauses.push(`brand = ${JSON.stringify(filters.brand)}`);
    }
    if (typeof filters?.inStock === 'boolean') {
      filterClauses.push(`inStock = ${filters.inStock}`);
    }
    if (typeof filters?.featured === 'boolean') {
      filterClauses.push(`featured = ${filters.featured}`);
    }
    if (filters?.tags && filters.tags.length > 0) {
      const tagFilters = filters.tags.map(tag => `tags = ${JSON.stringify(tag)}`);
      filterClauses.push(`(${tagFilters.join(' OR ')})`);
    }

    const filter = filterClauses.length ? filterClauses.join(' AND ') : undefined;

    // Build sort parameter
    let sort: string[] | undefined;
    if (options?.sortBy) {
      switch (options.sortBy) {
        case 'price_asc':
          sort = ['priceCents:asc'];
          break;
        case 'price_desc':
          sort = ['priceCents:desc'];
          break;
        case 'name_asc':
          sort = ['name:asc'];
          break;
        case 'name_desc':
          sort = ['name:desc'];
          break;
        case 'created_desc':
          sort = ['createdAt:desc'];
          break;
        default:
          sort = undefined; // relevance
      }
    }

    // Default facets
    const facets = options?.facets || ['categoryId', 'brand', 'tags'];

    const searchParams = {
      q: q || '',
      offset,
      limit: pageSize,
      filter,
      facets,
      sort,
      attributesToHighlight: options?.attributesToHighlight || ['name', 'description'],
      attributesToCrop: options?.attributesToCrop || ['description'],
      cropLength: options?.cropLength || 100,
      showMatchesPosition: true,
    };

    try {
      const res = await fetch(`${this.url}/indexes/${this.indexName}/search`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify(searchParams),
      });

      if (!res.ok) {
        throw new Error(`Search request failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      return {
        hits: data.hits || [],
        estimatedTotalHits: data.estimatedTotalHits,
        page,
        pageSize,
        facetDistribution: data.facetDistribution,
        processingTimeMs: data.processingTimeMs,
        query: q,
      };
    } catch (error) {
      this.logger.error('Search request failed:', error);
      return {
        hits: [],
        estimatedTotalHits: 0,
        page,
        pageSize,
        facetDistribution: {},
        query: q,
      };
    }
  }

  async getSuggestions(q: string, limit: number = 5): Promise<string[]> {
    if (!q || q.length < 2) return [];

    try {
      await this.ensureIndex();

      const res = await fetch(`${this.url}/indexes/${this.indexName}/search`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          q,
          limit,
          attributesToRetrieve: ['name'],
          attributesToHighlight: [],
          attributesToCrop: [],
        }),
      });

      if (!res.ok) return [];

      const data = await res.json();
      const suggestions: string[] = (data.hits as Array<any> | undefined)
        ?.map((hit: any) => hit.name)
        .filter((name: unknown): name is string => typeof name === 'string' && name.toLowerCase().includes(q.toLowerCase()))
        .slice(0, limit) || [];

      return [...new Set(suggestions)]; // Remove duplicates
    } catch (error) {
      this.logger.error('Failed to get suggestions:', error);
      return [];
    }
  }

  async getPopularSearches(limit: number = 10): Promise<string[]> {
    // This would typically come from analytics data
    // For now, return some common search terms
    return [
      'tai nghe',
      'loa bluetooth',
      'ampli',
      'sony',
      'audio technica',
      'sennheiser',
      'bose',
      'jbl',
      'focal',
      'beyerdynamic'
    ].slice(0, limit);
  }

  async getFacets(): Promise<Record<string, any>> {
    try {
      await this.ensureIndex();

      const res = await fetch(`${this.url}/indexes/${this.indexName}/search`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          q: '',
          limit: 0,
          facets: ['categoryId', 'brand', 'tags'],
        }),
      });

      if (!res.ok) return {};

      const data = await res.json();
      return data.facetDistribution || {};
    } catch (error) {
      this.logger.error('Failed to get facets:', error);
      return {};
    }
  }

  // Additional methods for compatibility
  async searchProducts(query: string, options: any = {}): Promise<SearchResult> {
    const page = options.page || 1;
    const pageSize = options.limit || 20;
    return this.search(query, page, pageSize, options, options);
  }

  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    return this.getSuggestions(query, limit);
  }

  async getAvailableFilters(_query: string): Promise<any> {
    return this.getFacets();
  }

  async globalSearch(query: string, options: any = {}): Promise<SearchResult> {
    const page = options.page || 1;
    const pageSize = options.limit || 20;
    return this.search(query, page, pageSize, options, options);
  }

  async getUserSearchHistory(_userId: string): Promise<any[]> {
    // This would typically fetch from a search history database
    return [];
  }
}
