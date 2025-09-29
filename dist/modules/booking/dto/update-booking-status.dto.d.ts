import { ServiceBookingStatus } from '../../../common/enums';
export declare class UpdateBookingStatusDto {
    status: ServiceBookingStatus;
    note?: string;
    changedBy?: string;
}
