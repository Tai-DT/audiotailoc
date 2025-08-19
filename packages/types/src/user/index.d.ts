export interface User {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: Gender;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}
import { Address as CommonAddress } from '../common';
export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: Gender;
    addresses: UserAddress[];
    preferences: UserPreferences;
    createdAt: string;
    updatedAt: string;
}
export interface UserAddress extends CommonAddress {
    id: string;
    userId: string;
    type: AddressType;
    isDefault: boolean;
}
export interface UserPreferences {
    language: string;
    currency: string;
    timezone: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
}
export declare enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
    EDITOR = "EDITOR",
    MODERATOR = "MODERATOR"
}
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
    PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY"
}
export declare enum AddressType {
    SHIPPING = "SHIPPING",
    BILLING = "BILLING",
    BOTH = "BOTH"
}
export interface CreateUserRequest {
    email: string;
    password: string;
    name?: string;
    role?: UserRole;
}
export interface UpdateUserRequest {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: Gender;
    avatar?: string;
}
export interface UpdateUserProfileRequest {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: Gender;
    avatar?: string;
    preferences?: Partial<UserPreferences>;
}
export interface CreateAddressRequest extends CommonAddress {
    type: AddressType;
    isDefault?: boolean;
}
export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface ForgotPasswordRequest {
    email: string;
}
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
export interface UserFilters {
    role?: UserRole;
    isActive?: boolean;
    isEmailVerified?: boolean;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}
//# sourceMappingURL=index.d.ts.map