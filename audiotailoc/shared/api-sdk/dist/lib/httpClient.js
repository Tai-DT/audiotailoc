import fetch from 'cross-fetch';
export class HttpClient {
    constructor(options) {
        this.baseUrl = options.baseUrl.replace(/\/$/, '');
        this.defaultHeaders = options.defaultHeaders ?? {};
    }
    async request(path, init = {}) {
        const url = `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
        const res = await fetch(url, {
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
            return (await res.json());
        }
        return (await res.text());
    }
}
//# sourceMappingURL=httpClient.js.map