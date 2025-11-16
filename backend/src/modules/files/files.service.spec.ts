import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from './cloudinary.service';
import { FilesService, FileValidationOptions } from './files.service';
import { BadRequestException } from '@nestjs/common';

describe('FilesService', () => {
  let service: FilesService;
  let configService: ConfigService;
  let prismaService: PrismaService;
  let cloudinaryService: CloudinaryService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockPrismaService = {
    products: {
      update: jest.fn(),
    },
    users: {
      update: jest.fn(),
    },
  };

  const mockCloudinaryService = {
    isEnabled: jest.fn(),
    uploadImage: jest.fn(),
    deleteAsset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);

    // Mock default config values
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        UPLOAD_DIR: './uploads',
        CDN_URL: '',
      };
      return config[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'test-image.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 1024,
      destination: '/tmp',
      filename: 'test-image.png',
      path: '/tmp/test-image.png',
      buffer: Buffer.from('test image content'),
    };

    it('should upload file successfully with Cloudinary enabled', async () => {
      mockCloudinaryService.isEnabled.mockReturnValue(true);
      mockCloudinaryService.uploadImage.mockResolvedValue({
        secure_url: 'https://cloudinary.com/image.png',
        public_id: 'images/test-id',
      });

      const options: FileValidationOptions = {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg'],
      };

      const result = await service.uploadFile(mockFile, options);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          filename: expect.stringMatching(/\.png$/),
          originalName: 'test-image.png',
          mimeType: 'image/png',
          size: 1024,
          url: 'https://cloudinary.com/image.png',
          thumbnailUrl: expect.any(String),
          metadata: expect.objectContaining({
            uploadedAt: expect.any(String),
            storage: 'cloudinary',
            publicId: 'images/test-id',
          }),
        })
      );

      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockFile.buffer,
        expect.any(String),
        'images'
      );
    });

    it('should upload file successfully with Cloudinary disabled', async () => {
      mockCloudinaryService.isEnabled.mockReturnValue(false);

      const options: FileValidationOptions = {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg'],
      };

      const result = await service.uploadFile(mockFile, options);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          filename: expect.stringMatching(/\.png$/),
          originalName: 'test-image.png',
          mimeType: 'image/png',
          size: 1024,
          url: expect.stringContaining('/uploads/images/'),
          metadata: expect.objectContaining({
            uploadedAt: expect.any(String),
            storage: 'local',
          }),
        })
      );

      expect(mockCloudinaryService.uploadImage).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid file type', async () => {
      const invalidFile = {
        ...mockFile,
        mimetype: 'application/pdf',
      };

      const options: FileValidationOptions = {
        allowedMimeTypes: ['image/png', 'image/jpeg'],
      };

      await expect(service.uploadFile(invalidFile, options))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for oversized file', async () => {
      const oversizedFile = {
        ...mockFile,
        size: 10 * 1024 * 1024, // 10MB
      };

      const options: FileValidationOptions = {
        maxSize: 5 * 1024 * 1024, // 5MB
      };

      await expect(service.uploadFile(oversizedFile, options))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid file extension', async () => {
      const invalidFile = {
        ...mockFile,
        originalname: 'test-file.exe',
      };

      const options: FileValidationOptions = {
        allowedExtensions: ['.png', '.jpg', '.jpeg'],
      };

      await expect(service.uploadFile(invalidFile, options))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('uploadProductImage', () => {
    const mockImageFile = {
      fieldname: 'image',
      originalname: 'product-image.png',
      mimetype: 'image/png',
      size: 2048,
      buffer: Buffer.from('product image content'),
    };

    it('should upload product image and update product', async () => {
      const productId = 'product-123';
      mockCloudinaryService.isEnabled.mockReturnValue(true);
      mockCloudinaryService.uploadImage.mockResolvedValue({
        secure_url: 'https://cloudinary.com/product-image.png',
        public_id: 'images/product-image-id',
      });

      mockPrismaService.products.update.mockResolvedValue({
        id: productId,
        imageUrl: 'https://cloudinary.com/product-image.png',
      });

      const result = await service.uploadProductImage(mockImageFile, productId);

      expect(result).toEqual(
        expect.objectContaining({
          metadata: expect.objectContaining({
            type: 'product_image',
            productId,
          }),
        })
      );

      expect(mockPrismaService.products.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { imageUrl: 'https://cloudinary.com/product-image.png' },
      });
    });
  });

  describe('uploadUserAvatar', () => {
    const mockAvatarFile = {
      fieldname: 'avatar',
      originalname: 'user-avatar.png',
      mimetype: 'image/png',
      size: 1024,
      buffer: Buffer.from('avatar image content'),
    };

    it('should upload user avatar and update user', async () => {
      const userId = 'user-123';
      mockCloudinaryService.isEnabled.mockReturnValue(true);
      mockCloudinaryService.uploadImage.mockResolvedValue({
        secure_url: 'https://cloudinary.com/user-avatar.png',
        public_id: 'images/user-avatar-id',
      });

      mockPrismaService.users.update.mockResolvedValue({
        id: userId,
      });

      const result = await service.uploadUserAvatar(mockAvatarFile, userId);

      expect(result).toEqual(
        expect.objectContaining({
          metadata: expect.objectContaining({
            type: 'user_avatar',
            userId,
          }),
        })
      );

      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {},
      });
    });
  });

  describe('deleteFile', () => {
    it('should return true for file deletion', async () => {
      const fileId = 'file-123';

      const result = await service.deleteFile(fileId);

      expect(result).toBe(true);
    });
  });

  describe('getFileInfo', () => {
    it('should return null for file info', async () => {
      const fileId = 'file-123';

      const result = await service.getFileInfo(fileId);

      expect(result).toBe(null);
    });
  });

  describe('listFiles', () => {
    it('should return empty file list', async () => {
      const filters = {
        page: 1,
        limit: 20,
      };

      const result = await service.listFiles(filters);

      expect(result).toEqual({
        files: [],
        total: 0,
        page: 1,
        limit: 20,
      });
    });

    it('should handle pagination correctly', async () => {
      const filters = {
        page: 2,
        limit: 10,
      };

      const result = await service.listFiles(filters);

      expect(result).toEqual({
        files: [],
        total: 0,
        page: 2,
        limit: 10,
      });
    });
  });

  describe('uploadMultipleFiles', () => {
    const mockFiles = [
      {
        fieldname: 'files',
        originalname: 'file1.png',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('file1 content'),
      },
      {
        fieldname: 'files',
        originalname: 'file2.jpg',
        mimetype: 'image/jpeg',
        size: 2048,
        buffer: Buffer.from('file2 content'),
      },
    ];

    it('should upload multiple files successfully', async () => {
      mockCloudinaryService.isEnabled.mockReturnValue(true);
      mockCloudinaryService.uploadImage
        .mockResolvedValueOnce({
          secure_url: 'https://cloudinary.com/file1.png',
          public_id: 'images/file1-id',
        })
        .mockResolvedValueOnce({
          secure_url: 'https://cloudinary.com/file2.jpg',
          public_id: 'images/file2-id',
        });

      const options: FileValidationOptions = {
        allowedMimeTypes: ['image/png', 'image/jpeg'],
      };

      const result = await service.uploadMultipleFiles(mockFiles, options);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        expect.objectContaining({
          originalName: 'file1.png',
          mimeType: 'image/png',
        })
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          originalName: 'file2.jpg',
          mimeType: 'image/jpeg',
        })
      );
    });

    it('should continue uploading other files if one fails', async () => {
      mockCloudinaryService.isEnabled.mockReturnValue(true);
      mockCloudinaryService.uploadImage
        .mockResolvedValueOnce({
          secure_url: 'https://cloudinary.com/file1.png',
          public_id: 'images/file1-id',
        })
        .mockRejectedValueOnce(new Error('Upload failed'));

      const options: FileValidationOptions = {
        allowedMimeTypes: ['image/png', 'image/jpeg'],
      };

      const result = await service.uploadMultipleFiles(mockFiles, options);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          originalName: 'file1.png',
        })
      );
    });
  });
});