export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: string;
    createdAt: string;
    updatedAt?: string;
    _count?: {
        orders: number;
    };
}

export interface UserResponse {
    id: string;
    name?: string;
    email: string;
    phone?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
    orders?: { totalCents?: number }[];
    loyaltyAccount?: { points?: number };
}

export interface UsersResponse {
    items: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}