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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsUploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const jwt_guard_1 = require("../auth/jwt.guard");
const projects_service_1 = require("./projects.service");
const cloudinary_service_1 = require("../files/cloudinary.service");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = __importStar(require("fs/promises"));
let ProjectsUploadController = class ProjectsUploadController {
    constructor(projectsService, cloudinaryService) {
        this.projectsService = projectsService;
        this.cloudinaryService = cloudinaryService;
    }
    async uploadThumbnail(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        try {
            const buffer = await fs.readFile(file.path);
            const result = await this.cloudinaryService.uploadImage(buffer, `project-thumbnail-${id}-${Date.now()}`, 'projects/thumbnails', {
                transformation: [
                    { width: 800, height: 600, crop: 'fill', gravity: 'auto' },
                    { quality: 'auto:good' },
                ],
            });
            await fs.unlink(file.path).catch(() => { });
            const updated = await this.projectsService.updateImages(id, {
                thumbnailImage: result.secure_url,
            });
            return {
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
                project: updated,
            };
        }
        catch (error) {
            await fs.unlink(file.path).catch(() => { });
            throw new common_1.BadRequestException(`Failed to upload thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadCover(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        try {
            const buffer = await fs.readFile(file.path);
            const result = await this.cloudinaryService.uploadImage(buffer, `project-cover-${id}-${Date.now()}`, 'projects/covers', {
                transformation: [
                    { width: 1920, height: 800, crop: 'fill', gravity: 'auto' },
                    { quality: 'auto:good' },
                ],
            });
            await fs.unlink(file.path).catch(() => { });
            const updated = await this.projectsService.updateImages(id, {
                coverImage: result.secure_url,
            });
            return {
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
                project: updated,
            };
        }
        catch (error) {
            await fs.unlink(file.path).catch(() => { });
            throw new common_1.BadRequestException(`Failed to upload cover: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadGallery(id, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadedUrls = [];
        const publicIds = [];
        const tempFiles = files.map(f => f.path);
        try {
            for (const file of files) {
                const buffer = await fs.readFile(file.path);
                const result = await this.cloudinaryService.uploadImage(buffer, `project-gallery-${id}-${Date.now()}-${Math.random().toString(36).substring(7)}`, 'projects/gallery', {
                    transformation: [
                        { width: 1200, height: 900, crop: 'fill', gravity: 'auto' },
                        { quality: 'auto:good' },
                    ],
                });
                uploadedUrls.push(result.secure_url);
                publicIds.push(result.public_id);
            }
            const project = await this.projectsService.findById(id);
            let existingImages = [];
            if (project.galleryImages) {
                try {
                    existingImages = JSON.parse(project.galleryImages);
                }
                catch (e) {
                    existingImages = [];
                }
            }
            const allImages = [...existingImages, ...uploadedUrls];
            const updated = await this.projectsService.updateImages(id, {
                galleryImages: JSON.stringify(allImages),
            });
            for (const tempFile of tempFiles) {
                await fs.unlink(tempFile).catch(() => { });
            }
            return {
                success: true,
                urls: uploadedUrls,
                publicIds,
                totalImages: allImages.length,
                project: updated,
            };
        }
        catch (error) {
            for (const tempFile of tempFiles) {
                await fs.unlink(tempFile).catch(() => { });
            }
            throw new common_1.BadRequestException(`Failed to upload gallery images: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async replaceGallery(id, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadedUrls = [];
        const publicIds = [];
        const tempFiles = files.map(f => f.path);
        try {
            for (const file of files) {
                const buffer = await fs.readFile(file.path);
                const result = await this.cloudinaryService.uploadImage(buffer, `project-gallery-${id}-${Date.now()}-${Math.random().toString(36).substring(7)}`, 'projects/gallery', {
                    transformation: [
                        { width: 1200, height: 900, crop: 'fill', gravity: 'auto' },
                        { quality: 'auto:good' },
                    ],
                });
                uploadedUrls.push(result.secure_url);
                publicIds.push(result.public_id);
            }
            const updated = await this.projectsService.updateImages(id, {
                galleryImages: JSON.stringify(uploadedUrls),
            });
            for (const tempFile of tempFiles) {
                await fs.unlink(tempFile).catch(() => { });
            }
            return {
                success: true,
                urls: uploadedUrls,
                publicIds,
                totalImages: uploadedUrls.length,
                project: updated,
            };
        }
        catch (error) {
            for (const tempFile of tempFiles) {
                await fs.unlink(tempFile).catch(() => { });
            }
            throw new common_1.BadRequestException(`Failed to replace gallery images: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async uploadFromUrls(id, body) {
        const updates = {};
        const results = {};
        try {
            if (body.thumbnailUrl) {
                const response = await fetch(body.thumbnailUrl);
                const buffer = Buffer.from(await response.arrayBuffer());
                const result = await this.cloudinaryService.uploadImage(buffer, `project-thumbnail-${id}-${Date.now()}`, 'projects/thumbnails', {
                    transformation: [
                        { width: 800, height: 600, crop: 'fill', gravity: 'auto' },
                        { quality: 'auto:good' },
                    ],
                });
                updates.thumbnailImage = result.secure_url;
                results.thumbnail = result.secure_url;
            }
            if (body.coverUrl) {
                const response = await fetch(body.coverUrl);
                const buffer = Buffer.from(await response.arrayBuffer());
                const result = await this.cloudinaryService.uploadImage(buffer, `project-cover-${id}-${Date.now()}`, 'projects/covers', {
                    transformation: [
                        { width: 1920, height: 800, crop: 'fill', gravity: 'auto' },
                        { quality: 'auto:good' },
                    ],
                });
                updates.coverImage = result.secure_url;
                results.cover = result.secure_url;
            }
            if (body.galleryUrls && body.galleryUrls.length > 0) {
                const uploadedGalleryUrls = [];
                for (const url of body.galleryUrls) {
                    const response = await fetch(url);
                    const buffer = Buffer.from(await response.arrayBuffer());
                    const result = await this.cloudinaryService.uploadImage(buffer, `project-gallery-${id}-${Date.now()}-${Math.random().toString(36).substring(7)}`, 'projects/gallery', {
                        transformation: [
                            { width: 1200, height: 900, crop: 'fill', gravity: 'auto' },
                            { quality: 'auto:good' },
                        ],
                    });
                    uploadedGalleryUrls.push(result.secure_url);
                }
                updates.galleryImages = JSON.stringify(uploadedGalleryUrls);
                results.gallery = uploadedGalleryUrls;
            }
            const updated = await this.projectsService.updateImages(id, updates);
            return {
                success: true,
                results,
                project: updated,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to upload images from URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
exports.ProjectsUploadController = ProjectsUploadController;
__decorate([
    (0, common_1.Post)(':id/upload-thumbnail'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload thumbnail image for project' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/temp',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, file.fieldname + '-' + uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsUploadController.prototype, "uploadThumbnail", null);
__decorate([
    (0, common_1.Post)(':id/upload-cover'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload cover image for project' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/temp',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, file.fieldname + '-' + uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsUploadController.prototype, "uploadCover", null);
__decorate([
    (0, common_1.Post)(':id/upload-gallery'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload gallery images for project' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/temp',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, file.fieldname + '-' + uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ProjectsUploadController.prototype, "uploadGallery", null);
__decorate([
    (0, common_1.Put)(':id/replace-gallery'),
    (0, swagger_1.ApiOperation)({ summary: 'Replace all gallery images for project' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/temp',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, file.fieldname + '-' + uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ProjectsUploadController.prototype, "replaceGallery", null);
__decorate([
    (0, common_1.Post)(':id/upload-from-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload images from URLs to Cloudinary' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                thumbnailUrl: { type: 'string', description: 'URL of thumbnail image' },
                coverUrl: { type: 'string', description: 'URL of cover image' },
                galleryUrls: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'URLs of gallery images',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsUploadController.prototype, "uploadFromUrls", null);
exports.ProjectsUploadController = ProjectsUploadController = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService,
        cloudinary_service_1.CloudinaryService])
], ProjectsUploadController);
//# sourceMappingURL=projects-upload.controller.js.map