import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MapsService {
  constructor(private readonly config: ConfigService) {}

  private get apiKey() {
    return this.config.get<string>('GOONG_API_KEY');
  }

  async geocode(query: string) {
    const key = this.apiKey;
    if (!key) return { items: [] };
    const url = new URL('https://rsapi.goong.io/Place/AutoComplete');
    url.searchParams.set('api_key', key);
    url.searchParams.set('input', query);
    const res = await fetch(url.toString());
    const data = await res.json();
    return data;
  }

  async directions(from: string, to: string) {
    const key = this.apiKey;
    if (!key) return { routes: [] };
    const url = new URL('https://rsapi.goong.io/Direction');
    url.searchParams.set('api_key', key);
    url.searchParams.set('origin', from);
    url.searchParams.set('destination', to);
    const res = await fetch(url.toString());
    const data = await res.json();
    return data;
  }

  async reverseGeocode(latlng: string) {
    const key = this.apiKey;
    if (!key) return { results: [] };
    const url = new URL('https://rsapi.goong.io/Geocode');
    url.searchParams.set('api_key', key);
    url.searchParams.set('latlng', latlng);
    const res = await fetch(url.toString());
    const data = await res.json();
    return data;
  }

  async placeDetail(placeId: string) {
    const key = this.apiKey;
    if (!key) return { result: null };
    const url = new URL('https://rsapi.goong.io/Place/Detail');
    url.searchParams.set('api_key', key);
    url.searchParams.set('place_id', placeId);
    const res = await fetch(url.toString());
    const data = await res.json();
    return data;
  }
}


