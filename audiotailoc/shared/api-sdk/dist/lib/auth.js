export class AuthApi {
    constructor(client) {
        this.client = client;
    }
    login(email, password) {
        return this.client.request(`/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }
    me() {
        return this.client.request(`/auth/me`);
    }
}
//# sourceMappingURL=auth.js.map