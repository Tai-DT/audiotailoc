"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressType = exports.Gender = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["EDITOR"] = "EDITOR";
    UserRole["MODERATOR"] = "MODERATOR";
})(UserRole || (exports.UserRole = UserRole = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
    Gender["PREFER_NOT_TO_SAY"] = "PREFER_NOT_TO_SAY";
})(Gender || (exports.Gender = Gender = {}));
var AddressType;
(function (AddressType) {
    AddressType["SHIPPING"] = "SHIPPING";
    AddressType["BILLING"] = "BILLING";
    AddressType["BOTH"] = "BOTH";
})(AddressType || (exports.AddressType = AddressType = {}));
//# sourceMappingURL=index.js.map