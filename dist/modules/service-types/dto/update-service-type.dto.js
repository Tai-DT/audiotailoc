"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_service_type_dto_1 = require("./create-service-type.dto");
class UpdateServiceTypeDto extends (0, swagger_1.PartialType)(create_service_type_dto_1.CreateServiceTypeDto) {
}
exports.UpdateServiceTypeDto = UpdateServiceTypeDto;
//# sourceMappingURL=update-service-type.dto.js.map