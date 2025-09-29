"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBannerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const banner_create_dto_1 = require("./banner-create.dto");
class UpdateBannerDto extends (0, swagger_1.PartialType)(banner_create_dto_1.CreateBannerDto) {
}
exports.UpdateBannerDto = UpdateBannerDto;
//# sourceMappingURL=banner-update.dto.js.map