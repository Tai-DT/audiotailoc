import { Request } from 'express';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
interface AuthenticatedRequest extends Request {
    user?: {
        sub?: string;
        id?: string;
        email?: string;
        role?: string;
    };
}
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getReviews(status?: string, rating?: string, search?: string, page?: number, limit?: number): Promise<{
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
    createReview(dto: CreateReviewDto, req: AuthenticatedRequest): Promise<{
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
    approveReview(id: string): Promise<{
        message: string;
    }>;
    rejectReview(id: string, reason?: string): Promise<{
        message: string;
    }>;
    respondToReview(id: string, response: string): Promise<{
        message: string;
    }>;
    deleteReview(id: string): Promise<{
        message: string;
    }>;
    markHelpful(id: string): Promise<{
        message: string;
    }>;
    reportReview(id: string, reason?: string): Promise<{
        message: string;
    }>;
}
export {};
