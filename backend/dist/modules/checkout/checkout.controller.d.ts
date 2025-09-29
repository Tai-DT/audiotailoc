import { CheckoutService } from './checkout.service';
declare class CheckoutDto {
    promotionCode?: string;
}
export declare class CheckoutController {
    private readonly checkout;
    constructor(checkout: CheckoutService);
    create(req: any, dto: CheckoutDto): unknown;
    getByOrderNo(req: any, orderNo: string): unknown;
}
export {};
