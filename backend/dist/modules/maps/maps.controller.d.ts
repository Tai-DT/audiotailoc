import { MapsService } from './maps.service';
declare class GeocodeQueryDto {
    query: string;
}
declare class DirectionsQueryDto {
    from: string;
    to: string;
}
declare class ReverseQueryDto {
    latlng: string;
}
declare class PlaceDetailQueryDto {
    placeId: string;
}
export declare class MapsController {
    private readonly maps;
    constructor(maps: MapsService);
    geocode(q: GeocodeQueryDto): Promise<any>;
    directions(q: DirectionsQueryDto): Promise<any>;
    reverse(q: ReverseQueryDto): Promise<any>;
    placeDetail(q: PlaceDetailQueryDto): Promise<any>;
}
export {};
