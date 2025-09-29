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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const maps_service_1 = require("./maps.service");
class GeocodeQueryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GeocodeQueryDto.prototype, "query", void 0);
class DirectionsQueryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DirectionsQueryDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DirectionsQueryDto.prototype, "to", void 0);
class ReverseQueryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReverseQueryDto.prototype, "latlng", void 0);
class PlaceDetailQueryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlaceDetailQueryDto.prototype, "placeId", void 0);
let MapsController = class MapsController {
    constructor(maps) {
        this.maps = maps;
    }
    geocode(q) {
        return this.maps.geocode(q.query);
    }
    directions(q) {
        return this.maps.directions(q.from, q.to);
    }
    reverse(q) {
        return this.maps.reverseGeocode(q.latlng);
    }
    placeDetail(q) {
        return this.maps.placeDetail(q.placeId);
    }
};
exports.MapsController = MapsController;
__decorate([
    (0, common_1.Get)('geocode'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GeocodeQueryDto]),
    __metadata("design:returntype", void 0)
], MapsController.prototype, "geocode", null);
__decorate([
    (0, common_1.Get)('directions'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DirectionsQueryDto]),
    __metadata("design:returntype", void 0)
], MapsController.prototype, "directions", null);
__decorate([
    (0, common_1.Get)('reverse'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReverseQueryDto]),
    __metadata("design:returntype", void 0)
], MapsController.prototype, "reverse", null);
__decorate([
    (0, common_1.Get)('place-detail'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaceDetailQueryDto]),
    __metadata("design:returntype", void 0)
], MapsController.prototype, "placeDetail", null);
exports.MapsController = MapsController = __decorate([
    (0, common_1.Controller)('maps'),
    __metadata("design:paramtypes", [maps_service_1.MapsService])
], MapsController);
//# sourceMappingURL=maps.controller.js.map