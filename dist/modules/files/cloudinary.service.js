"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(CloudinaryService_1.name);
        const url = this.config.get('CLOUDINARY_URL');
        const cloudName = this.config.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.config.get('CLOUDINARY_API_KEY');
        const apiSecret = this.config.get('CLOUDINARY_API_SECRET');
        this.enabled = Boolean(url || cloudName);
        if (url) {
            cloudinary_1.v2.config({ url, secure: true });
        }
        else {
            cloudinary_1.v2.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
                secure: true,
            });
        }
    }
    isEnabled() {
        return this.enabled;
    }
    async uploadImage(buffer, filename, folder = 'uploads', options = {}) {
        if (!this.enabled) {
            throw new Error('Cloudinary is not enabled. Configure CLOUDINARY_* envs.');
        }
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                public_id: filename,
                resource_type: 'image',
                overwrite: true,
                ...options,
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            uploadStream.end(buffer);
        });
    }
    async deleteAsset(publicId) {
        if (!this.enabled)
            return;
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (err) {
            this.logger.warn(`Failed to delete Cloudinary asset ${publicId}: ${err}`);
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map