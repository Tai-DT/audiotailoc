import { HttpClient } from './httpClient';

export class AuthApi {
  constructor(private readonly client: HttpClient) {}

  login(email: string, password: string) {
    return this.client.request<{ token: string }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  me() {
    return this.client.request<{ id: string; email: string }>(`/auth/me`);
  }
}