export class AudiotailocSDK {
  constructor(public readonly apiBaseUrl: string) {}

  getStatus(): string {
    return `SDK ready for ${this.apiBaseUrl}`;
  }
}