"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MapsService = class MapsService {
    constructor(config) {
        this.config = config;
    }
    get apiKey() {
        return this.config.get('GOONG_API_KEY');
    }
    async geocode(query) {
        const key = this.apiKey;
        if (!key)
            return { items: [] };
        const url = new URL('https://rsapi.goong.io/Place/AutoComplete');
        url.searchParams.set('api_key', key);
        url.searchParams.set('input', query);
        const res = await fetch(url.toString());
        const data = await res.json();
        return data;
    }
    async directions(from, to) {
        const key = this.apiKey;
        if (!key)
            return { routes: [] };
        const url = new URL('https://rsapi.goong.io/Direction');
        url.searchParams.set('api_key', key);
        url.searchParams.set('origin', from);
        url.searchParams.set('destination', to);
        const res = await fetch(url.toString());
        const data = await res.json();
        return data;
    }
    async reverseGeocode(latlng) {
        const key = this.apiKey;
        if (!key)
            return { results: [] };
        const url = new URL('https://rsapi.goong.io/Geocode');
        url.searchParams.set('api_key', key);
        url.searchParams.set('latlng', latlng);
        const res = await fetch(url.toString());
        const data = await res.json();
        return data;
    }
    async placeDetail(placeId) {
        const key = this.apiKey;
        if (!key)
            return { result: null };
        const url = new URL('https://rsapi.goong.io/Place/Detail');
        url.searchParams.set('api_key', key);
        url.searchParams.set('place_id', placeId);
        const res = await fetch(url.toString());
        const data = await res.json();
        return data;
    }
};
exports.MapsService = MapsService;
exports.MapsService = MapsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MapsService);
//# sourceMappingURL=maps.service.js.map