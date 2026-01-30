import { Controller, Get, Query } from '@nestjs/common';
import { IsString } from 'class-validator';
import { MapsService } from './maps.service';

class GeocodeQueryDto {
  @IsString()
  query!: string;
}

class DirectionsQueryDto {
  @IsString()
  from!: string;

  @IsString()
  to!: string;
}

class ReverseQueryDto {
  @IsString()
  latlng!: string; // format: "lat,lng"
}

class PlaceDetailQueryDto {
  @IsString()
  placeId!: string;
}

@Controller('maps')
export class MapsController {
  constructor(private readonly maps: MapsService) {}

  @Get('geocode')
  geocode(@Query() q: GeocodeQueryDto) {
    return this.maps.geocode(q.query);
  }

  @Get('directions')
  directions(@Query() q: DirectionsQueryDto) {
    return this.maps.directions(q.from, q.to);
  }

  @Get('reverse')
  reverse(@Query() q: ReverseQueryDto) {
    return this.maps.reverseGeocode(q.latlng);
  }

  @Get('place-detail')
  placeDetail(@Query() q: PlaceDetailQueryDto) {
    return this.maps.placeDetail(q.placeId);
  }
}
