import { Test, TestingModule } from '@nestjs/testing';
import { MapsService } from '../../src/modules/maps/maps.service';
import { ConfigService } from '@nestjs/config';

describe('MapsService', () => {
  let service: MapsService;

  const mockConfig = {
    get: jest.fn((key: string) => key === 'GOONG_API_KEY' ? 'test_key' : undefined),
  };

  beforeEach(async () => {
    (global as any).fetch = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapsService,
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get(MapsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('geocode should call Goong autocomplete API', async () => {
    (fetch as any).mockResolvedValue({ json: async () => ({ predictions: [] }) });

    const result = await service.geocode('Hanoi');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect((fetch as any).mock.calls[0][0]).toContain('Place/AutoComplete');
    expect((fetch as any).mock.calls[0][0]).toContain('api_key=test_key');
    expect((fetch as any).mock.calls[0][0]).toContain('input=Hanoi');
    expect(result).toEqual({ predictions: [] });
  });

  it('directions should call Goong direction API', async () => {
    (fetch as any).mockResolvedValue({ json: async () => ({ routes: [] }) });

    const result = await service.directions('21.0,105.8', '21.03,105.85');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect((fetch as any).mock.calls[0][0]).toContain('Direction');
    expect((fetch as any).mock.calls[0][0]).toContain('origin=21.0%2C105.8');
    expect((fetch as any).mock.calls[0][0]).toContain('destination=21.03%2C105.85');
    expect(result).toEqual({ routes: [] });
  });

  it('reverseGeocode should call Goong geocode API', async () => {
    (fetch as any).mockResolvedValue({ json: async () => ({ results: [] }) });

    const result = await service.reverseGeocode('21.0,105.8');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect((fetch as any).mock.calls[0][0]).toContain('Geocode');
    expect((fetch as any).mock.calls[0][0]).toContain('latlng=21.0%2C105.8');
    expect(result).toEqual({ results: [] });
  });

  it('placeDetail should call Goong place detail API', async () => {
    (fetch as any).mockResolvedValue({ json: async () => ({ result: { name: 'Place' } }) });

    const result = await service.placeDetail('place123');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect((fetch as any).mock.calls[0][0]).toContain('Place/Detail');
    expect((fetch as any).mock.calls[0][0]).toContain('place_id=place123');
    expect(result).toEqual({ result: { name: 'Place' } });
  });
});
