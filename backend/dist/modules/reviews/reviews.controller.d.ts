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
    getReviews(status?: string, rating?: string, search?: string, page?: number, limit?: number): unknown;
    createReview(dto: CreateReviewDto, req: AuthenticatedRequest): unknown;
    approveReview(id: string): unknown;
    rejectReview(id: string, reason?: string): unknown;
    respondToReview(id: string, response: string): unknown;
    deleteReview(id: string): unknown;
    markHelpful(id: string): unknown;
    reportReview(id: string, reason?: string): unknown;
}
export {};
