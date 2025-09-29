import { HttpStatus } from '@nestjs/common';
export interface CustomErrorOptions {
    code?: string;
    message?: string;
    details?: any;
    statusCode?: HttpStatus;
}
export declare function CustomError(options: CustomErrorOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function HandleDatabaseErrors(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function HandlePaymentErrors(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function HandleAIIntegrationErrors(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
