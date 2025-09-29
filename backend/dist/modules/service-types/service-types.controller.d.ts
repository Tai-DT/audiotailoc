import { ServiceTypesService } from './service-types.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
export declare class ServiceTypesController {
    private readonly serviceTypesService;
    constructor(serviceTypesService: ServiceTypesService);
    create(createServiceTypeDto: CreateServiceTypeDto): unknown;
    testCreate(createServiceTypeDto: CreateServiceTypeDto): unknown;
    debug(): {
        message: string;
        timestamp: any;
    };
    testEndpoint(): {
        message: string;
        timestamp: any;
    };
    simpleTest(): {
        status: string;
        message: string;
    };
    findAll(): unknown;
    findOne(id: string): unknown;
    update(id: string, updateServiceTypeDto: UpdateServiceTypeDto): unknown;
    remove(id: string): unknown;
}
