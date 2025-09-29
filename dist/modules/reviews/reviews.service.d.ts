import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
interface ReviewQuery {
    status?: string;
    rating?: number;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getReviews(query: ReviewQuery): Promise<{
        reviews: {
            id: string;
            userId: string;
            userName: string;
            productId: string;
            productName: string;
            serviceId: any;
            serviceName: any;
            rating: number;
            comment: string;
            images: string[];
            status: string;
            response: string;
            helpfulCount: number;
            reportCount: number;
            isVerified: boolean;
            createdAt: string;
            updatedAt: string;
        }[];
        stats: {
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
        };
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    approveReview(id: string): Promise<{
        status: import(".prisma/client").$Enums.ReviewStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        productId: string;
        rating: number;
        comment: string;
        isVerified: boolean;
        upvotes: number;
        downvotes: number;
        images: string;
        response: string;
    }>;
    rejectReview(id: string, reason?: string): Promise<{
        status: import(".prisma/client").$Enums.ReviewStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        productId: string;
        rating: number;
        comment: string;
        isVerified: boolean;
        upvotes: number;
        downvotes: number;
        images: string;
        response: string;
    }>;
    respondToReview(id: string, response: string): Promise<{
        status: import(".prisma/client").$Enums.ReviewStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        productId: string;
        rating: number;
        comment: string;
        isVerified: boolean;
        upvotes: number;
        downvotes: number;
        images: string;
        response: string;
    }>;
    deleteReview(id: string): Promise<{
        message: string;
    }>;
    markHelpful(id: string): Promise<{
        status: import(".prisma/client").$Enums.ReviewStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        productId: string;
        rating: number;
        comment: string;
        isVerified: boolean;
        upvotes: number;
        downvotes: number;
        images: string;
        response: string;
    }>;
    reportReview(id: string, reason?: string): Promise<{
        status: import(".prisma/client").$Enums.ReviewStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        productId: string;
        rating: number;
        comment: string;
        isVerified: boolean;
        upvotes: number;
        downvotes: number;
        images: string;
        response: string;
    }>;
    createReview(userId: string, dto: CreateReviewDto): Promise<{
        id: string;
        userId: string;
        userName: string;
        productId: string;
        productName: string;
        rating: number;
        title: string;
        comment: string;
        images: string[];
        status: string;
        isVerified: boolean;
        createdAt: string;
        updatedAt: string;
    }>;
    private resolveModeratorUserId;
    private getReviewOrFail;
    private parseImages;
    private buildStats;
}
export {};
