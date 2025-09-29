import { Type } from '@nestjs/common';
export declare function ApiListEndpoint(options: {
    summary: string;
    description?: string;
    itemName: string;
    authRequired?: boolean;
}): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiGetByIdEndpoint(options: {
    summary: string;
    description?: string;
    itemName: string;
    paramName?: string;
    authRequired?: boolean;
}): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiCreateEndpoint(options: {
    summary: string;
    description?: string;
    itemName: string;
    dtoType: Type<any>;
    adminOnly?: boolean;
}): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiUpdateEndpoint(options: {
    summary: string;
    description?: string;
    itemName: string;
    dtoType: Type<any>;
    paramName?: string;
    adminOnly?: boolean;
}): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiDeleteEndpoint(options: {
    summary: string;
    description?: string;
    itemName: string;
    paramName?: string;
    adminOnly?: boolean;
}): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiFileUploadEndpoint(options: {
    summary: string;
    description?: string;
    fileTypes?: string[];
    maxSize?: string;
    authRequired?: boolean;
}): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
