import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type MeiliIndexSettings = { primaryKey?: string };

@Injectable()
export class SearchService {
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
    await fetch(`${this.url}/indexes/${this.indexName}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify({ primaryKey: 'id' } satisfies MeiliIndexSettings),
    });
    // Try to set filterable attributes for facets/filters
    try {
      await fetch(`${this.url}/indexes/${this.indexName}/settings`, {
        method: 'PATCH',
        headers: this.headers(),
        body: JSON.stringify({ filterableAttributes: ['categoryId', 'priceCents'] }),
      });
    } catch {}
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
    filters?: { categoryId?: string; minPrice?: number; maxPrice?: number },
  ): Promise<{ hits: unknown[]; estimatedTotalHits?: number; page: number; pageSize: number; facetDistribution?: Record<string, any> }> {
    await this.ensureIndex();
    const offset = (page - 1) * pageSize;
    const filterClauses: string[] = [];
    if (filters?.categoryId) filterClauses.push(`categoryId = ${JSON.stringify(filters.categoryId)}`);
    if (typeof filters?.minPrice === 'number') filterClauses.push(`priceCents >= ${filters.minPrice}`);
    if (typeof filters?.maxPrice === 'number') filterClauses.push(`priceCents <= ${filters.maxPrice}`);
    const filter = filterClauses.length ? filterClauses.join(' AND ') : undefined;
    const res = await fetch(`${this.url}/indexes/${this.indexName}/search`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ q, offset, limit: pageSize, filter, facets: ['categoryId'] }),
    });
    const data = (await res.json()) as { hits: unknown[]; estimatedTotalHits?: number; facetDistribution?: Record<string, any> };
    return { ...data, page, pageSize };
  }
}
