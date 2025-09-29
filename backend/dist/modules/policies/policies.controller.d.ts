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
    findAll(): unknown;
    findByType(type: string): unknown;
    findBySlug(slug: string): unknown;
    create(data: CreatePolicyDto): unknown;
    update(slug: string, data: UpdatePolicyDto): unknown;
    delete(slug: string): unknown;
}
