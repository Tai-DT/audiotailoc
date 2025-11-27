export class CreateReviewDto {
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string;
}

export class UpdateReviewDto {
  title?: string;
  comment?: string;
  rating?: number;
  response?: string;
}
