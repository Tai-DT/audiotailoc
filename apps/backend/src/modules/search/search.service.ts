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

  async search(q: string, page: number, pageSize: number): Promise<{ hits: unknown[]; estimatedTotalHits?: number; page: number; pageSize: number }> {
    await this.ensureIndex();
    const offset = (page - 1) * pageSize;
    const res = await fetch(`${this.url}/indexes/${this.indexName}/search`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ q, offset, limit: pageSize }),
    });
    const data = (await res.json()) as { hits: unknown[]; estimatedTotalHits?: number };
    return { ...data, page, pageSize };
  }
}

