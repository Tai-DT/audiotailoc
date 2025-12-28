"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const cloudinary_service_1 = require("./cloudinary.service");
const file_validator_1 = require("../../common/security/file-validator");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const util_1 = require("util");
const writeFile = (0, util_1.promisify)(fs.writeFile);
const mkdir = (0, util_1.promisify)(fs.mkdir);
let FilesService = FilesService_1 = class FilesService {
    constructor(config, prisma, cloudinary) {
        this.config = config;
        this.prisma = prisma;
        this.cloudinary = cloudinary;
        this.logger = new common_1.Logger(FilesService_1.name);
        this.DANGEROUS_EXTENSIONS = [
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
        this.DEFAULT_ALLOWED_EXTENSIONS = [
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.webp',
            '.svg',
            '.bmp',
            '.ico',
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
            '.zip',
            '.rar',
            '.7z',
            '.tar',
            '.gz',
            '.csv',
            '.json',
            '.xml',
        ];
        this.uploadDir = this.config.get('UPLOAD_DIR', './uploads');
        this.cdnUrl = this.config.get('CDN_URL', '');
        this.ensureUploadDir();
    }
    async ensureUploadDir() {
        try {
            await mkdir(this.uploadDir, { recursive: true });
            await mkdir(path.join(this.uploadDir, 'images'), { recursive: true });
            await mkdir(path.join(this.uploadDir, 'documents'), { recursive: true });
            await mkdir(path.join(this.uploadDir, 'thumbnails'), { recursive: true });
        }
        catch (error) {
            this.logger.error('Failed to create upload directories:', error);
        }
    }
    async uploadFile(file, options = {}, metadata = {}) {
        try {
            const validationOptions = {
                ...options,
                allowedExtensions: options.allowedExtensions || this.DEFAULT_ALLOWED_EXTENSIONS,
            };
            const fileId = crypto.randomUUID();
            const extension = path.extname(file.originalname).toLowerCase();
            if (this.DANGEROUS_EXTENSIONS.includes(extension)) {
                throw new common_1.BadRequestException(`File extension ${extension} is not allowed for security reasons`);
            }
            if (!validationOptions.allowedExtensions?.includes(extension)) {
                throw new common_1.BadRequestException(`File extension ${extension} is not allowed`);
            }
            await this.validateFile(file, validationOptions);
            const filename = `${fileId}${extension}`;
            const isImage = file.mimetype.startsWith('image/');
            const subDir = isImage ? 'images' : 'documents';
            const filePath = path.join(this.uploadDir, subDir, filename);
            let cloudUrl;
            let cloudPublicId;
            if (isImage && this.cloudinary.isEnabled()) {
                const uploaded = await this.cloudinary.uploadImage(file.buffer, fileId, 'images');
                cloudUrl = uploaded.secure_url;
                cloudPublicId = uploaded.public_id;
            }
            else {
                await writeFile(filePath, file.buffer);
            }
            let thumbnailUrl;
            if (isImage && options.requireImage !== false) {
                if (cloudUrl) {
                    thumbnailUrl = cloudUrl.replace('/upload/', '/upload/c_fill,w_300,h_300,q_auto/');
                }
                else {
                    thumbnailUrl = await this.createThumbnail(filePath, fileId);
                }
            }
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
            return {
                id: fileRecord.id,
                filename: fileRecord.filename,
                originalName: fileRecord.originalName,
                mimeType: fileRecord.mimeType,
                size: fileRecord.size,
                url: fileRecord.url,
                thumbnailUrl: fileRecord.thumbnailUrl || undefined,
                metadata: fileRecord.metadata,
            };
        }
        catch (error) {
            this.logger.error('File upload failed:', error);
            throw new common_1.BadRequestException(`File upload failed: ${error.message}`);
        }
    }
    async uploadMultipleFiles(files, options = {}, metadata = {}) {
        const results = [];
        for (const file of files) {
            try {
                const result = await this.uploadFile(file, options, metadata);
                results.push(result);
            }
            catch (error) {
                this.logger.error(`Failed to upload file ${file.originalname}:`, error);
            }
        }
        return results;
    }
    async uploadProductImage(file, productId) {
        const options = {
            maxSize: 5 * 1024 * 1024,
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
        await this.prisma.products.update({
            where: { id: productId },
            data: { imageUrl: result.url },
        });
        return result;
    }
    async uploadUserAvatar(file, userId) {
        const options = {
            maxSize: 2 * 1024 * 1024,
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
        await this.prisma.users.update({
            where: { id: userId },
            data: {
                avatarUrl: result.url,
            },
        });
        return result;
    }
    async deleteFile(fileId) {
        try {
            this.logger.log(`Delete file requested for ID: ${fileId}`);
            return true;
        }
        catch (error) {
            this.logger.error('File deletion failed:', error);
            throw new common_1.BadRequestException(`File deletion failed: ${error.message}`);
        }
    }
    async getFileInfo(fileId) {
        this.logger.log(`File info requested for ID: ${fileId}`);
        return null;
    }
    async listFiles(filters = {}) {
        const page = Math.max(1, filters.page || 1);
        const limit = Math.min(100, Math.max(1, filters.limit || 20));
        const _skip = (page - 1) * limit;
        const where = {};
        if (filters.type) {
            where.metadata = { path: ['type'], equals: filters.type };
        }
        if (filters.userId) {
            where.metadata = { path: ['userId'], equals: filters.userId };
        }
        if (filters.productId) {
            where.metadata = { path: ['productId'], equals: filters.productId };
        }
        const files = [];
        const total = 0;
        return {
            files: files.map((file) => ({
                id: file.id,
                filename: file.filename,
                originalName: file.originalName,
                mimeType: file.mimeType,
                size: file.size,
                url: file.url,
                thumbnailUrl: file.thumbnailUrl || undefined,
                metadata: file.metadata,
            })),
            total,
            page,
            limit,
        };
    }
    async validateFile(file, options) {
        if (options.maxSize && file.size > options.maxSize) {
            throw new common_1.BadRequestException(`File size exceeds maximum allowed size of ${options.maxSize} bytes`);
        }
        if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`File type ${file.mimetype} is not allowed`);
        }
        if (options.allowedExtensions) {
            const extension = path.extname(file.originalname).toLowerCase();
            if (!options.allowedExtensions.includes(extension)) {
                throw new common_1.BadRequestException(`File extension ${extension} is not allowed`);
            }
        }
        if (options.allowedMimeTypes && file.buffer) {
            const isValidContent = file_validator_1.FileValidator.validateFileContent(file.buffer, file.mimetype, options.allowedMimeTypes);
            if (!isValidContent) {
                const detectedType = file_validator_1.FileValidator.detectFileType(file.buffer);
                throw new common_1.BadRequestException(`File content does not match declared type. ` +
                    `Declared: ${file.mimetype}, ` +
                    (detectedType ? `Detected: ${detectedType}` : 'Could not detect file type'));
            }
            if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
                await file_validator_1.FileValidator.checkZipBomb(file.buffer, 100 * 1024 * 1024);
            }
        }
        if (file.mimetype.startsWith('image/') && (options.maxWidth || options.maxHeight)) {
            const dimensions = await this.getImageDimensions(file.buffer);
            if (options.maxWidth && dimensions.width > options.maxWidth) {
                throw new common_1.BadRequestException(`Image width exceeds maximum allowed width of ${options.maxWidth}px`);
            }
            if (options.maxHeight && dimensions.height > options.maxHeight) {
                throw new common_1.BadRequestException(`Image height exceeds maximum allowed height of ${options.maxHeight}px`);
            }
        }
    }
    async createThumbnail(_filePath, _fileId) {
        try {
            return '';
        }
        catch (error) {
            this.logger.error('Thumbnail creation failed:', error);
            return '';
        }
    }
    async getImageDimensions(_buffer) {
        return {
            width: 0,
            height: 0,
        };
    }
    getFileUrl(subDir, filename) {
        if (this.cdnUrl) {
            return `${this.cdnUrl}/${subDir}/${filename}`;
        }
        return `/uploads/${subDir}/${filename}`;
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = FilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], FilesService);
//# sourceMappingURL=files.service.js.map