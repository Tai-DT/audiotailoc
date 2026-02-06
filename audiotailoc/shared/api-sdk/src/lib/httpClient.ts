import fetch from 'cross-fetch';

export interface HttpClientOptions {
  baseUrl: string;
  defaultHeaders?: HeadersInit;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    const res: Response = await fetch(url, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...this.defaultHeaders,
        ...(init.headers ?? {}),
      },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
  }
}