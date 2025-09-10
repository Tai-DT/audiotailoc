import {
  Controller,
  Post,
  Put,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { ProjectsService } from './projects.service';
import { CloudinaryService } from '../files/cloudinary.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs/promises';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtGuard, AdminGuard)
export class ProjectsUploadController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post(':id/upload-thumbnail')
  @ApiOperation({ summary: 'Upload thumbnail image for project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadThumbnail(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      // Read file buffer
      const buffer = await fs.readFile(file.path);
      
      // Upload to Cloudinary
      const result = await this.cloudinaryService.uploadImage(
        buffer,
        `project-thumbnail-${id}-${Date.now()}`,
        'projects/thumbnails',
        {
          transformation: [
            { width: 800, height: 600, crop: 'fill', gravity: 'auto' },
            { quality: 'auto:good' },
          ],
        },
      );

      // Clean up temp file
      await fs.unlink(file.path).catch(() => {});

      // Update project with new thumbnail URL
      const updated = await this.projectsService.updateImages(id, {
        thumbnailImage: result.secure_url,
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        project: updated,
      };
    } catch (error) {
      // Clean up temp file on error
      await fs.unlink(file.path).catch(() => {});
      throw new BadRequestException(`Failed to upload thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Post(':id/upload-cover')
  @ApiOperation({ summary: 'Upload cover image for project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB for cover images
      },
    }),
  )
  async uploadCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      // Read file buffer
      const buffer = await fs.readFile(file.path);
      
      // Upload to Cloudinary
      const result = await this.cloudinaryService.uploadImage(
        buffer,
        `project-cover-${id}-${Date.now()}`,
        'projects/covers',
        {
          transformation: [
            { width: 1920, height: 800, crop: 'fill', gravity: 'auto' },
            { quality: 'auto:good' },
          ],
        },
      );

      // Clean up temp file
      await fs.unlink(file.path).catch(() => {});

      // Update project with new cover URL
      const updated = await this.projectsService.updateImages(id, {
        coverImage: result.secure_url,
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        project: updated,
      };
    } catch (error) {
      // Clean up temp file on error
      await fs.unlink(file.path).catch(() => {});
      throw new BadRequestException(`Failed to upload cover: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Post(':id/upload-gallery')
  @ApiOperation({ summary: 'Upload gallery images for project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
      },
    }),
  )
  async uploadGallery(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedUrls: string[] = [];
    const publicIds: string[] = [];
    const tempFiles: string[] = files.map(f => f.path);

    try {
      // Upload all files to Cloudinary
      for (const file of files) {
        const buffer = await fs.readFile(file.path);
        
        const result = await this.cloudinaryService.uploadImage(
          buffer,
          `project-gallery-${id}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          'projects/gallery',
          {
            transformation: [
              { width: 1200, height: 900, crop: 'fill', gravity: 'auto' },
              { quality: 'auto:good' },
            ],
          },
        );

        uploadedUrls.push(result.secure_url);
        publicIds.push(result.public_id);
      }

      // Get existing gallery images
      const project = await this.projectsService.findById(id);
      let existingImages: string[] = [];
      
      if (project.galleryImages) {
        try {
          existingImages = JSON.parse(project.galleryImages as string);
        } catch (e) {
          existingImages = [];
        }
      }

      // Combine with new images
      const allImages = [...existingImages, ...uploadedUrls];

      // Update project with new gallery URLs
      const updated = await this.projectsService.updateImages(id, {
        galleryImages: JSON.stringify(allImages),
      });

      // Clean up temp files
      for (const tempFile of tempFiles) {
        await fs.unlink(tempFile).catch(() => {});
      }

      return {
        success: true,
        urls: uploadedUrls,
        publicIds,
        totalImages: allImages.length,
        project: updated,
      };
    } catch (error) {
      // Clean up temp files on error
      for (const tempFile of tempFiles) {
        await fs.unlink(tempFile).catch(() => {});
      }
      throw new BadRequestException(`Failed to upload gallery images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Put(':id/replace-gallery')
  @ApiOperation({ summary: 'Replace all gallery images for project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
      },
    }),
  )
  async replaceGallery(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedUrls: string[] = [];
    const publicIds: string[] = [];
    const tempFiles: string[] = files.map(f => f.path);

    try {
      // Upload all files to Cloudinary
      for (const file of files) {
        const buffer = await fs.readFile(file.path);
        
        const result = await this.cloudinaryService.uploadImage(
          buffer,
          `project-gallery-${id}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          'projects/gallery',
          {
            transformation: [
              { width: 1200, height: 900, crop: 'fill', gravity: 'auto' },
              { quality: 'auto:good' },
            ],
          },
        );

        uploadedUrls.push(result.secure_url);
        publicIds.push(result.public_id);
      }

      // Replace gallery with new images
      const updated = await this.projectsService.updateImages(id, {
        galleryImages: JSON.stringify(uploadedUrls),
      });

      // Clean up temp files
      for (const tempFile of tempFiles) {
        await fs.unlink(tempFile).catch(() => {});
      }

      return {
        success: true,
        urls: uploadedUrls,
        publicIds,
        totalImages: uploadedUrls.length,
        project: updated,
      };
    } catch (error) {
      // Clean up temp files on error
      for (const tempFile of tempFiles) {
        await fs.unlink(tempFile).catch(() => {});
      }
      throw new BadRequestException(`Failed to replace gallery images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Post(':id/upload-from-url')
  @ApiOperation({ summary: 'Upload images from URLs to Cloudinary' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnailUrl: { type: 'string', description: 'URL of thumbnail image' },
        coverUrl: { type: 'string', description: 'URL of cover image' },
        galleryUrls: { 
          type: 'array',
          items: { type: 'string' },
          description: 'URLs of gallery images' 
        },
      },
    },
  })
  async uploadFromUrls(
    @Param('id') id: string,
    @Body() body: {
      thumbnailUrl?: string;
      coverUrl?: string;
      galleryUrls?: string[];
    },
  ) {
    const updates: any = {};
    const results: any = {};

    try {
      // Upload thumbnail from URL
      if (body.thumbnailUrl) {
        const response = await fetch(body.thumbnailUrl);
        const buffer = Buffer.from(await response.arrayBuffer());
        
        const result = await this.cloudinaryService.uploadImage(
          buffer,
          `project-thumbnail-${id}-${Date.now()}`,
          'projects/thumbnails',
          {
            transformation: [
              { width: 800, height: 600, crop: 'fill', gravity: 'auto' },
              { quality: 'auto:good' },
            ],
          },
        );
        
        updates.thumbnailImage = result.secure_url;
        results.thumbnail = result.secure_url;
      }

      // Upload cover from URL
      if (body.coverUrl) {
        const response = await fetch(body.coverUrl);
        const buffer = Buffer.from(await response.arrayBuffer());
        
        const result = await this.cloudinaryService.uploadImage(
          buffer,
          `project-cover-${id}-${Date.now()}`,
          'projects/covers',
          {
            transformation: [
              { width: 1920, height: 800, crop: 'fill', gravity: 'auto' },
              { quality: 'auto:good' },
            ],
          },
        );
        
        updates.coverImage = result.secure_url;
        results.cover = result.secure_url;
      }

      // Upload gallery from URLs
      if (body.galleryUrls && body.galleryUrls.length > 0) {
        const uploadedGalleryUrls: string[] = [];
        
        for (const url of body.galleryUrls) {
          const response = await fetch(url);
          const buffer = Buffer.from(await response.arrayBuffer());
          
          const result = await this.cloudinaryService.uploadImage(
            buffer,
            `project-gallery-${id}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            'projects/gallery',
            {
              transformation: [
                { width: 1200, height: 900, crop: 'fill', gravity: 'auto' },
                { quality: 'auto:good' },
              ],
            },
          );
          
          uploadedGalleryUrls.push(result.secure_url);
        }
        
        updates.galleryImages = JSON.stringify(uploadedGalleryUrls);
        results.gallery = uploadedGalleryUrls;
      }

      // Update project with new image URLs
      const updated = await this.projectsService.updateImages(id, updates);

      return {
        success: true,
        results,
        project: updated,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload images from URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
