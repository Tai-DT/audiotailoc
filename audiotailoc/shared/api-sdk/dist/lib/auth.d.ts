import { HttpClient } from './httpClient';
export declare class AuthApi {
    private readonly client;
    constructor(client: HttpClient);
    login(email: string, password: string): Promise<{
        token: string;
    }>;
    me(): Promise<{
        id: string;
        email: string;
    }>;
}
