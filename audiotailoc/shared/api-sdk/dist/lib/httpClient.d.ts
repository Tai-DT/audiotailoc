export interface HttpClientOptions {
    baseUrl: string;
    defaultHeaders?: HeadersInit;
}
export declare class HttpClient {
    private readonly baseUrl;
    private readonly defaultHeaders;
    constructor(options: HttpClientOptions);
    request<T>(path: string, init?: RequestInit): Promise<T>;
}
