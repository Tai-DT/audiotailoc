export class FilesApi {
    constructor(client) {
        this.client = client;
    }
    list() {
        return this.client.request(`/files`);
    }
    info(fileId) {
        return this.client.request(`/files/${fileId}`);
    }
}
//# sourceMappingURL=files.js.map