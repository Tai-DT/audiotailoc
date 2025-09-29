import { InventoryService } from './inventory.service';
declare class ListQueryDto {
    page?: number;
    pageSize?: number;
    lowStockOnly?: string;
}
declare class AdjustDto {
    stockDelta?: number;
    reservedDelta?: number;
    lowStockThreshold?: number;
    stock?: number;
    reserved?: number;
}
export declare class InventoryController {
    private readonly inventory;
    constructor(inventory: InventoryService);
    list(q: ListQueryDto): unknown;
    adjust(productId: string, dto: AdjustDto): unknown;
    delete(productId: string): unknown;
    syncWithProducts(): unknown;
}
export {};
