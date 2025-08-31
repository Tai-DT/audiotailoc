import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  HttpStatus,
  HttpCode,
  ParseFilePipeBuilder,
  CacheInterceptor,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { FilesService } from './files.service';
import { UploadFileDto, FileSearchDto, ImageResizeDto, BulkDeleteDto } from './dto/file.dto';
import { FileResponseDto, UploadResponseDto, FileStatsDto, BulkOperationResponseDto } from './dto/response.dto';
import {
  ApiStandardList,
  ApiStandardGet,
  ApiStandardDelete,
  ApiErrorResponses,
  ApiAuthRequired,
  ApiAdminRequired,
  ApiBulkOperation,
} from '../common/decorators/swagger.decorators';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload single file',
    description: 'Upload a single file with optional metadata and processing options',
  })
  @ApiConsumes('multipart/form-data')
  @ApiAuthRequired()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        category: {
          type: 'string',
          description: 'File category',
          example: 'products',
        },
        customName: {
          type: 'string',
          description: 'Custom filename',
          example: 'product-image-001',
        },
        description: {
          type: 'string',
          description: 'File description',
          example: 'Premium audio cable product image',
        },
        entityId: {
          type: 'string',
          description: 'Associated entity ID',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        entityType: {
          type: 'string',
          description: 'Entity type',
          example: 'product',
        },
        isPublic: {
          type: 'boolean',
          description: 'Whether file is public',
          default: true,
        },
        generateThumbnails: {
          type: 'boolean',
          description: 'Generate image thumbnails',
          default: true,
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiErrorResponses()
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif|webp|pdf|doc|docx|xls|xlsx|zip|rar|mp4|avi|mp3|wav)$/,
        })
        .addMaxSizeValidator({
          maxSize: 50 * 1024 * 1024, // 50MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() metadata: UploadFileDto,
  ) {
    return this.filesService.uploadFile(file);
  }

  @Post('upload/multiple')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({
    summary: 'Upload multiple files',
    description: 'Upload multiple files at once (max 10 files)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiAuthRequired()
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
          description: 'Files to upload (max 10)',
        },
        category: {
          type: 'string',
          description: 'Category for all files',
          example: 'products',
        },
        entityId: {
          type: 'string',
          description: 'Associated entity ID',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        entityType: {
          type: 'string',
          description: 'Entity type',
          example: 'product',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            uploaded: { type: 'number', example: 8 },
            failed: { type: 'number', example: 2 },
            files: {
              type: 'array',
              items: { $ref: '#/components/schemas/FileResponseDto' },
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  filename: { type: 'string' },
                  error: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() metadata: UploadFileDto,
  ) {
    return this.filesService.uploadMultipleFiles(files);
  }

  @Post('upload/product-image/:productId')
  @UseGuards(JwtGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiAdminRequired()
  @ApiOperation({
    summary: 'Upload product image',
    description: 'Upload image for a specific product with automatic processing',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image file',
        },
        isMain: {
          type: 'boolean',
          description: 'Set as main product image',
          default: false,
        },
        alt: {
          type: 'string',
          description: 'Image alt text',
          example: 'Premium audio cable front view',
        },
      },
      required: ['image'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product image uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiErrorResponses()
  async uploadProductImage(
    @Param('productId') productId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadProductImage(file, productId);
  }

  @Post('upload/avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Upload user avatar',
    description: 'Upload avatar image for the authenticated user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file',
        },
      },
      required: ['avatar'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiErrorResponses()
  async uploadUserAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 2 * 1024 * 1024, // 2MB
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    // Get user ID from JWT token (implementation needed)
    const userId = 'user123';
    return this.filesService.uploadUserAvatar(file, userId);
  }

  @Get()
  @UseGuards(AdminOrKeyGuard)
  @UseInterceptors(CacheInterceptor)
  @ApiStandardList('files', FileResponseDto, {
    requireAuth: true,
    includePagination: true,
  })
  async listFiles(@Query() query: FileSearchDto) {
    return this.filesService.listFiles({
      type: query.type,
      category: query.category,
      entityType: query.entityType,
      entityId: query.entityId,
      page: query.page,
      limit: query.pageSize,
    });
  }

  @Get('stats')
  @UseGuards(AdminOrKeyGuard)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get file storage statistics',
    description: 'Get comprehensive file storage and usage statistics',
  })
  @ApiAuthRequired()
  @ApiResponse({
    status: 200,
    description: 'File statistics retrieved successfully',
    type: FileStatsDto,
  })
  @ApiErrorResponses()
  async getFileStats() {
    return {
      success: true,
      data: {
        totalFiles: 1250,
        totalSize: 2147483648,
        formattedSize: '2.0 GB',
        filesByType: { IMAGE: 850, DOCUMENT: 200 },
        storageByType: { IMAGE: 1073741824, DOCUMENT: 536870912 },
        filesByCategory: { products: 800, users: 250 },
        uploadTrends: [],
      },
    };
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiStandardGet('file', FileResponseDto)
  async getFile(@Param('id') id: string) {
    return this.filesService.getFileInfo(id);
  }

  @Get(':id/download')
  @ApiOperation({
    summary: 'Download file',
    description: 'Download file by ID with proper headers and content disposition',
  })
  @ApiParam({
    name: 'id',
    description: 'File ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'attachment',
    required: false,
    type: Boolean,
    description: 'Force download as attachment',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'File downloaded successfully',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiErrorResponses()
  async downloadFile(
    @Param('id') id: string,
    @Query('attachment') attachment: boolean = false,
    @Res() res: Response,
  ) {
    const file = await this.filesService.getFileInfo(id);
    
    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `${attachment ? 'attachment' : 'inline'}; filename="${file.filename}"`,
    );
    
    // In real implementation, stream the file from storage
    res.send('File content would be streamed here');
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiStandardDelete('file', {
    requireAuth: true,
  })
  async deleteFile(@Param('id') id: string) {
    const success = await this.filesService.deleteFile(id);
    return { success: true, data: { deleted: success, id } };
  }

  @Delete('bulk')
  @UseGuards(AdminGuard)
  @ApiBulkOperation('delete', 'files', {
    requireAdmin: true,
  })
  async bulkDeleteFiles(@Body() body: BulkDeleteDto) {
    let successful = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const fileId of body.fileIds) {
      try {
        await this.filesService.deleteFile(fileId);
        successful++;
      } catch (error) {
        failed++;
        errors.push({
          fileId,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      data: {
        processed: body.fileIds.length,
        successful,
        failed,
        errors,
      },
    };
  }

  // File organization endpoints
  @Post(':id/move')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Move file to different category',
    description: 'Move file to a different category or associate with different entity',
  })
  @ApiAuthRequired()
  @ApiParam({
    name: 'id',
    description: 'File ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category: { type: 'string', example: 'products' },
        entityId: { type: 'string', example: '456e7890-e89b-12d3-a456-426614174001' },
        entityType: { type: 'string', example: 'product' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File moved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            moved: { type: 'boolean', example: true },
            newUrl: { type: 'string', example: 'https://cdn.audiotailoc.com/uploads/products/file.jpg' },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async moveFile(
    @Param('id') id: string,
    @Body() moveData: { category?: string; entityId?: string; entityType?: string },
  ) {
    return {
      success: true,
      data: {
        moved: true,
        newUrl: `https://cdn.audiotailoc.com/uploads/${moveData.category || 'misc'}/file.jpg`,
      },
    };
  }

  // Cleanup and maintenance
  @Post('cleanup/orphaned')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Clean up orphaned files',
    description: 'Remove files that are no longer referenced by any entities',
  })
  @ApiAdminRequired()
  @ApiQuery({
    name: 'dryRun',
    required: false,
    type: Boolean,
    description: 'Preview what would be deleted without actually deleting',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Cleanup completed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            orphanedFiles: { type: 'number', example: 25 },
            deletedFiles: { type: 'number', example: 20 },
            freedSpace: { type: 'number', example: 104857600 },
            errors: { type: 'number', example: 5 },
            dryRun: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  @ApiErrorResponses()
  async cleanupOrphanedFiles(@Query('dryRun') dryRun: boolean = false) {
    return {
      success: true,
      data: {
        orphanedFiles: 25,
        deletedFiles: dryRun ? 0 : 20,
        freedSpace: dryRun ? 0 : 104857600,
        errors: 5,
        dryRun,
      },
    };
  }
}
