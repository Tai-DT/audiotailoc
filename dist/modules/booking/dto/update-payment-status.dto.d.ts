import { PaymentStatus } from '../../../common/enums';
export declare class UpdatePaymentStatusDto {
    status: PaymentStatus;
    transactionId?: string;
}
