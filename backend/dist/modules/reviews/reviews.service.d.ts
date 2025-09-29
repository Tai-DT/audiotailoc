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
    getReviews(query: ReviewQuery): unknown;
    approveReview(id: string): unknown;
    rejectReview(id: string, reason?: string): unknown;
    respondToReview(id: string, response: string): unknown;
    deleteReview(id: string): unknown;
    markHelpful(id: string): unknown;
    reportReview(id: string, reason?: string): unknown;
    createReview(userId: string, dto: CreateReviewDto): unknown;
    private resolveModeratorUserId;
    private getReviewOrFail;
    private parseImages;
    private buildStats;
}
export {};
