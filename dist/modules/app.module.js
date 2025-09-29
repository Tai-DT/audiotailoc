"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const health_module_1 = require("./health/health.module");
const app_controller_1 = require("./app.controller");
const simple_analytics_controller_1 = require("./simple-analytics.controller");
const logger_module_1 = require("./logger/logger.module");
const prisma_module_1 = require("../prisma/prisma.module");
const cache_module_1 = require("./caching/cache.module");
const testing_module_1 = require("./testing/testing.module");
const auth_module_1 = require("./auth/auth.module");
const shared_module_1 = require("./shared/shared.module");
const users_module_1 = require("./users/users.module");
const admin_module_1 = require("./admin/admin.module");
const catalog_module_1 = require("./catalog/catalog.module");
const payments_module_1 = require("./payments/payments.module");
const cart_module_1 = require("./cart/cart.module");
const promotions_module_1 = require("./promotions/promotions.module");
const checkout_module_1 = require("./checkout/checkout.module");
const orders_module_1 = require("./orders/orders.module");
const inventory_module_1 = require("./inventory/inventory.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const newsletter_module_1 = require("./newsletter/newsletter.module");
const complete_product_module_1 = require("./catalog/complete-product.module");
const support_module_1 = require("./support/support.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const marketing_module_1 = require("./marketing/marketing.module");
const analytics_module_1 = require("./analytics/analytics.module");
const files_module_1 = require("./files/files.module");
const maps_module_1 = require("./maps/maps.module");
const services_module_1 = require("./services/services.module");
const service_types_module_1 = require("./service-types/service-types.module");
const booking_module_1 = require("./booking/booking.module");
const technicians_module_1 = require("./technicians/technicians.module");
const site_module_1 = require("./site/site.module");
const projects_module_1 = require("./projects/projects.module");
const seo_module_1 = require("./seo/seo.module");
const reviews_module_1 = require("./reviews/reviews.module");
const blog_module_1 = require("./blog/blog.module");
const policies_module_1 = require("./policies/policies.module");
const FEATURE_CHECKOUT = String(process.env.FEATURE_CHECKOUT || '').toLowerCase() === 'true';
const runtimeImports = [
    config_1.ConfigModule.forRoot({ isGlobal: true }),
    logger_module_1.LoggerModule,
    cache_module_1.CacheModule.forRoot({
        isGlobal: true,
    }),
    prisma_module_1.PrismaModule,
    health_module_1.HealthModule,
    testing_module_1.TestingModule,
    auth_module_1.AuthModule,
    shared_module_1.SharedModule,
    users_module_1.UsersModule,
    admin_module_1.AdminModule,
    support_module_1.SupportModule,
    webhooks_module_1.WebhooksModule,
    files_module_1.FilesModule,
    marketing_module_1.MarketingModule,
    maps_module_1.MapsModule,
    analytics_module_1.AnalyticsModule,
    catalog_module_1.CatalogModule,
    cart_module_1.CartModule,
    payments_module_1.PaymentsModule,
    orders_module_1.OrdersModule,
    inventory_module_1.InventoryModule,
    wishlist_module_1.WishlistModule,
    promotions_module_1.PromotionsModule,
    complete_product_module_1.CompleteProductModule,
    services_module_1.ServicesModule,
    service_types_module_1.ServiceTypesModule,
    booking_module_1.BookingModule,
    technicians_module_1.TechniciansModule,
    site_module_1.SiteModule,
    seo_module_1.SeoModule,
    projects_module_1.ProjectsModule,
    reviews_module_1.ReviewsModule,
    newsletter_module_1.NewsletterModule,
    blog_module_1.BlogModule,
    policies_module_1.PoliciesModule,
];
if (FEATURE_CHECKOUT) {
    runtimeImports.push(cart_module_1.CartModule, promotions_module_1.PromotionsModule, checkout_module_1.CheckoutModule);
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: runtimeImports,
        controllers: [app_controller_1.AppController, simple_analytics_controller_1.SimpleAnalyticsController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map