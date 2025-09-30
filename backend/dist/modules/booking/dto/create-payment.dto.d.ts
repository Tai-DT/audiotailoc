import { PaymentProvider } from '../../../common/enums';
export declare class CreatePaymentDto {
    bookingId: string;
    amountCents: number;
    paymentMethod: PaymentProvider;
    transactionId?: string;
}
