export declare class ProductSchema {
    id: string;
    name: string;
    slug: string;
    description?: string;
    priceCents: number;
    imageUrl?: string;
    categoryId?: string;
    featured: boolean;
    inStock: boolean;
    specifications?: Record<string, any>;
    images?: string[];
    createdAt: string;
    updatedAt: string;
}
export declare class CategorySchema {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    productCount: number;
    createdAt: string;
}
export declare class UserSchema {
    id: string;
    email: string;
    name?: string;
    role: string;
    isVerified: boolean;
    phone?: string;
    createdAt: string;
    lastLoginAt: string;
}
export declare class OrderSchema {
    id: string;
    orderNumber: string;
    userId: string;
    status: string;
    totalCents: number;
    shippingAddress: Record<string, any>;
    items: any[];
    createdAt: string;
    updatedAt: string;
}
export declare class CartSchema {
    id: string;
    userId?: string;
    items: any[];
    totalCents: number;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
}
