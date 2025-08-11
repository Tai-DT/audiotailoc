export type ApiSdkConfig = {
  baseUrl: string
  getAccessToken?: () => Promise<string | undefined> | string | undefined
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly getAccessToken?: ApiSdkConfig['getAccessToken']

  constructor(config: ApiSdkConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.getAccessToken = config.getAccessToken
  }

  private async buildHeaders(init?: HeadersInit): Promise<HeadersInit> {
    const token = this.getAccessToken ? await this.getAccessToken() : undefined
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init || {}),
    }
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: await this.buildHeaders(),
      credentials: 'include',
    })
    return this.handle<T>(res)
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: await this.buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })
    return this.handle<T>(res)
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: await this.buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })
    return this.handle<T>(res)
  }

  async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: await this.buildHeaders(),
      credentials: 'include',
    })
    return this.handle<T>(res)
  }

  private async handle<T>(res: Response): Promise<T> {
    if (!res.ok) {
      let payload: any
      try {
        payload = await res.json()
      } catch {
        payload = { message: await res.text() }
      }
      const err = new Error(payload?.message || 'Request failed') as Error & { status?: number; data?: any }
      err.status = res.status
      err.data = payload
      throw err
    }
    return res.status === 204 ? (undefined as unknown as T) : ((await res.json()) as T)
  }
}