import { ConfigService } from '@nestjs/config';
export declare class MapsService {
    private readonly config;
    constructor(config: ConfigService);
    private get apiKey();
    geocode(query: string): unknown;
    directions(from: string, to: string): unknown;
    reverseGeocode(latlng: string): unknown;
    placeDetail(placeId: string): unknown;
}
