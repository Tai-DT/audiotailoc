import { HttpClient } from './httpClient';

export interface FileInfo {
  id: string;
  name: string;
  url: string;
}

export class FilesApi {
  constructor(private readonly client: HttpClient) {}

  list() {
    return this.client.request<FileInfo[]>(`/files`);
  }

  info(fileId: string) {
    return this.client.request<FileInfo>(`/files/${fileId}`);
  }
}