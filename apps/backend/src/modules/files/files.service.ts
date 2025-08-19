import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
type Client = any;

function getEnv(cfg: ConfigService, key: string, fallback?: string): string {
  const v = cfg.get<string>(key) ?? fallback;
  if (!v) throw new Error(`Missing env ${key}`);
  return v;
}

@Injectable()
export class FilesService {
  private client: Client;
  private bucket: string;

  constructor(private readonly config: ConfigService) {
    // Lazy require to avoid circular type issues in some environments
    const Minio = require('minio');
    this.bucket = getEnv(this.config, 'MINIO_BUCKET', 'uploads');
    this.client = new Minio.Client({
      endPoint: getEnv(this.config, 'MINIO_ENDPOINT', 'localhost'),
      port: Number(this.config.get<string>('MINIO_PORT') ?? '9000'),
      useSSL: (this.config.get<string>('MINIO_USE_SSL') ?? 'false') === 'true',
      accessKey: getEnv(this.config, 'MINIO_ROOT_USER', 'minio'),
      secretKey: getEnv(this.config, 'MINIO_ROOT_PASSWORD', 'miniosecret'),
    });
  }

  async ensureBucket(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(this.bucket, 'us-east-1');
    }
  }

  async uploadObject(objectName: string, buffer: Buffer, contentType?: string): Promise<{ key: string; url: string }> {
    await this.ensureBucket();
    await this.client.putObject(this.bucket, objectName, buffer, { 'Content-Type': contentType ?? 'application/octet-stream' });
    const url = await this.client.presignedGetObject(this.bucket, objectName, 24 * 60 * 60); // 24h
    return { key: objectName, url };
  }
}
