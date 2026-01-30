import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // Guest Cart Management
  async createGuestCart() {
    const guestCart = await this.prisma.carts.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        userId: null, // Guest cart
        status: 'ACTIVE',
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
              },
            },
          },
        },
      },
    });

    this.logger.log(`Guest cart created: ${guestCart.id}`);
    return guestCart;
  }

  async getGuestCart(cartId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: {
        id: cartId,
        userId: null, // Guest cart
        status: 'ACTIVE',
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
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    return this.calculateCartTotals(cart);
  }

  async addToGuestCart(cartId: string, productId: string, quantity: number = 1) {
    // Check if guest cart exists
    const cart = await this.prisma.carts.findFirst({
      where: {
        id: cartId,
        userId: null,
        status: 'ACTIVE',
      },
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    // Check if product exists and is available
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check inventory stock availability
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId: productId },
    });

    if (!inventory) {
      this.logger.warn(`No inventory record found for product ${productId}`);
    }

    // Use transaction to handle race conditions
    await this.prisma.$transaction(async tx => {
      // Check if item already exists in cart (within transaction)
      const existingItem = await tx.cart_items.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      const currentQtyInCart = existingItem?.quantity || 0;
      const newQuantity = currentQtyInCart + quantity;

      // Validate stock for total quantity
      if (inventory) {
        const availableStock = inventory.stock - inventory.reserved;
        if (availableStock < newQuantity) {
          throw new BadRequestException(
            `Insufficient stock. Available: ${availableStock}, Total in cart would be: ${newQuantity}`,
          );
        }
      }

      if (existingItem) {
        // Update existing item
        await tx.cart_items.update({
          where: { id: existingItem.id },
          data: {
            quantity: newQuantity,
            price: product.priceCents,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new item - handle potential race condition
        try {
          await tx.cart_items.create({
            data: {
              id: randomUUID(),
              updatedAt: new Date(),
              cartId: cart.id,
              productId,
              quantity,
              price: product.priceCents,
            },
          });
        } catch (error: any) {
          // If unique constraint violation, item was created by concurrent request
          // Retry as update
          if (error.code === 'P2002') {
            const concurrentItem = await tx.cart_items.findFirst({
              where: { cartId: cart.id, productId },
            });
            if (concurrentItem) {
              await tx.cart_items.update({
                where: { id: concurrentItem.id },
                data: {
                  quantity: concurrentItem.quantity + quantity,
                  price: product.priceCents,
                  updatedAt: new Date(),
                },
              });
            }
          } else {
            throw error;
          }
        }
      }
    });

    this.logger.log(`Added ${quantity} of product ${productId} to guest cart ${cartId}`);
    return this.getGuestCart(cartId);
  }

  async updateGuestCartItem(cartId: string, productId: string, quantity: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { id: cartId, userId: null, status: 'ACTIVE' },
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    const cartItem = await this.prisma.cart_items.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity > cartItem.quantity) {
      const inventory = await this.prisma.inventory.findUnique({
        where: { productId },
      });
      if (inventory) {
        const availableStock = inventory.stock - inventory.reserved;
        if (availableStock < quantity) {
          throw new BadRequestException(`Số lượng tồn kho không đủ. Còn lại: ${availableStock}`);
        }
      }
    }

    if (quantity <= 0) {
      // Remove item
      await this.prisma.cart_items.delete({
        where: { id: cartItem.id },
      });
    } else {
      // Update quantity
      await this.prisma.cart_items.update({
        where: { id: cartItem.id },
        data: { quantity },
      });
    }

    return this.getGuestCart(cartId);
  }

  async removeFromGuestCart(cartId: string, productId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { id: cartId, userId: null, status: 'ACTIVE' },
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    const item = await this.prisma.cart_items.findFirst({ where: { cartId: cart.id, productId } });
    if (item) {
      // Note: Inventory management removed as it's not in current schema
      // TODO: Implement inventory management when schema is updated
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    }

    return this.getGuestCart(cartId);
  }

  async clearGuestCart(cartId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { id: cartId, userId: null, status: 'ACTIVE' },
    });

    if (!cart) {
      throw new NotFoundException('Guest cart not found');
    }

    const items = await this.prisma.cart_items.findMany({ where: { cartId: cart.id } });
    for (const item of items) {
      // Note: Inventory management removed as it's not in current schema
      // TODO: Implement inventory management when schema is updated
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    }

    return this.getGuestCart(cartId);
  }

  // Convert guest cart to user cart
  async convertGuestCartToUserCart(cartId: string, userId: string) {
    const guestCart = await this.prisma.carts.findFirst({
      where: { id: cartId, userId: null, status: 'ACTIVE' },
    });

    if (!guestCart) {
      throw new NotFoundException('Guest cart not found');
    }

    // Check if user already has an active cart
    const existingUserCart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (existingUserCart) {
      // Merge guest cart items into existing user cart
      const guestItems = await this.prisma.cart_items.findMany({
        where: { cartId: guestCart.id },
      });

      for (const item of guestItems) {
        const existingItem = await this.prisma.cart_items.findFirst({
          where: {
            cartId: existingUserCart.id,
            productId: item.productId,
          },
        });

        if (existingItem) {
          // Update quantity
          await this.prisma.cart_items.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          // Add new item
          await this.prisma.cart_items.create({
            data: {
              id: randomUUID(),
              updatedAt: new Date(),
              carts: { connect: { id: existingUserCart.id } },
              products: { connect: { id: item.productId } },
              quantity: item.quantity,
              price: item.price,
            },
          });
        }
      }

      // Delete guest cart
      await this.prisma.carts.delete({
        where: { id: guestCart.id },
      });

      return this.getUserCart(userId);
    } else {
      // Convert guest cart to user cart
      await this.prisma.carts.update({
        where: { id: guestCart.id },
        data: {
          userId,
        },
      });

      return this.getUserCart(userId);
    }
  }

  // User Cart Management (existing functionality)
  async getUserCart(userId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
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
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // Create new cart for user
      return this.createUserCart(userId);
    }

    return this.calculateCartTotals(cart);
  }

  async mergeGuestCartIntoUserCart(guestCartId: string, userId: string) {
    const guestCart = await this.prisma.carts.findFirst({
      where: { id: guestCartId, userId: null, status: 'ACTIVE' },
      include: { cart_items: true },
    });

    if (!guestCart || guestCart.cart_items.length === 0) return;

    let userCart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!userCart) {
      userCart = await this.createUserCart(userId);
    }

    for (const item of guestCart.cart_items) {
      // Check stock availability
      const inventory = await this.prisma.inventory.findUnique({
        where: { productId: item.productId },
      });
      const availableStock = inventory ? inventory.stock - inventory.reserved : 0;

      const existingUserItem = await this.prisma.cart_items.findFirst({
        where: { cartId: userCart.id, productId: item.productId },
      });

      const currentQtyInUserCart = existingUserItem?.quantity || 0;
      const requestedTotal = currentQtyInUserCart + item.quantity;

      // Cap to available stock if exceeded
      const finalQuantity = Math.min(requestedTotal, availableStock);

      if (finalQuantity <= 0) {
        this.logger.warn(`Skipping merge for product ${item.productId} - no stock available`);
        continue;
      }

      if (existingUserItem) {
        await this.prisma.cart_items.update({
          where: { id: existingUserItem.id },
          data: { quantity: finalQuantity },
        });
      } else {
        await this.prisma.cart_items.create({
          data: {
            id: randomUUID(),
            cartId: userCart.id,
            productId: item.productId,
            quantity: Math.min(item.quantity, availableStock),
            price: item.price,
            updatedAt: new Date(),
          },
        });
      }
    }

    // Mark guest cart as COMPLETED or DELETED
    await this.prisma.carts.update({
      where: { id: guestCartId },
      data: { status: 'MERGED', updatedAt: new Date() },
    });

    this.logger.log(`Merged guest cart ${guestCartId} into user cart ${userCart.id}`);
  }

  async createUserCart(userId: string) {
    const cart = await this.prisma.carts.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        userId,
        status: 'ACTIVE',
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
              },
            },
          },
        },
      },
    });

    this.logger.log(`User cart created: ${userId}`);
    return this.calculateCartTotals(cart);
  }

  async addToUserCart(userId: string, productId: string, quantity: number = 1) {
    let cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!cart) {
      cart = await this.createUserCart(userId);
    }

    if (!cart) {
      throw new Error('Failed to create or find cart');
    }

    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        priceCents: true,
        stockQuantity: true,
        isActive: true,
        isDeleted: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (!product.isActive || product.isDeleted) {
      throw new NotFoundException('Sản phẩm không còn được bán');
    }

    // ✅ Check stock availability from Inventory
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new NotFoundException('Sản phẩm không có thông tin tồn kho');
    }

    const availableStock = inventory.stock - inventory.reserved;

    // Use transaction to handle race conditions
    await this.prisma.$transaction(async tx => {
      const existingItem = await tx.cart_items.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      const currentQtyInCart = existingItem?.quantity || 0;
      const totalRequestedQty = currentQtyInCart + quantity;

      if (totalRequestedQty > availableStock) {
        throw new BadRequestException(
          `Không đủ hàng: ${product.name} (còn ${availableStock}, trong giỏ ${currentQtyInCart}, thêm ${quantity})`,
        );
      }

      if (existingItem) {
        await tx.cart_items.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
            price: product.priceCents,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new item - handle potential race condition
        try {
          await tx.cart_items.create({
            data: {
              id: randomUUID(),
              updatedAt: new Date(),
              cartId: cart.id,
              productId,
              quantity,
              price: product.priceCents,
            },
          });
        } catch (error: any) {
          // If unique constraint violation, item was created by concurrent request
          // Retry as update
          if (error.code === 'P2002') {
            const concurrentItem = await tx.cart_items.findFirst({
              where: { cartId: cart.id, productId },
            });
            if (concurrentItem) {
              await tx.cart_items.update({
                where: { id: concurrentItem.id },
                data: {
                  quantity: concurrentItem.quantity + quantity,
                  price: product.priceCents,
                  updatedAt: new Date(),
                },
              });
            }
          } else {
            throw error;
          }
        }
      }
    });

    return this.getUserCart(userId);
  }

  async updateUserCartItem(userId: string, productId: string, quantity: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!cart) {
      throw new NotFoundException('User cart not found');
    }

    const cartItem = await this.prisma.cart_items.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity > cartItem.quantity) {
      const inventory = await this.prisma.inventory.findUnique({
        where: { productId },
      });
      if (inventory) {
        const availableStock = inventory.stock - inventory.reserved;
        if (availableStock < quantity) {
          throw new BadRequestException(`Số lượng tồn kho không đủ. Còn lại: ${availableStock}`);
        }
      }
    }

    if (quantity <= 0) {
      await this.prisma.cart_items.delete({
        where: { id: cartItem.id },
      });
    } else {
      await this.prisma.cart_items.update({
        where: { id: cartItem.id },
        data: { quantity },
      });
    }

    return this.getUserCart(userId);
  }

  async removeFromUserCart(userId: string, productId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!cart) {
      throw new NotFoundException('User cart not found');
    }

    const item = await this.prisma.cart_items.findFirst({ where: { cartId: cart.id, productId } });
    if (item) {
      // Note: Inventory management removed as it's not in current schema
      // TODO: Implement inventory management when schema is updated
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    }

    return this.getUserCart(userId);
  }

  async clearUserCart(userId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!cart) {
      throw new NotFoundException('User cart not found');
    }

    const items = await this.prisma.cart_items.findMany({ where: { cartId: cart.id } });
    for (const item of items) {
      // Note: Inventory management removed as it's not in current schema
      // TODO: Implement inventory management when schema is updated
      await this.prisma.cart_items.delete({ where: { id: item.id } });
    }

    return this.getUserCart(userId);
  }

  // Helper method to calculate cart totals
  private calculateCartTotals(cart: any) {
    // 1. Filter out inactive or deleted products first
    const rawItems = cart.cart_items || cart.items || [];
    const validItems = rawItems.filter(
      (item: any) => item.products && !item.products.isDeleted && (item.products.isActive ?? true),
    );

    // 2. Identify and (optionally) log removed items
    if (validItems.length < rawItems.length) {
      this.logger.warn(
        `Cart ${cart.id} had ${rawItems.length - validItems.length} invalid items removed.`,
      );
    }

    const subtotal = validItems.reduce((sum: bigint, item: any) => {
      // ALWAYS use the latest product price from the DB (item.products.priceCents)
      // unless we want to "freeze" prices, but for e-commerce, real-time price is better
      const currentPrice = item.products?.priceCents || item.price || BigInt(0);
      return sum + currentPrice * BigInt(item.quantity);
    }, BigInt(0));

    const itemCount = validItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

    // In many Vietnam retailers, price already includes VAT.
    // If not, tax is 8% (current) or 10%. We'll assume VAT is inclusive for total,
    // but show it separately in the breakdown.
    const taxInclusive = true;
    const taxRate = 0.1;
    const taxAmount = taxInclusive
      ? subtotal - (subtotal * BigInt(Math.round(100 / (1 + taxRate)))) / BigInt(100)
      : (subtotal * BigInt(Math.round(taxRate * 100))) / BigInt(100);

    const shipping = subtotal > BigInt(10000000) ? BigInt(0) : BigInt(50000); // Free ship over 10M VND for Audio equipment

    return {
      ...cart,
      items: validItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.products?.priceCents) || Number(item.price), // Sync price
        product: {
          id: item.products.id,
          name: item.products.name,
          priceCents: Number(item.products.priceCents),
          imageUrl: item.products.imageUrl,
          images: this.safeParseJSON(item.products.images, []),
          stock: item.products.stockQuantity,
        },
      })),
      subtotal: Number(subtotal),
      itemCount,
      tax: Number(taxAmount),
      shipping: Number(shipping),
      total: Number(taxInclusive ? subtotal + shipping : subtotal + taxAmount + shipping),
      invalidItemsRemoved: rawItems.length - validItems.length,
    };
  }

  private safeParseJSON(data: any, defaultValue: any = []) {
    if (!data) return defaultValue;
    if (typeof data !== 'string') return data;
    try {
      return JSON.parse(data);
    } catch (e) {
      return defaultValue;
    }
  }

  // Clean up old guest carts (older than 7 days)
  async cleanupExpiredGuestCarts() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const expiredCarts = await this.prisma.carts.findMany({
      where: {
        userId: null, // Guest carts
        createdAt: { lt: sevenDaysAgo },
        status: 'ACTIVE',
      },
    });

    for (const cart of expiredCarts) {
      await this.prisma.carts.update({
        where: { id: cart.id },
        data: { status: 'ABANDONED' },
      });
    }

    this.logger.log(`Cleaned up ${expiredCarts.length} expired guest carts`);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (cart) {
      await this.prisma.carts.update({
        where: { id: cart.id },
        data: { status: 'COMPLETED', updatedAt: new Date() },
      });
      this.logger.log(`Cart ${cart.id} cleared for user ${userId}`);
    }
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
    const subtotalCents = items.reduce(
      (sum, i) => sum + (i.price || i.products.priceCents) * BigInt(i.quantity),
      BigInt(0),
    );
    return { cart, items, subtotalCents: Number(subtotalCents) };
  }
}
