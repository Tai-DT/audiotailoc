import { PaymentProvider } from '../../../common/enums';
export declare class CreatePaymentDto {
    amountCents: number;
    paymentMethod: PaymentProvider;
    transactionId?: string;
}
