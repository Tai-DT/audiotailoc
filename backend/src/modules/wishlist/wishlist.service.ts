import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async addToWishlist(userId: string, createWishlistDto: CreateWishlistDto) {
    const { productId } = createWishlistDto;

    // Check if product exists
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if item already exists in wishlist
    const existingItem = await this.prisma.wishlist_items.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      throw new ConflictException('Product already in wishlist');
    }

    // Add to wishlist
    const wishlistItem = await this.prisma.wishlist_items.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        users: { connect: { id: userId } },
        products: { connect: { id: productId } },
      },
      include: {
        products: true,
      },
    });

    return wishlistItem;
  }

  async getWishlist(userId: string) {
    const wishlistItems = await this.prisma.wishlist_items.findMany({
      where: { userId },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            priceCents: true,
            originalPriceCents: true,
            imageUrl: true,
            images: true,
            isActive: true,
            stockQuantity: true,
            categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      items: wishlistItems,
      total: wishlistItems.length,
    };
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlistItem = await this.prisma.wishlist_items.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    await this.prisma.wishlist_items.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { message: 'Product removed from wishlist successfully' };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.wishlist_items.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!item;
  }

  async getWishlistCount(userId: string): Promise<number> {
    const count = await this.prisma.wishlist_items.count({
      where: { userId },
    });

    return count;
  }

  async clearWishlist(userId: string) {
    await this.prisma.wishlist_items.deleteMany({
      where: { userId },
    });

    return { message: 'Wishlist cleared successfully' };
  }
}
