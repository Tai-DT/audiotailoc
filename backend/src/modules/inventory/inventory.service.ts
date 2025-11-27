import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { inventory, inventory_movements } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private prisma: PrismaService) {}

  async list(params: { page?: number; pageSize?: number; lowStockOnly?: boolean }) {
    const { page = 1, pageSize = 20, lowStockOnly } = params;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (lowStockOnly) {
      where.stock = {
        lte: this.prisma.inventory.fields.lowStockThreshold,
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          products: true,
        },
        orderBy: {
          stock: 'asc',
        },
      }),
      this.prisma.inventory.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getInventoryStatus(productId: string): Promise<inventory | null> {
    return this.prisma.inventory.findUnique({
      where: { productId },
    });
  }

  async adjust(productId: string, dto: any) {
    // This method handles adjustments via controller
    // Convert controller DTO to internal logic if needed
    // For now, reusing updateInventory logic but adapting to controller needs
    return this.updateInventory(productId, {
      quantity: dto.stock,
      reserved: dto.reserved,
      lowStockThreshold: dto.lowStockThreshold,
    });
  }

  async delete(productId: string) {
    // Only delete inventory record, not the product
    return this.prisma.inventory.delete({
      where: { productId },
    });
  }

  async updateInventory(productId: string, updateDto: UpdateInventoryDto): Promise<inventory> {
    const { quantity, reserved, lowStockThreshold } = updateDto;

    // Use transaction to ensure consistency between Products and Inventory tables
    return this.prisma.$transaction(async tx => {
      // 1. Check if product exists
      const product = await tx.products.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      // Get current inventory for movement logging
      const currentInventory = await tx.inventory.findUnique({
        where: { productId },
      });
      const oldQuantity = currentInventory?.stock || 0;

      // 2. Update or create Inventory record
      const inventory = await tx.inventory.upsert({
        where: { productId },
        update: {
          stock: quantity,
          reserved,
          lowStockThreshold,
          updatedAt: new Date(),
        },
        create: {
          id: randomUUID(),
          products: { connect: { id: productId } },
          stock: quantity || 0,
          reserved: reserved || 0,
          lowStockThreshold: lowStockThreshold || 5,
          updatedAt: new Date(),
        },
      });

      // 3. Log movement if quantity changed
      if (quantity !== undefined) {
        const diff = quantity - oldQuantity;

        if (diff !== 0) {
          await tx.inventory_movements.create({
            data: {
              id: randomUUID(),
              products: { connect: { id: productId } },
              type: diff > 0 ? 'IN' : 'OUT',
              quantity: Math.abs(diff),
              previousStock: oldQuantity,
              newStock: quantity,
              reason: 'Manual Adjustment',
            },
          });
        }
      }

      return inventory;
    });
  }

  async recordMovement(dto: CreateInventoryMovementDto): Promise<inventory_movements> {
    return this.prisma.$transaction(async tx => {
      const inventory = await tx.inventory.findUnique({
        where: { id: dto.inventoryId },
      });

      if (!inventory) {
        throw new NotFoundException(`Inventory record ${dto.inventoryId} not found`);
      }

      // Calculate new quantity
      let newQuantity = inventory.stock;
      if (dto.type === 'IN') {
        newQuantity += dto.quantity;
      } else {
        if (inventory.stock < dto.quantity) {
          throw new BadRequestException('Insufficient stock');
        }
        newQuantity -= dto.quantity;
      }

      // 1. Update Inventory table
      await tx.inventory.update({
        where: { id: dto.inventoryId },
        data: { stock: newQuantity },
      });

      // 2. Create movement record
      return tx.inventory_movements.create({
        data: {
          id: randomUUID(),
          products: { connect: { id: inventory.productId } },
          type: dto.type,
          quantity: dto.quantity,
          previousStock: inventory.stock,
          newStock: newQuantity,
          reason: dto.reason,
          notes: dto.notes,
        },
      });
    });
  }

  async checkLowStock(): Promise<inventory[]> {
    return this.prisma.inventory.findMany({
      where: {
        stock: {
          lte: this.prisma.inventory.fields.lowStockThreshold,
        },
      },
      include: {
        products: true,
      },
    });
  }
}
