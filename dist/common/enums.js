"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceType = exports.ServiceCategory = exports.PaymentProvider = exports.PaymentStatus = exports.ServiceBookingStatus = void 0;
var ServiceBookingStatus;
(function (ServiceBookingStatus) {
    ServiceBookingStatus["PENDING"] = "PENDING";
    ServiceBookingStatus["CONFIRMED"] = "CONFIRMED";
    ServiceBookingStatus["ASSIGNED"] = "ASSIGNED";
    ServiceBookingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ServiceBookingStatus["COMPLETED"] = "COMPLETED";
    ServiceBookingStatus["CANCELLED"] = "CANCELLED";
    ServiceBookingStatus["RESCHEDULED"] = "RESCHEDULED";
})(ServiceBookingStatus || (exports.ServiceBookingStatus = ServiceBookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["SUCCEEDED"] = "SUCCEEDED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["PAYOS"] = "PAYOS";
    PaymentProvider["VNPAY"] = "VNPAY";
    PaymentProvider["MOMO"] = "MOMO";
    PaymentProvider["CASH"] = "CASH";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
var ServiceCategory;
(function (ServiceCategory) {
    ServiceCategory["INSTALLATION"] = "INSTALLATION";
    ServiceCategory["MAINTENANCE"] = "MAINTENANCE";
    ServiceCategory["REPAIR"] = "REPAIR";
    ServiceCategory["LIQUIDATION"] = "LIQUIDATION";
    ServiceCategory["RENTAL"] = "RENTAL";
    ServiceCategory["CONSULTATION"] = "CONSULTATION";
    ServiceCategory["DELIVERY"] = "DELIVERY";
    ServiceCategory["OTHER"] = "OTHER";
})(ServiceCategory || (exports.ServiceCategory = ServiceCategory = {}));
var ServiceType;
(function (ServiceType) {
    ServiceType["AUDIO_EQUIPMENT"] = "AUDIO_EQUIPMENT";
    ServiceType["HOME_THEATER"] = "HOME_THEATER";
    ServiceType["PROFESSIONAL_SOUND"] = "PROFESSIONAL_SOUND";
    ServiceType["LIGHTING"] = "LIGHTING";
    ServiceType["CONSULTATION"] = "CONSULTATION";
    ServiceType["MAINTENANCE"] = "MAINTENANCE";
    ServiceType["OTHER"] = "OTHER";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
//# sourceMappingURL=enums.js.map