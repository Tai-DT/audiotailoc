import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmbeddingService {
  constructor(private readonly config: ConfigService) {}

  async embed(text: string): Promise<number[] | null> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    const base = this.config.get<string>('OPENAI_BASE_URL') || 'https://api.openai.com';
    const model = this.config.get<string>('OPENAI_EMBED_MODEL') || 'text-embedding-3-small';
    if (!apiKey) return null;
    try {
      const res = await fetch(`${base}/v1/embeddings`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ input: text, model }),
      });
      const data = (await res.json()) as any;
      return data?.data?.[0]?.embedding || null;
    } catch {
      return null;
    }
  }

  cosine(a: number[], b: number[]): number {
    let dot = 0,
      na = 0,
      nb = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    const denom = Math.sqrt(na) * Math.sqrt(nb);
    return denom ? dot / denom : 0;
  }
}

