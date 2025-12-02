import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityService } from '../../modules/security/security.service';
export declare class InputValidationMiddleware implements NestMiddleware {
    private readonly securityService;
    constructor(securityService: SecurityService);
    use(req: Request, res: Response, next: NextFunction): void;
    private sanitizeObject;
    private isDangerousKey;
    private getMaxContentLength;
    private validateContentType;
}
import { ValidationOptions } from 'class-validator';
export declare function IsSecureString(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsSecureEmail(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsSecurePhoneNumber(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsStrongPassword(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
