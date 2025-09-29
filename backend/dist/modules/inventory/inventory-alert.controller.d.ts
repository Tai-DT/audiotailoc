import { InventoryAlertService } from './inventory-alert.service';
export declare class InventoryAlertController {
    private readonly inventoryAlertService;
    constructor(inventoryAlertService: InventoryAlertService);
    create(data: {
        productId: string;
        type: string;
        message: string;
        threshold?: number;
        currentStock?: number;
    }): unknown;
    findAll(page?: string, pageSize?: string, productId?: string, type?: string, isResolved?: string, startDate?: string, endDate?: string): unknown;
    findByProduct(productId: string, page?: string, pageSize?: string): unknown;
    getActiveAlerts(): unknown;
    getAlertSummary(): unknown;
    resolve(id: string): unknown;
    bulkResolve(data: {
        ids: string[];
    }): unknown;
    checkAndCreateAlerts(): unknown;
    delete(id: string): unknown;
    bulkDelete(data: {
        ids: string[];
    }): unknown;
}
