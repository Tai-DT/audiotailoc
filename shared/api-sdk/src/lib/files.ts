import { HttpClient } from './httpClient'

export type PresignRequest = {
  key: string
  contentType: string
}
export type PresignResponse = {
  url: string
  fields?: Record<string, string>
}

export function createFilesApi(client: HttpClient) {
  return {
    async presignUpload(payload: PresignRequest): Promise<PresignResponse> {
      return client.post('/files/presign', payload)
    },
  }
}