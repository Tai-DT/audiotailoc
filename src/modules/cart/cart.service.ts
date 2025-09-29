import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly inventoryService: InventoryService
  ) {}

  // Guest Cart Management
  async createGuestCart() {
    const guestCart = await this.prisma.carts.create({
      data: {
        userId: null, // Guest cart
        status: 'ACTIVE',
      } as any,
      include: {
        cart_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                images: true,
                imageUrl: true,

              }
            }
          }
        }
      }
    });

    this.logger.log(`Guest cart created: ${guestCart.id}`);
    return guestCart;
  }

  async getGuestCart(cartId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: {
        id: cartId,
        userId: null, // Guest cart
        status: 'ACTIVE'
      },
      include: {
        cart_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                images: true,
                imageUrl: true,

              }
            }
          }
        }
      }
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    return this.calculateCartTotals(cart);
  }

  async addToGuestCart(cartId: string, productId: string, quantity: number = 1) {
    // Check if guest cart exists
    let cart = await this.prisma.carts.findFirst({
      where: {
        id: cartId,
        userId: null,
        status: 'ACTIVE'
      }
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    // Check if product exists and is available
    const product = await this.prisma.products.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check inventory availability
    await this.checkAndReserveStock(productId, quantity);

    // Check if item already exists in cart
    const existingItem = await this.prisma.cart_items.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      // Update quantity
      await this.prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // Add new item
      await this.prisma.cart_items.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: Number(product.priceCents)
        } as any
      });
    }

    this.logger.log(`Added ${quantity} of product ${productId} to guest cart ${cartId}`);
    return this.getGuestCart(cartId);
  }

  async updateGuestCartItem(cartId: string, productId: string, quantity: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { id: cartId, userId: null, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    const cartItem = await this.prisma.cart_items.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const delta = quantity - cartItem.quantity;
    if (delta !== 0) {
      // Handle inventory reservation changes
      if (delta > 0) {
        // Increasing quantity - need more reservation
        await this.checkAndReserveStock(productId, delta);
      } else {
        // Decreasing quantity - release some reservation
        await this.releaseStock(productId, Math.abs(delta));
      }
    }

    if (quantity <= 0) {
      // Remove item - release all reserved stock
      await this.releaseStock(productId, cartItem.quantity);
      // Remove item
      await this.prisma.cart_items.delete({
        where: { id: cartItem.id }
      });
    } else {
      // Update quantity
      await this.prisma.cart_items.update({
        where: { id: cartItem.id },
        data: { quantity }
      });
    }

    return this.getGuestCart(cartId);
  }

  async removeFromGuestCart(cartId: string, productId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { id: cartId, userId: null, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    const item = await this.prisma.cart_items.findFirst({ where: { cartId: cart.id, productId } });
    if (item) {
      // Release reserved inventory
      await this.releaseStock(productId, item.quantity);
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    }

    return this.getGuestCart(cartId);
  }

  async clearGuestCart(cartId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { id: cartId, userId: null, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    const items = await this.prisma.cart_items.findMany({ where: { cartId: cart.id } });
    for (const item of items) {
      // Release reserved inventory for each item
      await this.releaseStock(item.productId, item.quantity);
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    }

    return this.getGuestCart(cartId);
  }

  // Convert guest cart to user cart
  async convertGuestCartToUserCart(cartId: string, userId: string) {
    const guestCart = await this.prisma.carts.findFirst({
      where: { id: cartId, userId: null, status: 'ACTIVE' }
    });

    if (!guestCart) {
      throw new NotFoundException('Guest cart not found');
    }

    // Check if user already has an active cart
    const existingUserCart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (existingUserCart) {
      // Merge guest cart items into existing user cart
      const guestItems = await this.prisma.cart_items.findMany({
        where: { cartId: guestCart.id }
      });

      for (const item of guestItems) {
        const existingItem = await this.prisma.cart_items.findFirst({
          where: {
            cartId: existingUserCart.id,
            productId: item.productId
          }
        });

        if (existingItem) {
          // Update quantity - adjust inventory reservation
          const quantityIncrease = item.quantity;
          await this.checkAndReserveStock(item.productId, quantityIncrease);

          // Update quantity
          await this.prisma.cart_items.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity }
          });
        } else {
          // Add new item - inventory already reserved for guest cart
          await this.prisma.cart_items.create({
            data: {
              cartId: existingUserCart.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            } as any
          });
          // Note: Inventory reservation is already in place from guest cart
        }
      }

      // Delete guest cart
      await this.prisma.carts.delete({
        where: { id: guestCart.id }
      });

      return this.getUserCart(userId);
    } else {
      // Convert guest cart to user cart
      await this.prisma.carts.update({
        where: { id: guestCart.id },
        data: {
          userId
        }
      });

      return this.getUserCart(userId);
    }
  }

  // User Cart Management (existing functionality)
  async getUserCart(userId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        cart_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                images: true,
                // inventory: { select: { stock: true } }, // Removed as not in schema
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
    const cart = await this.prisma.carts.create({
      data: {
        userId,
        status: 'ACTIVE'
      } as any,
      include: {
        cart_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                images: true,
                // inventory: { select: { stock: true } }, // Removed as not in schema
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
    let cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (!cart) {
      cart = await this.createUserCart(userId);
    }

    if (!cart) {
      throw new Error('Failed to create or find cart');
    }

    const product = await this.prisma.products.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check inventory availability and reserve stock
    await this.checkAndReserveStock(productId, quantity);

    const existingItem = await this.prisma.cart_items.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      await this.prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await this.prisma.cart_items.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: Number(product.priceCents)
        } as any
      });
    }

    return this.getUserCart(userId);
  }

  async updateUserCartItem(userId: string, productId: string, quantity: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('User cart not found');
    }

    const cartItem = await this.prisma.cart_items.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const delta = quantity - cartItem.quantity;
    if (delta !== 0) {
      // Handle inventory reservation changes
      if (delta > 0) {
        // Increasing quantity - need more reservation
        await this.checkAndReserveStock(productId, delta);
      } else {
        // Decreasing quantity - release some reservation
        await this.releaseStock(productId, Math.abs(delta));
      }
    }

    if (quantity <= 0) {
      // Remove item - release all reserved stock
      await this.releaseStock(productId, cartItem.quantity);
      await this.prisma.cart_items.delete({
        where: { id: cartItem.id }
      });
      } else {
      // Update quantity
      await this.prisma.cart_items.update({
        where: { id: cartItem.id },
        data: { quantity }
      });
    }

    return this.getUserCart(userId);
  }

  async removeFromUserCart(userId: string, productId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('User cart not found');
    }

    const item = await this.prisma.cart_items.findFirst({ where: { cartId: cart.id, productId } });
    if (item) {
      // Release reserved inventory
      await this.releaseStock(productId, item.quantity);
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    }

    return this.getUserCart(userId);
  }

  async clearUserCart(userId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (!cart) {
      throw new NotFoundException('User cart not found');
    }

    const items = await this.prisma.cart_items.findMany({ where: { cartId: cart.id } });
    for (const item of items) {
      // Release reserved inventory for each item
      await this.releaseStock(item.productId, item.quantity);
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    }

    return this.getUserCart(userId);
  }

  // Helper method to calculate cart totals
  private calculateCartTotals(cart: any) {
    const subtotal = cart.cart_items.reduce((sum: number, item: any) => {
      return sum + (Number(item.price ?? item.products?.priceCents ?? 0) * item.quantity);
    }, 0);

    const itemCount = cart.cart_items.reduce((sum: number, item: any) => {
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

  // Clean up old guest carts (older than 7 days)
  async cleanupExpiredGuestCarts() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const expiredCarts = await this.prisma.carts.findMany({
      where: {
        userId: null, // Guest carts
        createdAt: { lt: sevenDaysAgo },
        status: 'ACTIVE'
      },
      include: {
        cart_items: true
      }
    });

    for (const cart of expiredCarts) {
      // Release inventory reservations for all items in expired cart
      for (const item of cart.cart_items) {
        try {
          await this.releaseStock(item.productId, item.quantity);
        } catch (error) {
          this.logger.error(`Failed to release stock for expired cart item: ${error.message}`);
        }
      }

      await this.prisma.carts.update({
        where: { id: cart.id },
        data: { status: 'ABANDONED' }
      });
    }

    this.logger.log(`Cleaned up ${expiredCarts.length} expired guest carts`);
  }

  // Utility for checkout to fetch cart and totals
  async getCartWithTotals(userId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' },
    });
    if (!cart) {
      return { cart: await this.createUserCart(userId), items: [], subtotalCents: 0 };
    }
    const items = await this.prisma.cart_items.findMany({
      where: { cartId: cart.id },
      include: { products: true },
    });
    const subtotalCents = items.reduce((sum, i) => sum + Number(i.price || i.products.priceCents) * i.quantity, 0);
    return { cart, items, subtotalCents };
  }

  // Inventory management helpers
  private async checkAndReserveStock(productId: string, quantity: number): Promise<void> {
    // Get current inventory
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      select: { stock: true, reserved: true }
    });

    if (!inventory) {
      throw new NotFoundException('Product inventory not found');
    }

    const availableStock = inventory.stock - inventory.reserved;
    if (availableStock < quantity) {
      throw new NotFoundException('Insufficient stock available');
    }

    // Reserve stock using inventory service
    await this.inventoryService.adjust(productId, {
      reservedDelta: quantity,
      reason: 'Cart reservation',
      referenceType: 'cart'
    });
  }

  private async releaseStock(productId: string, quantity: number): Promise<void> {
    // Release reserved stock
    await this.inventoryService.adjust(productId, {
      reservedDelta: -quantity,
      reason: 'Cart release',
      referenceType: 'cart'
    });
  }

  private async updateReservedStock(productId: string, quantityDelta: number): Promise<void> {
    // Update reserved stock (positive delta = more reservation, negative delta = less reservation)
    await this.inventoryService.adjust(productId, {
      reservedDelta: quantityDelta,
      reason: 'Cart update',
      referenceType: 'cart'
    });
  }
}
