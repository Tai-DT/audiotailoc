import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: QueryProjectsDto) {
    const { page = 1, limit = 10, status, featured, category, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      isDeleted: false, // Exclude soft-deleted
    };

    if (status) {
      where.status = status;
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { client: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      this.prisma.projects.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
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

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findFeatured() {
    return this.prisma.projects.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 6,
    });
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

    // Parse JSON fields if provided as strings
    const jsonFields = ['technologies', 'features', 'images', 'tags'];
    for (const field of jsonFields) {
      if (data[field] && typeof data[field] === 'string') {
        try {
          data[field] = JSON.stringify(JSON.parse(data[field]));
        } catch (e) {
          // If it's not valid JSON, keep as is
        }
      } else if (data[field] && Array.isArray(data[field])) {
        data[field] = JSON.stringify(data[field]);
      }
    }

    // Extract YouTube video ID from URL if provided
    if (data.youtubeVideoUrl) {
      data.youtubeVideoId = this.extractYouTubeId(data.youtubeVideoUrl);
    }

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

    // Parse JSON fields if provided as strings
    const jsonFields = ['technologies', 'features', 'images', 'tags'];
    for (const field of jsonFields) {
      if (data[field] && typeof data[field] === 'string') {
        try {
          data[field] = JSON.stringify(JSON.parse(data[field]));
        } catch (e) {
          // If it's not valid JSON, keep as is
        }
      } else if (data[field] && Array.isArray(data[field])) {
        data[field] = JSON.stringify(data[field]);
      }
    }

    // Extract YouTube video ID from URL if provided
    if (data.youtubeVideoUrl) {
      data.youtubeVideoId = this.extractYouTubeId(data.youtubeVideoUrl);
    }

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

  async remove(id: string, permanent: boolean = false) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    if (permanent) {
      // Permanent delete
      await this.prisma.projects.delete({
        where: { id },
      });
      return { message: 'Project permanently deleted', id };
    } else {
      // Soft delete
      await this.prisma.projects.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      return { message: 'Project soft deleted successfully', id };
    }
  }

  async restore(id: string) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    if (!project.isDeleted) {
      throw new BadRequestException('Project is not deleted');
    }

    await this.prisma.projects.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return { message: 'Project restored successfully', id };
  }

  async toggleFeatured(id: string) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.projects.update({
      where: { id },
      data: { isFeatured: !project.isFeatured },
    });
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
