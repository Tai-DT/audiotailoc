import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
export declare class ServiceTypesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createServiceTypeDto: CreateServiceTypeDto): unknown;
    findAll(): unknown;
    findOne(id: string): unknown;
    update(id: string, updateServiceTypeDto: UpdateServiceTypeDto): unknown;
    remove(id: string): unknown;
    private generateSlug;
}
