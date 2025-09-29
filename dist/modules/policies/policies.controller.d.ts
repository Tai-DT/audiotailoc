import { PoliciesService } from './policies.service';
export interface CreatePolicyDto {
    title: string;
    contentHtml: string;
    summary?: string;
    type: string;
    isPublished?: boolean;
}
export interface UpdatePolicyDto {
    title?: string;
    contentHtml?: string;
    summary?: string;
    isPublished?: boolean;
}
export declare class PoliciesController {
    private readonly policiesService;
    constructor(policiesService: PoliciesService);
    findAll(): Promise<import("./policies.service").Policy[]>;
    findByType(type: string): Promise<import("./policies.service").Policy>;
    findBySlug(slug: string): Promise<import("./policies.service").Policy>;
    create(data: CreatePolicyDto): Promise<import("./policies.service").Policy>;
    update(slug: string, data: UpdatePolicyDto): Promise<import("./policies.service").Policy>;
    delete(slug: string): Promise<import("./policies.service").Policy>;
}
