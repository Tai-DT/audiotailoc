import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SettingsController } from '../settings.controller';
import { SettingsService } from '../settings.service';
import { JwtGuard } from '../../auth/jwt.guard';
import { AdminOrKeyGuard } from '../../auth/admin-or-key.guard';

describe('SettingsController', () => {
  let controller: SettingsController;
  let service: SettingsService;

  const mockSettingsService = {
    findAll: jest.fn(),
    update: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: mockSettingsService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    })
    .overrideGuard(JwtGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(AdminOrKeyGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<SettingsController>(SettingsController);
    service = module.get<SettingsService>(SettingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all settings', async () => {
      const mockSettings = {
        general: {
          siteName: 'Test Site',
        },
      };
      mockSettingsService.findAll.mockResolvedValue(mockSettings);

      const result = await controller.findAll();

      expect(result).toEqual(mockSettings);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update settings', async () => {
      const updateData = {
        general: {
          siteName: 'Updated Site',
        },
      };
      const expectedResponse = {
        success: true,
        message: 'Settings updated successfully',
        data: updateData,
      };
      mockSettingsService.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(updateData);

      expect(result).toEqual(expectedResponse);
      expect(service.update).toHaveBeenCalledWith(updateData);
    });
  });
});
