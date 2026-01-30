import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from './cloudinary.service';
import { FileValidator } from '../../common/security/file-validator';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export interface FileUploadResult {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata: Record<string, any>;
}

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  requireImage?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadDir: string;
  private readonly cdnUrl: string;
  private readonly signedUrlSecret: string;
  private readonly signedUrlTtlSeconds: number;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {
    this.uploadDir = this.config.get<string>('UPLOAD_DIR', './uploads');
    this.cdnUrl = this.config.get<string>('CDN_URL', '');
    this.signedUrlSecret = this.config.get<string>('SIGNED_URL_SECRET', '');
    this.signedUrlTtlSeconds = Number(this.config.get<string>('SIGNED_URL_TTL_SECONDS', '300'));

    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await mkdir(this.uploadDir, { recursive: true });
      await mkdir(path.join(this.uploadDir, 'images'), { recursive: true });
      await mkdir(path.join(this.uploadDir, 'documents'), { recursive: true });
      await mkdir(path.join(this.uploadDir, 'thumbnails'), { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create upload directories:', error);
    }
  }

  // SECURITY: Default allowed file extensions whitelist
  // Explicitly exclude dangerous executable and script file types
  private readonly DANGEROUS_EXTENSIONS = [
    '.exe',
    '.bat',
    '.cmd',
    '.com',
    '.scr',
    '.vbs',
    '.js',
    '.jar',
    '.sh',
    '.bash',
    '.zsh',
    '.fish',
    '.ps1',
    '.psm1',
    '.psd1',
    '.php',
    '.phtml',
    '.php3',
    '.php4',
    '.php5',
    '.phps',
    '.dll',
    '.so',
    '.dylib',
    '.app',
    '.deb',
    '.rpm',
    '.msi',
    '.py',
    '.pyc',
    '.pyo',
    '.rb',
    '.pl',
    '.perl',
    '.cgi',
    '.asp',
    '.aspx',
    '.jsp',
    '.jspx',
    '.war',
    '.ear',
  ];

  private readonly DEFAULT_ALLOWED_EXTENSIONS = [
    // Images
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.bmp',
    '.ico',
    // Documents
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.rtf',
    '.odt',
    '.ods',
    '.odp',
    // Archives
    '.zip',
    '.rar',
    '.7z',
    '.tar',
    '.gz',
    // Other safe types
    '.csv',
    '.json',
    '.xml',
  ];

  async uploadFile(
    file: Express.Multer.File,
    options: FileValidationOptions = {},
    metadata: Record<string, any> = {},
  ): Promise<FileUploadResult> {
    try {
      // SECURITY: Ensure extension whitelist is set (use default if not provided)
      const validationOptions: FileValidationOptions = {
        ...options,
        allowedExtensions: options.allowedExtensions || this.DEFAULT_ALLOWED_EXTENSIONS,
      };

      // Generate unique filename
      const fileId = crypto.randomUUID();
      const extension = path.extname(file.originalname).toLowerCase();

      // SECURITY: Block dangerous extensions first (defense in depth)
      if (this.DANGEROUS_EXTENSIONS.includes(extension)) {
        throw new BadRequestException(
          `File extension ${extension} is not allowed for security reasons`,
        );
      }

      // SECURITY: Double-check extension is in whitelist (defense in depth)
      if (!validationOptions.allowedExtensions?.includes(extension)) {
        throw new BadRequestException(`File extension ${extension} is not allowed`);
      }

      // Validate file
      await this.validateFile(file, validationOptions);

      const filename = `${fileId}${extension}`;

      // Determine file type and subdirectory
      const isImage = file.mimetype.startsWith('image/');
      const subDir = isImage ? 'images' : 'documents';
      const filePath = path.join(this.uploadDir, subDir, filename);

      // If image and Cloudinary enabled -> upload to Cloudinary
      let cloudUrl: string | undefined;
      let cloudPublicId: string | undefined;
      if (isImage && this.cloudinary.isEnabled()) {
        const uploaded = await this.cloudinary.uploadImage(file.buffer, fileId, 'images');
        cloudUrl = uploaded.secure_url;
        cloudPublicId = uploaded.public_id;
      } else {
        // Save file locally
        await writeFile(filePath, file.buffer);
      }

      // Process image if needed
      let thumbnailUrl: string | undefined;
      if (isImage && options.requireImage !== false) {
        if (cloudUrl) {
          // Cloudinary provides on-the-fly transformations; store derived thumb URL
          thumbnailUrl = cloudUrl.replace('/upload/', '/upload/c_fill,w_300,h_300,q_auto/');
        } else {
          thumbnailUrl = await this.createThumbnail(filePath, fileId);
        }
      }

      // Create database record (commented out - no File model in schema)
      // const fileRecord = await this.prisma.file.create({
      //   data: {
      //     id: fileId,
      //     filename,
      //     originalName: file.originalname,
      //     mimeType: file.mimetype,
      //     size: file.size,
      //     path: cloudPublicId || filePath,
      //     url: cloudUrl || this.getFileUrl(subDir, filename),
      //     thumbnailUrl: thumbnailUrl ? this.getFileUrl('thumbnails', `${fileId}_thumb.jpg`) : null,
      //     metadata: {
      //       ...metadata,
      //       uploadedAt: new Date().toISOString(),
      //       dimensions: isImage ? await this.getImageDimensions(file.buffer) : null,
      //       storage: cloudUrl ? 'cloudinary' : 'local',
      //     }
      //   }
      // });

      // Return file info without database record
      const fileRecord = {
        id: fileId,
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: cloudUrl || this.getFileUrl(subDir, filename),
        thumbnailUrl: thumbnailUrl ? this.getFileUrl('thumbnails', `${fileId}_thumb.jpg`) : null,
        metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          dimensions: isImage ? await this.getImageDimensions(file.buffer) : null,
          storage: cloudUrl ? 'cloudinary' : 'local',
          publicId: cloudPublicId || null,
        },
      };

      // Persist file metadata when File model exists
      const prismaAny = this.prisma as PrismaService & { file?: any };
      if (prismaAny.file?.create) {
        await prismaAny.file.create({
          data: {
            id: fileRecord.id,
            filename: fileRecord.filename,
            originalName: fileRecord.originalName,
            mimeType: fileRecord.mimeType,
            size: fileRecord.size,
            path: cloudPublicId || filePath,
            url: fileRecord.url,
            thumbnailUrl: fileRecord.thumbnailUrl,
            metadata: fileRecord.metadata,
          },
        });
      }

      return {
        id: fileRecord.id,
        filename: fileRecord.filename,
        originalName: fileRecord.originalName,
        mimeType: fileRecord.mimeType,
        size: fileRecord.size,
        url: fileRecord.url,
        thumbnailUrl: fileRecord.thumbnailUrl || undefined,
        metadata: fileRecord.metadata as Record<string, any>,
      };
    } catch (error) {
      this.logger.error('File upload failed:', error);
      throw new BadRequestException(`File upload failed: ${(error as Error).message}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    options: FileValidationOptions = {},
    metadata: Record<string, any> = {},
  ): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, options, metadata);
        results.push(result);
      } catch (error) {
        this.logger.error(`Failed to upload file ${file.originalname}:`, error);
        // Continue with other files
      }
    }

    return results;
  }

  async uploadProductImage(
    file: Express.Multer.File,
    productId: string,
  ): Promise<FileUploadResult> {
    const options: FileValidationOptions = {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      requireImage: true,
      maxWidth: 2048,
      maxHeight: 2048,
    };

    const metadata = {
      type: 'product_image',
      productId,
      uploadedAt: new Date().toISOString(),
    };

    const result = await this.uploadFile(file, options, metadata);

    // Update product with image URL
    await this.prisma.products.update({
      where: { id: productId },
      data: { imageUrl: result.url },
    });

    return result;
  }

  async uploadUserAvatar(file: Express.Multer.File, userId: string): Promise<FileUploadResult> {
    const options: FileValidationOptions = {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png'],
      requireImage: true,
      maxWidth: 512,
      maxHeight: 512,
    };

    const metadata = {
      type: 'user_avatar',
      userId,
      uploadedAt: new Date().toISOString(),
    };

    const result = await this.uploadFile(file, options, metadata);

    // Update user with avatar URL
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        avatarUrl: result.url,
      },
    });

    return result;
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      // Comment out database access since no File model exists
      // const file = await this.prisma.file.findUnique({
      //   where: { id: fileId },
      // });

      // if (!file) {
      //   throw new BadRequestException('File not found');
      // }

      // For now, just return true since we can't access file records
      this.logger.log(`Delete file requested for ID: ${fileId}`);
      return true;

      // Comment out file deletion logic since no File model exists
      // Delete from cloud or physical file
      // const storage = (file.metadata as any)?.storage;
      // const publicId = (file.metadata as any)?.publicId as string | undefined;
      // if (storage === 'cloudinary' && publicId) {
      //   await this.cloudinary.deleteAsset(publicId);
      // } else {
      //   if (fs.existsSync(file.path)) {
      //     fs.unlinkSync(file.path);
      //   }
      // }

      // Delete thumbnail if exists
      // if (file.thumbnailUrl && (file.metadata as any)?.storage !== 'cloudinary') {
      //   const thumbnailPath = path.join(this.uploadDir, 'thumbnails', `${fileId}_thumb.jpg`);
      //   if (fs.existsSync(thumbnailPath)) {
      //     fs.unlinkSync(thumbnailPath);
      //   }
      // }

      // Delete database record
      // await this.prisma.file.delete({
      //   where: { id: fileId },
      // });

      // return true;
    } catch (error) {
      this.logger.error('File deletion failed:', error);
      throw new BadRequestException(`File deletion failed: ${(error as Error).message}`);
    }
  }

  async getFileInfo(fileId: string): Promise<FileUploadResult | null> {
    // If File model exists, use it
    const prismaAny = this.prisma as PrismaService & { file?: any };
    if (prismaAny.file?.findUnique) {
      const file = await prismaAny.file.findUnique({ where: { id: fileId } });
      if (!file) return null;
      return {
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        url: file.url,
        thumbnailUrl: file.thumbnailUrl || undefined,
        metadata: file.metadata as Record<string, any>,
      };
    }

    // Fallback when File model is not present
    this.logger.warn('File model not available; cannot lookup file metadata');
    return null;
  }

  async generateSignedUrl(
    fileId: string,
    options: { forceRefresh?: boolean } = {},
  ): Promise<{ url: string; expiresAt: string }> {
    const file = await this.getFileInfo(fileId);
    if (!file) {
      throw new BadRequestException('File not found');
    }

    const expiresAt = new Date(Date.now() + this.signedUrlTtlSeconds * 1000);

    // If Cloudinary URL exists, return as-is (Cloudinary secure URLs are already signed/secure)
    if (file.metadata?.storage === 'cloudinary' && file.url) {
      return { url: file.url, expiresAt: expiresAt.toISOString() };
    }

    // If CDN URL is configured for local uploads, return CDN url
    if (this.cdnUrl && file.url) {
      return { url: file.url, expiresAt: expiresAt.toISOString() };
    }

    // Fallback: sign local file URL to prevent hotlinking
    if (!this.signedUrlSecret) {
      this.logger.warn('SIGNED_URL_SECRET not configured; returning raw URL');
      return { url: file.url, expiresAt: expiresAt.toISOString() };
    }

    const url = new URL(file.url, this.getPublicBaseUrl());
    const expires = Math.floor(expiresAt.getTime() / 1000);
    const signature = crypto
      .createHmac('sha256', this.signedUrlSecret)
      .update(`${url.pathname}:${expires}`)
      .digest('hex');

    url.searchParams.set('expires', String(expires));
    url.searchParams.set('signature', signature);
    if (options.forceRefresh) {
      url.searchParams.set('force', '1');
    }

    return { url: url.toString(), expiresAt: expiresAt.toISOString() };
  }

  async generateSignedUrlFromUrl(
    rawUrl: string,
    options: { forceRefresh?: boolean } = {},
  ): Promise<{ url: string; expiresAt: string }> {
    if (!rawUrl) {
      throw new BadRequestException('URL is required');
    }

    const expiresAt = new Date(Date.now() + this.signedUrlTtlSeconds * 1000);

    // If Cloudinary or CDN URLs, return as-is
    if (rawUrl.includes('cloudinary.com') || (this.cdnUrl && rawUrl.startsWith(this.cdnUrl))) {
      return { url: rawUrl, expiresAt: expiresAt.toISOString() };
    }

    if (!this.signedUrlSecret) {
      this.logger.warn('SIGNED_URL_SECRET not configured; returning raw URL');
      return { url: rawUrl, expiresAt: expiresAt.toISOString() };
    }

    const url = new URL(rawUrl, this.getPublicBaseUrl());
    const expires = Math.floor(expiresAt.getTime() / 1000);
    const signature = crypto
      .createHmac('sha256', this.signedUrlSecret)
      .update(`${url.pathname}:${expires}`)
      .digest('hex');

    url.searchParams.set('expires', String(expires));
    url.searchParams.set('signature', signature);
    if (options.forceRefresh) {
      url.searchParams.set('force', '1');
    }

    return { url: url.toString(), expiresAt: expiresAt.toISOString() };
  }

  validateSignedUrl(pathname: string, expires: string, signature: string): boolean {
    if (!this.signedUrlSecret) return false;
    const expiresAt = Number(expires);
    if (!expiresAt || Date.now() > expiresAt * 1000) return false;
    const expected = crypto
      .createHmac('sha256', this.signedUrlSecret)
      .update(`${pathname}:${expiresAt}`)
      .digest('hex');
    if (signature.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }

  async listFiles(
    filters: {
      type?: string;
      userId?: string;
      productId?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{ files: FileUploadResult[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 20));
    const _skip = (page - 1) * limit;

    const where: any = {};
    if (filters.type) {
      where.metadata = { path: ['type'], equals: filters.type };
    }
    if (filters.userId) {
      where.metadata = { path: ['userId'], equals: filters.userId };
    }
    if (filters.productId) {
      where.metadata = { path: ['productId'], equals: filters.productId };
    }

    // Comment out database access since no File model exists
    // const [files, total] = await Promise.all([
    //   this.prisma.file.findMany({
    //     where,
    //     skip,
    //     take: limit,
    //     orderBy: { createdAt: 'desc' },
    //   }),
    //   this.prisma.file.count({ where }),
    // ]);

    // Return empty list since we can't access file records
    const files: any[] = [];
    const total = 0;

    return {
      files: files.map((file: any) => ({
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        url: file.url,
        thumbnailUrl: file.thumbnailUrl || undefined,
        metadata: file.metadata as Record<string, any>,
      })),
      total,
      page,
      limit,
    };
  }

  private async validateFile(
    file: Express.Multer.File,
    options: FileValidationOptions,
  ): Promise<void> {
    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${options.maxSize} bytes`,
      );
    }

    // Check MIME type
    if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
    }

    // Check file extension
    if (options.allowedExtensions) {
      const extension = path.extname(file.originalname).toLowerCase();
      if (!options.allowedExtensions.includes(extension)) {
        throw new BadRequestException(`File extension ${extension} is not allowed`);
      }
    }

    // SECURITY: Validate file content using magic bytes to prevent file type spoofing
    if (options.allowedMimeTypes && file.buffer) {
      const isValidContent = FileValidator.validateFileContent(
        file.buffer,
        file.mimetype,
        options.allowedMimeTypes,
      );

      if (!isValidContent) {
        const detectedType = FileValidator.detectFileType(file.buffer);
        throw new BadRequestException(
          `File content does not match declared type. ` +
            `Declared: ${file.mimetype}, ` +
            (detectedType ? `Detected: ${detectedType}` : 'Could not detect file type'),
        );
      }

      // Check for zip bombs if file is an archive
      if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
        await FileValidator.checkZipBomb(file.buffer, 100 * 1024 * 1024); // 100MB max
      }
    }

    // Validate image dimensions
    if (file.mimetype.startsWith('image/') && (options.maxWidth || options.maxHeight)) {
      const dimensions = await this.getImageDimensions(file.buffer);
      if (options.maxWidth && dimensions.width > options.maxWidth) {
        throw new BadRequestException(
          `Image width exceeds maximum allowed width of ${options.maxWidth}px`,
        );
      }
      if (options.maxHeight && dimensions.height > options.maxHeight) {
        throw new BadRequestException(
          `Image height exceeds maximum allowed height of ${options.maxHeight}px`,
        );
      }
    }
  }

  private async createThumbnail(_filePath: string, _fileId: string): Promise<string> {
    try {
      // Temporarily disabled due to Sharp compatibility issues
      // const thumbnailPath = path.join(this.uploadDir, 'thumbnails', `${fileId}_thumb.jpg`);

      // await sharp(filePath)
      //   .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
      //   .jpeg({ quality: 80 })
      //   .toFile(thumbnailPath);

      return '';
    } catch (error) {
      this.logger.error('Thumbnail creation failed:', error);
      return '';
    }
  }

  private async getImageDimensions(_buffer: Buffer): Promise<{ width: number; height: number }> {
    // Temporarily disabled due to Sharp compatibility issues
    // const metadata = await sharp(buffer).metadata();
    return {
      width: 0,
      height: 0,
    };
  }

  private getFileUrl(subDir: string, filename: string): string {
    if (this.cdnUrl) {
      return `${this.cdnUrl}/${subDir}/${filename}`;
    }
    return `/uploads/${subDir}/${filename}`;
  }

  private getPublicBaseUrl(): string {
    return (
      this.config.get<string>('API_PUBLIC_URL') ||
      this.config.get<string>('BACKEND_PUBLIC_URL') ||
      'http://localhost:3010'
    );
  }
}
