import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { inventory, inventory_movements } from '@prisma/client';
export declare class InventoryService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    list(params: {
        page?: number;
        pageSize?: number;
        lowStockOnly?: boolean;
    }): Promise<{
        items: ({
            products: {
                model: string | null;
                tags: string | null;
                description: string | null;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                isDeleted: boolean;
                slug: string;
                shortDescription: string | null;
                priceCents: bigint;
                originalPriceCents: bigint | null;
                imageUrl: string | null;
                images: string | null;
                categoryId: string | null;
                brand: string | null;
                sku: string | null;
                specifications: string | null;
                features: string | null;
                warranty: string | null;
                weight: number | null;
                dimensions: string | null;
                minOrderQuantity: number;
                maxOrderQuantity: number | null;
                maxStock: number | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                canonicalUrl: string | null;
                featured: boolean;
                isActive: boolean;
                viewCount: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            stock: number;
            reserved: number;
            lowStockThreshold: number;
        })[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    getInventoryStatus(productId: string): Promise<inventory | null>;
    adjust(productId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        stock: number;
        reserved: number;
        lowStockThreshold: number;
    }>;
    delete(productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        stock: number;
        reserved: number;
        lowStockThreshold: number;
    }>;
    updateInventory(productId: string, updateDto: UpdateInventoryDto): Promise<inventory>;
    recordMovement(dto: CreateInventoryMovementDto): Promise<inventory_movements>;
    checkLowStock(): Promise<inventory[]>;
}
