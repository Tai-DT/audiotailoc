import { HttpClient } from './httpClient';
export interface FileInfo {
    id: string;
    name: string;
    url: string;
}
export declare class FilesApi {
    private readonly client;
    constructor(client: HttpClient);
    list(): Promise<FileInfo[]>;
    info(fileId: string): Promise<FileInfo>;
}
