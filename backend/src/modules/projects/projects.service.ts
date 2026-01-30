import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeStringArrayField(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (Array.isArray(value)) {
      const items = value
        .map(v => (v === null || v === undefined ? '' : String(v).trim()))
        .filter(v => v && v !== '[' && v !== ']');
      return items.length ? JSON.stringify(items) : undefined;
    }

    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    // Handle stringified JSON arrays
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const items = parsed
            .map(v => (v === null || v === undefined ? '' : String(v).trim()))
            .filter(v => v && v !== '[' && v !== ']');
          return items.length ? JSON.stringify(items) : undefined;
        }
        if (typeof parsed === 'string') {
          const item = parsed.trim();
          return item && item !== '[' && item !== ']' ? JSON.stringify([item]) : undefined;
        }
      } catch {
        // Not a valid JSON string starting with [, check if it's actually just "["
        if (trimmed === '[' || trimmed === '[]') return undefined;
      }
    }

    // Handle comma-separated strings
    const parts = trimmed
      .split(',')
      .map(p => p.trim())
      .filter(p => p && p !== '[' && p !== ']');

    return parts.length ? JSON.stringify(parts) : undefined;
  }

  private normalizeProjectJsonFields(data: any): void {
    const jsonFields = ['technologies', 'features', 'images', 'tags', 'galleryImages'];
    for (const field of jsonFields) {
      if (data[field] === undefined) continue;

      const normalized = this.normalizeStringArrayField(data[field]);
      if (normalized !== undefined) {
        data[field] = normalized;
      }
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    featured?: boolean;
    category?: string;
  }) {
    const { page = 1, limit = 10, status, featured, category } = params;
    const skip = (page - 1) * limit;

    // Build where clause without any featured/isFeatured references
    const where: any = {
      isActive: true,
    };

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    // Try to fetch projects - handle any column errors gracefully
    try {
      const [projects, total] = await Promise.all([
        this.prisma.projects.findMany({
          where,
          skip,
          take: limit,
          orderBy: [{ createdAt: 'desc' }],
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
        this.prisma.projects.count({ where }),
      ]);

      // Filter by featured in memory if needed (since DB column might not exist)
      let filteredProjects = projects;
      if (featured !== undefined) {
        // Try to filter by isFeatured if it exists in the data
        filteredProjects = projects.filter((p: any) => {
          // Check both isFeatured and featured properties
          const isFeaturedValue =
            p.isFeatured !== undefined
              ? p.isFeatured
              : p.featured !== undefined
                ? p.featured
                : false;
          return featured ? isFeaturedValue : !isFeaturedValue;
        });
      }

      return {
        data: filteredProjects,
        meta: {
          total: featured !== undefined ? filteredProjects.length : total,
          page,
          limit,
          totalPages: Math.ceil((featured !== undefined ? filteredProjects.length : total) / limit),
        },
      };
    } catch (error: any) {
      // Handle missing column error gracefully
      if (error.message?.includes('does not exist') || error.message?.includes('featured')) {
        console.warn('Column error detected, retrying without problematic filters:', error.message);
        // Remove any problematic filters
        const safeWhere: any = {
          isActive: true,
        };

        if (status) {
          safeWhere.status = status;
        }

        if (category) {
          safeWhere.category = category;
        }

        const [projects, total] = await Promise.all([
          this.prisma.projects.findMany({
            where: safeWhere,
            skip,
            take: limit,
            orderBy: [{ createdAt: 'desc' }],
            include: {
              users: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          }),
          this.prisma.projects.count({ where: safeWhere }),
        ]);

        // Filter by featured in memory if needed
        let filteredProjects = projects;
        if (featured !== undefined) {
          // Since we can't filter by DB column, return all (or empty if featured=true)
          filteredProjects = featured ? [] : projects;
        }

        return {
          data: filteredProjects,
          meta: {
            total: featured !== undefined ? filteredProjects.length : total,
            page,
            limit,
            totalPages: Math.ceil(
              (featured !== undefined ? filteredProjects.length : total) / limit,
            ),
          },
        };
      }
      throw error;
    }
  }

  async findFeatured() {
    try {
      // Don't use isFeatured filter in database query - filter in memory instead
      // This avoids column mismatch errors
      const projects = await this.prisma.projects.findMany({
        where: {
          isActive: true,
        },
        orderBy: [{ createdAt: 'desc' }],
        take: 20, // Fetch more to filter in memory
      });

      // Filter by isFeatured in memory if column exists in data
      const featuredProjects = projects.filter((p: any) => {
        // Check both isFeatured and featured properties
        const isFeaturedValue =
          p.isFeatured !== undefined ? p.isFeatured : p.featured !== undefined ? p.featured : false;
        return isFeaturedValue === true;
      });

      // Return top 6 featured projects
      return featuredProjects.slice(0, 6);
    } catch (error: any) {
      // Handle any errors gracefully
      console.warn('Error fetching featured projects, returning empty array:', error.message);
      return [];
    }
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.projects.findUnique({
      where: { slug },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Increment view count
    await this.prisma.projects.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    });

    return project;
  }

  async findById(id: string) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(data: any) {
    // Generate slug from name if not provided
    if (!data.slug) {
      data.slug = this.generateSlug(data.name);
    }

    // Ensure slug is unique
    const existingProject = await this.prisma.projects.findUnique({
      where: { slug: data.slug },
    });

    if (existingProject) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    // Normalize JSON-like fields to always be a JSON array string
    this.normalizeProjectJsonFields(data);

    // Extract YouTube video ID from URL if provided
    if (data.youtubeVideoUrl) {
      data.youtubeVideoId = this.extractYouTubeId(data.youtubeVideoUrl);
    }

    data.updatedAt = new Date();

    return this.prisma.projects.create({
      data,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Update slug if name changed
    if (data.name && data.name !== project.name && !data.slug) {
      data.slug = this.generateSlug(data.name);

      // Ensure slug is unique
      const existingProject = await this.prisma.projects.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existingProject) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    // Normalize JSON-like fields to always be a JSON array string
    this.normalizeProjectJsonFields(data);

    // Extract YouTube video ID from URL if provided
    if (data.youtubeVideoUrl) {
      data.youtubeVideoId = this.extractYouTubeId(data.youtubeVideoUrl);
    }

    data.updatedAt = new Date();

    return this.prisma.projects.update({
      where: { id },
      data,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.projects.delete({
      where: { id },
    });

    return { message: 'Project deleted successfully' };
  }

  async toggleFeatured(id: string) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    try {
      // Try to toggle isFeatured
      const currentValue =
        (project as any).isFeatured !== undefined
          ? (project as any).isFeatured
          : (project as any).featured !== undefined
            ? (project as any).featured
            : false;

      return await this.prisma.projects.update({
        where: { id },
        data: { isFeatured: !currentValue },
      });
    } catch (error: any) {
      // If column doesn't exist, return project without update
      if (error.message?.includes('does not exist') || error.message?.includes('featured')) {
        console.warn('isFeatured column not available, cannot toggle featured status');
        return project;
      }
      throw error;
    }
  }

  async toggleActive(id: string) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.projects.update({
      where: { id },
      data: { isActive: !project.isActive },
    });
  }

  async updateDisplayOrder(id: string, displayOrder: number) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.projects.update({
      where: { id },
      data: { displayOrder },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private extractYouTubeId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  async updateImages(
    id: string,
    imageData: {
      thumbnailImage?: string;
      coverImage?: string;
      galleryImages?: string;
    },
  ) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.projects.update({
      where: { id },
      data: imageData,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
