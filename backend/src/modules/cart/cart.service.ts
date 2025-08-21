import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  // Guest Cart Management
  async createGuestCart() {
    const guestCart = await this.prisma.cart.create({
      data: {
        userId: null, // Guest cart
        guestId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                images: true,
                imageUrl: true,
                featured: true
              }
            }
          }
        }
      }
    });

    this.logger.log(`Guest cart created: ${guestCart.guestId}`);
    return guestCart;
  }

  async getGuestCart(guestId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        guestId,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                images: true,
                imageUrl: true,
                featured: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found or expired');
    }

    return this.calculateCartTotals(cart);
  }

  async addToGuestCart(guestId: string, productId: string, quantity: number = 1) {
    // Check if guest cart exists
    let cart = await this.prisma.cart.findFirst({
      where: {
        guestId,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!cart) {
      cart = await this.createGuestCart();
    }

    // Check if product exists and is available
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if ((product.inventory?.stock ?? 0) < quantity) {
      throw new Error('Insufficient stock');
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // Add new item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: product.priceCents
        }
      });
    }

    this.logger.log(`Added ${quantity} of product ${productId} to guest cart ${guestId}`);
    return this.getGuestCart(guestId);
  }

  async updateGuestCartItem(guestId: string, productId: string, quantity: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { guestId, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      // Remove item
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id }
      });
    } else {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity }
      });
    }

    return this.getGuestCart(guestId);
  }

  async removeFromGuestCart(guestId: string, productId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { guestId, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId
      }
    });

    return this.getGuestCart(guestId);
  }

  async clearGuestCart(guestId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { guestId, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return this.getGuestCart(guestId);
  }

  // Convert guest cart to user cart
  async convertGuestCartToUserCart(guestId: string, userId: string) {
    const guestCart = await this.prisma.cart.findFirst({
      where: { guestId, status: 'ACTIVE' }
    });

    if (!guestCart) {
      throw new NotFoundException('Guest cart not found');
    }

    // Check if user already has an active cart
    const existingUserCart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (existingUserCart) {
      // Merge guest cart items into existing user cart
      const guestItems = await this.prisma.cartItem.findMany({
        where: { cartId: guestCart.id }
      });

      for (const item of guestItems) {
        const existingItem = await this.prisma.cartItem.findFirst({
          where: {
            cartId: existingUserCart.id,
            productId: item.productId
          }
        });

        if (existingItem) {
          // Update quantity
          await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity }
          });
        } else {
          // Add new item
          await this.prisma.cartItem.create({
            data: {
              cartId: existingUserCart.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice
            }
          });
        }
      }

      // Delete guest cart
      await this.prisma.cart.delete({
        where: { id: guestCart.id }
      });

      return this.getUserCart(userId);
    } else {
      // Convert guest cart to user cart
      await this.prisma.cart.update({
        where: { id: guestCart.id },
        data: {
          userId,
          guestId: null,
          expiresAt: null
        }
      });

      return this.getUserCart(userId);
    }
  }

  // User Cart Management (existing functionality)
  async getUserCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                images: true,
                inventory: { select: { stock: true } },
              }
            }
          }
        }
      }
    });

    if (!cart) {
      // Create new cart for user
      return this.createUserCart(userId);
    }

    return this.calculateCartTotals(cart);
  }

  async createUserCart(userId: string) {
    const cart = await this.prisma.cart.create({
      data: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                images: true,
                inventory: { select: { stock: true } },
              }
            }
          }
        }
      }
    });

    this.logger.log(`User cart created: ${userId}`);
    return this.calculateCartTotals(cart);
  }

  async addToUserCart(userId: string, productId: string, quantity: number = 1) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (!cart) {
      cart = await this.createUserCart(userId);
    }

    if (!cart) {
      throw new Error('Failed to create or find cart');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if ((product.inventory?.stock ?? 0) < quantity) {
      throw new Error('Insufficient stock');
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: product.priceCents
        }
      });
    }

    return this.getUserCart(userId);
  }

  async updateUserCartItem(userId: string, productId: string, quantity: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('User cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id }
      });
      } else {
      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity }
      });
    }

    return this.getUserCart(userId);
  }

  async removeFromUserCart(userId: string, productId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('User cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId
      }
    });

    return this.getUserCart(userId);
  }

  async clearUserCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('User cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return this.getUserCart(userId);
  }

  // Helper method to calculate cart totals
  private calculateCartTotals(cart: any) {
    const subtotal = cart.items.reduce((sum: number, item: any) => {
      return sum + ((item.unitPrice ?? item.product?.priceCents ?? 0) * item.quantity);
    }, 0);

    const itemCount = cart.items.reduce((sum: number, item: any) => {
      return sum + item.quantity;
    }, 0);

    return {
      ...cart,
      subtotal,
      itemCount,
      // Add tax calculation (10% VAT for Vietnam)
      tax: Math.round(subtotal * 0.1),
      // Add shipping calculation (free shipping for orders > 500k VND)
      shipping: subtotal > 500000 ? 0 : 30000,
      total: subtotal + Math.round(subtotal * 0.1) + (subtotal > 500000 ? 0 : 30000)
    };
  }

  // Clean up expired guest carts
  async cleanupExpiredGuestCarts() {
    const expiredCarts = await this.prisma.cart.findMany({
      where: {
        guestId: { not: null },
        expiresAt: { lt: new Date() },
        status: 'ACTIVE'
      }
    });

    for (const cart of expiredCarts) {
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { status: 'ABANDONED' }
      });
    }

    this.logger.log(`Cleaned up ${expiredCarts.length} expired guest carts`);
  }

  // Utility for checkout to fetch cart and totals
  async getCartWithTotals(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
    });
    if (!cart) {
      return { cart: await this.createUserCart(userId), items: [], subtotalCents: 0 };
    }
    const items = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });
    const subtotalCents = items.reduce((sum, i) => sum + (i.unitPrice || i.product.priceCents) * i.quantity, 0);
    return { cart, items, subtotalCents };
  }
}
