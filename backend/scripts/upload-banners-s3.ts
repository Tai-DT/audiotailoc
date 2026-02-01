import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Router để upload toàn bộ ảnh trong data/banner lên S3
// Cách dùng:
// 1) Thiết lập env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET
// 2) Đăng ký router vào app Express của backend: app.use('/admin', uploadBannersRouter);
// 3) Gọi POST /admin/upload-banners-s3 để upload tất cả ảnh trong data/banner lên S3

const router = express.Router();

const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

async function uploadFileToS3(
  s3: S3Client,
  bucket: string,
  key: string,
  filePath: string,
  contentType?: string,
) {
  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileStream,
    ContentType: contentType,
    ACL: 'public-read',
  });
  return s3.send(command);
}

router.post('/upload-banners-s3', async (req: Request, res: Response) => {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !S3_BUCKET) {
    return res.status(400).json({
      error:
        'Missing AWS env vars. Required: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET',
    });
  }

  const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  // Thư mục chứa banner, tương đối so với backend/src/routes
  const bannerDir = path.resolve(__dirname, '../../../data/banner');

  let files: string[];
  try {
    files = await fs.promises.readdir(bannerDir);
  } catch (err) {
    return res
      .status(500)
      .json({ error: `Cannot read banner directory: ${bannerDir}`, detail: String(err) });
  }

  const imageFiles = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return Object.keys(mimeTypes).includes(ext);
  });

  if (imageFiles.length === 0) {
    return res.status(404).json({ message: 'Không tìm thấy ảnh trong thư mục banner' });
  }

  const results: Array<{ file: string; key?: string; ok: boolean; error?: string }> = [];

  for (const file of imageFiles) {
    const filePath = path.join(bannerDir, file);
    const ext = path.extname(file).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const key = `banners/${file}`;
    try {
      await uploadFileToS3(s3, S3_BUCKET, key, filePath, contentType);
      results.push({ file, key, ok: true });
    } catch (err: any) {
      results.push({ file, ok: false, error: err.message || String(err) });
    }
  }

  const uploaded = results
    .filter(r => r.ok)
    .map(r => ({
      file: r.file,
      url: `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${r.key}`,
    }));
  const failed = results.filter(r => !r.ok).map(r => ({ file: r.file, error: r.error }));

  return res.json({ uploaded, failed });
});

export default router;
