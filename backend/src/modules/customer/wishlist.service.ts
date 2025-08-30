import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../caching/cache.service';
import { WishlistItem as WishlistItemModel } from '@prisma/client';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
  product?: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    images: string[];
    inStock: boolean;
    stockQuantity: number;
  };
}

export interface WishlistStats {
  totalItems: number;
  totalValue: number;
  inStockItems: number;
  outOfStockItems: number;
  recentlyAdded: WishlistItem[];
}

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async addToWishlist(userId: string, productId: string): Promise<WishlistItem> {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if already in wishlist
    const existingItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      return this.mapWishlistItem(existingItem as any);
    }

    // Add to wishlist
    const wishlistItem = await this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            priceCents: true,
            images: true,
            inventory: {
              select: {
                stock: true,
              },
            },
          },
        },
      },
    });

    // Clear cache
    await this.clearWishlistCache(userId);

    return this.mapWishlistItem(wishlistItem as any);
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const deleted = await this.prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Item not found in wishlist');
    }

    // Clear cache
    await this.clearWishlistCache(userId);
  }

  async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    const cacheKey = `wishlist:${userId}`;
    const cached = await this.cacheService.get<WishlistItem[]>(cacheKey);
    if (cached) return cached;

    const wishlistItems = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            priceCents: true,
            images: true,
            inventory: {
              select: {
                stock: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = wishlistItems.map(item => this.mapWishlistItem(item as any));
    
    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, result, { ttl: 300 });
    
    return result;
  }

  async getWishlistStats(userId: string): Promise<WishlistStats> {
    const wishlistItems = await this.getUserWishlist(userId);
    
    const totalItems = wishlistItems.length;
    const totalValue = wishlistItems.reduce((sum, item) => 
      sum + (item.product?.priceCents || 0), 0
    );
    const inStockItems = wishlistItems.filter(item => 
      item.product?.inStock
    ).length;
    const outOfStockItems = totalItems - inStockItems;
    const recentlyAdded = wishlistItems.slice(0, 5);

    return {
      totalItems,
      totalValue,
      inStockItems,
      outOfStockItems,
      recentlyAdded,
    };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!item;
  }

  async moveToCart(userId: string, productId: string, quantity: number = 1): Promise<void> {
    // Check if in wishlist
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Item not found in wishlist');
    }

    const cart = await this.prisma.cart.findFirst({
        where: { userId },
    });

    if (!cart) {
        throw new NotFoundException('Cart not found');
    }

    // Add to cart
    await this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    // Remove from wishlist
    await this.removeFromWishlist(userId, productId);
  }

  async clearWishlist(userId: string): Promise<void> {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId },
    });

    await this.clearWishlistCache(userId);
  }

  async getWishlistByProducts(productIds: string[]): Promise<Record<string, number>> {
    const counts = await this.prisma.wishlistItem.groupBy({
      by: ['productId'],
      where: {
        productId: { in: productIds },
      },
      _count: {
        productId: true,
      },
    });

    return counts.reduce((acc: Record<string, number>, count: { productId: string; _count: { productId: number } }) => {
      acc[count.productId] = count._count.productId;
      return acc;
    }, {} as Record<string, number>);
  }

  async getPopularWishlistItems(limit: number = 10): Promise<Array<{
    productId: string;
    count: number;
    product: {
      id: string;
      name: string;
      slug: string;
      priceCents: number;
      images: string[];
    };
  }>> {
    const popularItems = await this.prisma.wishlistItem.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: limit,
    });

    const productIds = popularItems.map((item: { productId: string }) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        priceCents: true,
        images: true,
      },
    });

    const productMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<string, any>);

    return popularItems.map((item: { productId: string; _count: { productId: number } }) => ({
      productId: item.productId,
      count: item._count.productId,
      product: productMap[item.productId],
    })).filter(item => item.product);
  }

  private mapWishlistItem(item: any): WishlistItem {
    return {
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      addedAt: item.createdAt,
      product: item.product ? {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        priceCents: item.product.priceCents,
        images: item.product.images,
        inStock: item.product.inventory.stock > 0,
        stockQuantity: item.product.inventory.stock,
      } : undefined,
    };
  }

  private async clearWishlistCache(userId: string): Promise<void> {
    await this.cacheService.del(`wishlist:${userId}`);
  }
}
