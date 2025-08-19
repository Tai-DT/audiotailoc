import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateActiveCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({ where: { userId, status: 'ACTIVE' } });
    if (!cart) cart = await this.prisma.cart.create({ data: { userId, status: 'ACTIVE' } });
    return cart;
  }

  async getCartWithTotals(userId: string) {
    const cart = await this.getOrCreateActiveCart(userId);
    const items = await this.prisma.cartItem.findMany({ where: { cartId: cart.id }, include: { product: true } });
    const subtotal = items.reduce((sum, i) => sum + i.quantity * (i.unitPrice || i.product.priceCents), 0);
    return { cart, items, subtotalCents: subtotal };
  }

  async addItem(userId: string, productSlug: string, quantity: number) {
    if (quantity <= 0) throw new BadRequestException('Số lượng không hợp lệ');
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { slug: productSlug } });
      if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
      const inv = await tx.inventory.findUnique({ where: { productId: product.id } });
      const available = (inv?.stock || 0) - (inv?.reserved || 0);
      if (available < quantity) throw new BadRequestException('Hết hàng');
      const cart = await this.getOrCreateActiveCart(userId);
      const existing = await tx.cartItem.findFirst({ where: { cartId: cart.id, productId: product.id } });
      const newQty = (existing?.quantity || 0) + quantity;
      await tx.cartItem.upsert({
        where: { id: existing?.id || 'no-id' },
        update: { quantity: newQty },
        create: { cartId: cart.id, productId: product.id, quantity, unitPrice: product.priceCents },
      });
      await tx.inventory.upsert({
        where: { productId: product.id },
        update: { reserved: { increment: quantity } },
        create: { productId: product.id, stock: 0, reserved: quantity },
      });
      return { ok: true };
    });
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    if (quantity < 0) throw new BadRequestException('Số lượng không hợp lệ');
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.findUnique({ where: { id: itemId }, include: { cart: true, product: true } });
      if (!item || item.cart.userId !== userId) throw new NotFoundException('Không tìm thấy mục');
      const diff = quantity - item.quantity;
      if (diff === 0) return { ok: true };
      const inv = await tx.inventory.findUnique({ where: { productId: item.productId } });
      const available = (inv?.stock || 0) - (inv?.reserved || 0);
      if (diff > 0 && available < diff) throw new BadRequestException('Hết hàng');
      if (quantity === 0) {
        await tx.cartItem.delete({ where: { id: itemId } });
      } else {
        await tx.cartItem.update({ where: { id: itemId }, data: { quantity } });
      }
      await tx.inventory.update({ where: { productId: item.productId }, data: { reserved: { increment: diff } } });
      return { ok: true };
    });
  }

  async removeItem(userId: string, itemId: string) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
      if (!item || item.cart.userId !== userId) throw new NotFoundException('Không tìm thấy mục');
      await tx.cartItem.delete({ where: { id: itemId } });
      await tx.inventory.update({ where: { productId: item.productId }, data: { reserved: { decrement: item.quantity } } });
      return { ok: true };
    });
  }
}

