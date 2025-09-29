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
    geocode(q: GeocodeQueryDto): unknown;
    directions(q: DirectionsQueryDto): unknown;
    reverse(q: ReverseQueryDto): unknown;
    placeDetail(q: PlaceDetailQueryDto): unknown;
}
export {};
