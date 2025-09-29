import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ListPromotionsDto } from './dto/list-promotions.dto';
export declare class PromotionsController {
    private readonly promotions;
    constructor(promotions: PromotionService);
    findAll(query: ListPromotionsDto): unknown;
    getStatus(): {
        module: string;
        status: string;
        timestamp: any;
    };
    findOne(id: string): unknown;
    create(dto: CreatePromotionDto): unknown;
    update(id: string, dto: UpdatePromotionDto): unknown;
    remove(id: string): unknown;
    duplicate(id: string): unknown;
}
