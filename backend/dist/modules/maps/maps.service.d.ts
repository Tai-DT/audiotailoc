import { ConfigService } from '@nestjs/config';
export declare class MapsService {
    private readonly config;
    constructor(config: ConfigService);
    private get apiKey();
    geocode(query: string): Promise<any>;
    directions(from: string, to: string): Promise<any>;
    reverseGeocode(latlng: string): Promise<any>;
    placeDetail(placeId: string): Promise<any>;
}
