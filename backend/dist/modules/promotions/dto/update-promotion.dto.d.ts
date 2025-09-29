declare const UpdatePromotionDto_base: import("@nestjs/mapped-types").MappedType<Exclude<T, { [K in keyof T]: T[K] extends Type ? K : never; }[keyof T]>>;
export declare class UpdatePromotionDto extends UpdatePromotionDto_base {
    usageCount?: number;
}
export {};
