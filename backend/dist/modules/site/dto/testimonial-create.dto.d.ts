export declare class CreateTestimonialDto {
    name: string;
    position?: string;
    company?: string;
    content: string;
    avatarUrl?: string;
    rating?: number;
    isActive: boolean;
    displayOrder: number;
}
export declare class UpdateTestimonialDto {
    name?: string;
    position?: string;
    company?: string;
    content?: string;
    avatarUrl?: string;
    rating?: number;
    isActive?: boolean;
    displayOrder?: number;
}
