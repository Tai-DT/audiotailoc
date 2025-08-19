import { HttpClient } from './httpClient'
import { z } from 'zod'

const LoginResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  user: z.object({ id: z.string(), email: z.string().email(), roles: z.array(z.enum(['admin', 'staff'])) }),
})
export type LoginResponse = z.infer<typeof LoginResponse>

export function createAuthApi(client: HttpClient) {
  return {
    async login(email: string, password: string): Promise<LoginResponse> {
      const data = await client.post<LoginResponse>('/auth/login', { email, password })
      return LoginResponse.parse(data)
    },
    async me<T = any>(): Promise<T> {
      return client.get<T>('/auth/me')
    },
  }
}