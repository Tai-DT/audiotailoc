import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    list(page: number, limit: number, status?: string, featured?: string, category?: string): unknown;
    getFeatured(): unknown;
    getBySlug(slug: string): unknown;
    getById(id: string): unknown;
    create(data: any): unknown;
    update(id: string, data: any): unknown;
    remove(id: string): unknown;
    toggleFeatured(id: string): unknown;
    toggleActive(id: string): unknown;
    updateOrder(id: string, displayOrder: number): unknown;
}
