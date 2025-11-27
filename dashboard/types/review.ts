export interface Review {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    productId?: string;
    productName?: string;
    serviceId?: string;
    serviceName?: string;
    rating: number;
    comment: string;
    images?: string[];
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    response?: string;
    helpfulCount: number;
    reportCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
    responseRate: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export interface ReviewsResponse {
    data: Review[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}

export interface ReviewFilters {
    page?: number;
    pageSize?: number;
    productId?: string;
    rating?: number;
    status?: string;
}