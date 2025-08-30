import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../caching/cache.service';

export interface ProductRecommendation {
  productId: string;
  score: number;
  reason: string;
  product: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    images: string[];
    rating: number;
    reviewCount: number;
    inStock: boolean;
  };
}

export interface RecommendationContext {
  userId?: string;
  productId?: string;
  categoryId?: string;
  searchQuery?: string;
  priceRange?: { min: number; max: number };
  excludeProductIds?: string[];
}

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async getPersonalizedRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<ProductRecommendation[]> {
    const cacheKey = `recommendations:user:${userId}:${limit}`;
    const cached = await this.cacheService.get<ProductRecommendation[]>(cacheKey);
    if (cached) return cached;

    // Get user's purchase history and preferences
    const userProfile = await this.getUserProfile(userId);
    
    // Combine different recommendation strategies
    const recommendations = await Promise.all([
      this.getCollaborativeFilteringRecommendations(userId, limit / 3),
      this.getContentBasedRecommendations(userProfile, limit / 3),
      this.getTrendingRecommendations(limit / 3),
    ]);

    // Merge and score recommendations
    const mergedRecommendations = this.mergeRecommendations(recommendations.flat());
    
    // Sort by score and limit
    const finalRecommendations = mergedRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Cache for 1 hour
    await this.cacheService.set(cacheKey, finalRecommendations, { ttl: 3600 });

    return finalRecommendations;
  }

  async getSimilarProducts(
    productId: string,
    limit: number = 8
  ): Promise<ProductRecommendation[]> {
    const cacheKey = `recommendations:similar:${productId}:${limit}`;
    const cached = await this.cacheService.get<ProductRecommendation[]>(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!product) return [];

    // Find products with similar attributes
    const similarProducts = await this.prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } },
          { published: true },
          { inStock: true },
          {
            OR: [
              { categoryId: product.categoryId },
              { 
                tags: {
                  some: {
                    name: { in: product.tags.map(tag => tag.name) }
                  }
                }
              },
              {
                priceCents: {
                  gte: product.priceCents * 0.7,
                  lte: product.priceCents * 1.3,
                }
              },
            ],
          },
        ],
      },
      include: {
        category: true,
        tags: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: limit * 2, // Get more to filter and score
    });

    // Calculate similarity scores
    const recommendations = similarProducts.map(similarProduct => {
      const score = this.calculateSimilarityScore(product, similarProduct);
      return {
        productId: similarProduct.id,
        score,
        reason: this.getSimilarityReason(product, similarProduct),
        product: this.mapProductForRecommendation(similarProduct),
      };
    });

    // Sort by score and limit
    const finalRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Cache for 2 hours
    await this.cacheService.set(cacheKey, finalRecommendations, { ttl: 7200 });

    return finalRecommendations;
  }

  async getFrequentlyBoughtTogether(
    productId: string,
    limit: number = 4
  ): Promise<ProductRecommendation[]> {
    const cacheKey = `recommendations:bought_together:${productId}:${limit}`;
    const cached = await this.cacheService.get<ProductRecommendation[]>(cacheKey);
    if (cached) return cached;

    // Find products frequently bought together
    const frequentlyBought = await this.prisma.$queryRaw<Array<{
      productId: string;
      count: number;
    }>>`
      SELECT oi2.product_id as "productId", COUNT(*) as count
      FROM order_items oi1
      JOIN order_items oi2 ON oi1.order_id = oi2.order_id
      WHERE oi1.product_id = ${productId}
        AND oi2.product_id != ${productId}
      GROUP BY oi2.product_id
      ORDER BY count DESC
      LIMIT ${limit * 2}
    `;

    if (frequentlyBought.length === 0) {
      return [];
    }

    // Get product details
    const productIds = frequentlyBought.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        published: true,
        inStock: true,
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const productMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<string, any>);

    // Create recommendations
    const recommendations = frequentlyBought
      .filter(item => productMap[item.productId])
      .map(item => ({
        productId: item.productId,
        score: Math.min(item.count * 10, 100), // Normalize score
        reason: `Frequently bought together (${item.count} times)`,
        product: this.mapProductForRecommendation(productMap[item.productId]),
      }))
      .slice(0, limit);

    // Cache for 4 hours
    await this.cacheService.set(cacheKey, recommendations, { ttl: 14400 });

    return recommendations;
  }

  async getRecentlyViewedRecommendations(
    userId: string,
    limit: number = 6
  ): Promise<ProductRecommendation[]> {
    // Get recently viewed products
    const recentlyViewed = await this.prisma.productView.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: 10,
      include: {
        product: {
          include: {
            category: true,
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    if (recentlyViewed.length === 0) {
      return [];
    }

    // Get similar products for recently viewed items
    const allRecommendations: ProductRecommendation[] = [];
    
    for (const view of recentlyViewed.slice(0, 3)) { // Use top 3 recently viewed
      const similar = await this.getSimilarProducts(view.productId, 3);
      allRecommendations.push(...similar);
    }

    // Remove duplicates and sort by score
    const uniqueRecommendations = this.removeDuplicateRecommendations(allRecommendations);
    
    return uniqueRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getCategoryRecommendations(
    categoryId: string,
    context: RecommendationContext = {},
    limit: number = 12
  ): Promise<ProductRecommendation[]> {
    const cacheKey = `recommendations:category:${categoryId}:${JSON.stringify(context)}:${limit}`;
    const cached = await this.cacheService.get<ProductRecommendation[]>(cacheKey);
    if (cached) return cached;

    const where: any = {
      categoryId,
      published: true,
      inStock: true,
    };

    if (context.priceRange) {
      where.priceCents = {
        gte: context.priceRange.min,
        lte: context.priceRange.max,
      };
    }

    if (context.excludeProductIds?.length) {
      where.id = { notIn: context.excludeProductIds };
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { viewCount: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    const recommendations = products.map(product => ({
      productId: product.id,
      score: this.calculateCategoryScore(product),
      reason: 'Popular in category',
      product: this.mapProductForRecommendation(product),
    }));

    // Cache for 30 minutes
    await this.cacheService.set(cacheKey, recommendations, { ttl: 1800 });

    return recommendations;
  }

  async getTrendingRecommendations(limit: number = 8): Promise<ProductRecommendation[]> {
    const cacheKey = `recommendations:trending:${limit}`;
    const cached = await this.cacheService.get<ProductRecommendation[]>(cacheKey);
    if (cached) return cached;

    // Get trending products based on recent views and orders
    const trendingProducts = await this.prisma.product.findMany({
      where: {
        published: true,
        inStock: true,
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [
        { viewCount: 'desc' },
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    const recommendations = trendingProducts.map(product => ({
      productId: product.id,
      score: this.calculateTrendingScore(product),
      reason: 'Trending now',
      product: this.mapProductForRecommendation(product),
    }));

    // Cache for 15 minutes
    await this.cacheService.set(cacheKey, recommendations, { ttl: 900 });

    return recommendations;
  }

  // Track user interactions for better recommendations
  async trackProductView(userId: string, productId: string): Promise<void> {
    await this.prisma.productView.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        viewedAt: new Date(),
        viewCount: { increment: 1 },
      },
      create: {
        userId,
        productId,
        viewedAt: new Date(),
        viewCount: 1,
      },
    });

    // Update product view count
    await this.prisma.product.update({
      where: { id: productId },
      data: { viewCount: { increment: 1 } },
    });
  }

  private async getUserProfile(userId: string): Promise<any> {
    // Get user's purchase history, categories, price ranges, etc.
    const [orders, views, wishlist] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          userId,
          status: { in: ['COMPLETED', 'DELIVERED'] },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        take: 20,
      }),
      this.prisma.productView.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        take: 50,
      }),
      this.prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      }),
    ]);

    return {
      orders,
      views,
      wishlist,
      preferredCategories: this.extractPreferredCategories(orders, views, wishlist),
      priceRange: this.extractPriceRange(orders),
    };
  }

  private async getCollaborativeFilteringRecommendations(
    userId: string,
    limit: number
  ): Promise<ProductRecommendation[]> {
    // Find users with similar purchase patterns
    // This is a simplified version - in production, you'd use more sophisticated algorithms
    const userOrders = await this.prisma.order.findMany({
      where: {
        userId,
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      include: {
        items: {
          select: {
            productId: true,
          },
        },
      },
    });

    const userProductIds = userOrders.flatMap(order => 
      order.items.map(item => item.productId)
    );

    if (userProductIds.length === 0) {
      return [];
    }

    // Find similar users (users who bought similar products)
    const similarUsers = await this.prisma.order.findMany({
      where: {
        userId: { not: userId },
        status: { in: ['COMPLETED', 'DELIVERED'] },
        items: {
          some: {
            productId: { in: userProductIds },
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                reviews: {
                  select: {
                    rating: true,
                  },
                },
              },
            },
          },
        },
      },
      take: 10,
    });

    // Get products bought by similar users that current user hasn't bought
    const recommendedProducts = similarUsers
      .flatMap(order => order.items)
      .filter(item => !userProductIds.includes(item.productId))
      .map(item => ({
        productId: item.productId,
        score: 70, // Base collaborative filtering score
        reason: 'Users with similar taste also bought this',
        product: this.mapProductForRecommendation(item.product),
      }));

    return this.removeDuplicateRecommendations(recommendedProducts).slice(0, limit);
  }

  private async getContentBasedRecommendations(
    userProfile: any,
    limit: number
  ): Promise<ProductRecommendation[]> {
    // Recommend products based on user's preferred categories and attributes
    const categoryIds = userProfile.preferredCategories.map((cat: any) => cat.id);
    
    if (categoryIds.length === 0) {
      return [];
    }

    const products = await this.prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        published: true,
        inStock: true,
        priceCents: userProfile.priceRange ? {
          gte: userProfile.priceRange.min * 0.8,
          lte: userProfile.priceRange.max * 1.2,
        } : undefined,
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: limit,
    });

    return products.map(product => ({
      productId: product.id,
      score: 60, // Base content-based score
      reason: 'Based on your preferences',
      product: this.mapProductForRecommendation(product),
    }));
  }

  private calculateSimilarityScore(product1: any, product2: any): number {
    let score = 0;

    // Same category
    if (product1.categoryId === product2.categoryId) {
      score += 40;
    }

    // Similar price range
    const priceDiff = Math.abs(product1.priceCents - product2.priceCents) / product1.priceCents;
    if (priceDiff < 0.3) {
      score += 30;
    } else if (priceDiff < 0.5) {
      score += 20;
    }

    // Common tags
    const commonTags = product1.tags.filter((tag1: any) =>
      product2.tags.some((tag2: any) => tag1.name === tag2.name)
    );
    score += Math.min(commonTags.length * 10, 30);

    return Math.min(score, 100);
  }

  private getSimilarityReason(product1: any, product2: any): string {
    if (product1.categoryId === product2.categoryId) {
      return `Similar to ${product1.name}`;
    }
    return 'You might also like';
  }

  private calculateCategoryScore(product: any): number {
    let score = 50; // Base score

    if (product.featured) score += 20;
    if (product.viewCount > 100) score += 15;
    if (product.reviews.length > 0) {
      const avgRating = product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length;
      score += avgRating * 3;
    }

    return Math.min(score, 100);
  }

  private calculateTrendingScore(product: any): number {
    let score = 60; // Base trending score

    score += Math.min(product.viewCount / 10, 20);
    if (product.featured) score += 15;
    if (product.reviews.length > 0) {
      const avgRating = product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length;
      score += avgRating * 2;
    }

    return Math.min(score, 100);
  }

  private mapProductForRecommendation(product: any): ProductRecommendation['product'] {
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
      : 0;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.priceCents,
      images: product.images || [],
      rating: avgRating,
      reviewCount: product.reviews.length,
      inStock: product.inStock,
    };
  }

  private mergeRecommendations(recommendations: ProductRecommendation[]): ProductRecommendation[] {
    const merged = new Map<string, ProductRecommendation>();

    recommendations.forEach(rec => {
      const existing = merged.get(rec.productId);
      if (existing) {
        // Combine scores (weighted average)
        existing.score = (existing.score + rec.score) / 2;
      } else {
        merged.set(rec.productId, rec);
      }
    });

    return Array.from(merged.values());
  }

  private removeDuplicateRecommendations(recommendations: ProductRecommendation[]): ProductRecommendation[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      if (seen.has(rec.productId)) {
        return false;
      }
      seen.add(rec.productId);
      return true;
    });
  }

  private extractPreferredCategories(orders: any[], views: any[], wishlist: any[]): any[] {
    const categoryCount = new Map<string, { category: any; count: number }>();

    // Count from orders (weighted more)
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        if (item.product.category) {
          const existing = categoryCount.get(item.product.category.id);
          if (existing) {
            existing.count += 3; // Orders weighted 3x
          } else {
            categoryCount.set(item.product.category.id, {
              category: item.product.category,
              count: 3,
            });
          }
        }
      });
    });

    // Count from views
    views.forEach(view => {
      if (view.product.category) {
        const existing = categoryCount.get(view.product.category.id);
        if (existing) {
          existing.count += 1;
        } else {
          categoryCount.set(view.product.category.id, {
            category: view.product.category,
            count: 1,
          });
        }
      }
    });

    // Count from wishlist (weighted 2x)
    wishlist.forEach(item => {
      if (item.product.category) {
        const existing = categoryCount.get(item.product.category.id);
        if (existing) {
          existing.count += 2;
        } else {
          categoryCount.set(item.product.category.id, {
            category: item.product.category,
            count: 2,
          });
        }
      }
    });

    return Array.from(categoryCount.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => item.category);
  }

  private extractPriceRange(orders: any[]): { min: number; max: number } | null {
    if (orders.length === 0) return null;

    const prices = orders.flatMap(order =>
      order.items.map((item: any) => item.product.priceCents)
    );

    if (prices.length === 0) return null;

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
}
