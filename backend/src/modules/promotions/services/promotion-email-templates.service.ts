import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  subject: string;
  content: string;
  htmlContent?: string;
  plainText?: string;
  variables: string[]; // List of variable names like ['name', 'discount', 'expiryDate']
  usageCount: number;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  tags?: string[];
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  category?: string;
  subject: string;
  content: string;
  htmlContent?: string;
  plainText?: string;
  variables?: string[];
  tags?: string[];
  createdBy?: string;
}

export interface UpdateTemplateDto {
  name?: string;
  description?: string;
  category?: string;
  subject?: string;
  content?: string;
  htmlContent?: string;
  plainText?: string;
  variables?: string[];
  tags?: string[];
  isActive?: boolean;
}

@Injectable()
export class PromotionEmailTemplatesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new email template
   */
  async createTemplate(data: CreateTemplateDto): Promise<EmailTemplate> {
    try {
      // Check if template name already exists
      const existing = await this.prisma.email_templates.findFirst({
        where: { name: data.name },
      });

      if (existing) {
        throw new ConflictException('Template name already exists');
      }

      const template = await this.prisma.email_templates.create({
        data: {
          id: uuidv4(),
          name: data.name,
          description: data.description,
          category: data.category,
          subject: data.subject,
          content: this.serializeContent({
            html: data.htmlContent || data.content,
            plain: data.plainText || data.content,
            variables: data.variables || this.extractVariables(data.content),
            tags: data.tags || [],
            createdBy: data.createdBy,
          }),
          usageCount: 0,
          isActive: true,
          updatedAt: new Date(),
        },
      });

      return this.formatTemplate(template);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create template: ${(error as any).message}`);
    }
  }

  /**
   * Get template by ID
   */
  async getTemplateById(templateId: string): Promise<EmailTemplate | null> {
    try {
      const template = await this.prisma.email_templates.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        return null;
      }

      return this.formatTemplate(template);
    } catch (error) {
      throw new BadRequestException(`Failed to get template: ${(error as any).message}`);
    }
  }

  /**
   * List all templates with filtering
   */
  async listTemplates(filters?: {
    category?: string;
    search?: string;
    isActive?: boolean;
    skip?: number;
    take?: number;
  }): Promise<{
    templates: EmailTemplate[];
    total: number;
  }> {
    try {
      const skip = filters?.skip || 0;
      const take = filters?.take || 20;

      const whereCondition: any = {};

      if (filters?.category) {
        whereCondition.category = filters.category;
      }

      if (filters?.isActive !== undefined) {
        whereCondition.isActive = filters.isActive;
      }

      if (filters?.search) {
        whereCondition.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [templates, total] = await Promise.all([
        this.prisma.email_templates.findMany({
          where: whereCondition,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.email_templates.count({ where: whereCondition }),
      ]);

      return {
        templates: templates.map(t => this.formatTemplate(t)),
        total,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to list templates: ${(error as any).message}`);
    }
  }

  /**
   * Update template
   */
  async updateTemplate(
    templateId: string,
    updates: UpdateTemplateDto,
  ): Promise<EmailTemplate | null> {
    try {
      const template = await this.prisma.email_templates.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      // Check for duplicate name if updating name
      if (updates.name && updates.name !== template.name) {
        const existing = await this.prisma.email_templates.findFirst({
          where: { name: updates.name },
        });

        if (existing) {
          throw new ConflictException('Template name already exists');
        }
      }

      const updated = await this.prisma.email_templates.update({
        where: { id: templateId },
        data: {
          name: updates.name,
          description: updates.description,
          category: updates.category,
          subject: updates.subject,
          content:
            updates.htmlContent || updates.content
              ? this.serializeContent({
                  html: updates.htmlContent || updates.content || template.content,
                  plain: updates.plainText || template.content,
                  variables: updates.variables || this.extractVariables(template.content),
                })
              : template.content,
          isActive: updates.isActive,
        },
      });

      return this.formatTemplate(updated);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update template: ${(error as any).message}`);
    }
  }

  /**
   * Delete template
   */
  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      const template = await this.prisma.email_templates.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      // Check if template is in use
      const inUse = await this.prisma.campaigns.count({
        where: { templateId },
      });

      if (inUse > 0) {
        throw new BadRequestException('Template is in use by campaigns');
      }

      await this.prisma.email_templates.delete({
        where: { id: templateId },
      });

      return true;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete template: ${(error as any).message}`);
    }
  }

  /**
   * Render template with variables
   */
  async renderTemplate(
    templateId: string,
    variables: Record<string, any>,
  ): Promise<{
    subject: string;
    html: string;
    plain: string;
  }> {
    try {
      const template = await this.prisma.email_templates.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      const content = this.parseContent(template.content);

      const subject = this.replaceVariables(template.subject, variables);
      const html = this.replaceVariables(content.html, variables);
      const plain = this.replaceVariables(content.plain, variables);

      // Increment usage count
      await this.prisma.email_templates.update({
        where: { id: templateId },
        data: { usageCount: { increment: 1 } },
      });

      return { subject, html, plain };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to render template: ${(error as any).message}`);
    }
  }

  /**
   * Duplicate template
   */
  async duplicateTemplate(templateId: string): Promise<EmailTemplate> {
    try {
      const template = await this.prisma.email_templates.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      const newTemplate = await this.prisma.email_templates.create({
        data: {
          id: uuidv4(),
          name: `${template.name} (Copy)`,
          description: template.description,
          category: template.category,
          subject: template.subject,
          content: template.content,
          usageCount: 0,
          isActive: true,
          updatedAt: new Date(),
        },
      });

      return this.formatTemplate(newTemplate);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to duplicate template: ${(error as any).message}`);
    }
  }

  /**
   * Get template by category
   */
  async getTemplatesByCategory(category: string): Promise<EmailTemplate[]> {
    try {
      const templates = await this.prisma.email_templates.findMany({
        where: { category, isActive: true },
        orderBy: { usageCount: 'desc' },
      });

      return templates.map(t => this.formatTemplate(t));
    } catch (error) {
      throw new BadRequestException(
        `Failed to get templates by category: ${(error as any).message}`,
      );
    }
  }

  /**
   * Get template usage statistics
   */
  async getTemplateStats(templateId: string): Promise<{
    templateId: string;
    name: string;
    usageCount: number;
    averageRenderTime: number;
    lastUsed?: Date;
    successRate: number;
  }> {
    try {
      const template = await this.prisma.email_templates.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      // Get email logs for this template
      const logs = await this.prisma.email_logs.findMany({
        where: { subject: { contains: template.subject.substring(0, 50) } },
        select: { sentAt: true, status: true },
        orderBy: { sentAt: 'desc' },
        take: 100,
      });

      const successful = logs.filter(l => l.status === 'SENT').length;
      const successRate = logs.length > 0 ? (successful / logs.length) * 100 : 0;

      return {
        templateId,
        name: template.name,
        usageCount: template.usageCount,
        averageRenderTime: 45, // Placeholder - would need timing data
        lastUsed: logs.length > 0 ? logs[0].sentAt : undefined,
        successRate: Math.round(successRate * 100) / 100,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get stats: ${(error as any).message}`);
    }
  }

  /**
   * Preview template
   */
  async previewTemplate(
    templateId: string,
    variables?: Record<string, any>,
  ): Promise<{
    subject: string;
    html: string;
    plain: string;
  }> {
    try {
      const template = await this.prisma.email_templates.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      const content = this.parseContent(template.content);
      const defaultVariables = this.getDefaultVariables(content.variables);
      const mergedVariables = { ...defaultVariables, ...variables };

      const subject = this.replaceVariables(template.subject, mergedVariables);
      const html = this.replaceVariables(content.html, mergedVariables);
      const plain = this.replaceVariables(content.plain, mergedVariables);

      return { subject, html, plain };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to preview template: ${(error as any).message}`);
    }
  }

  /**
   * Create template version
   */
  async createVersion(templateId: string, updates: UpdateTemplateDto): Promise<EmailTemplate> {
    try {
      const template = await this.prisma.email_templates.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      // Create new version by duplicating and updating
      const newTemplate = await this.prisma.email_templates.create({
        data: {
          id: uuidv4(),
          name: `${template.name} v${template.usageCount + 1}`,
          description: updates.description || template.description,
          category: updates.category || template.category,
          subject: updates.subject || template.subject,
          content: updates.htmlContent || updates.content || template.content,
          usageCount: 0,
          isActive: updates.isActive !== undefined ? updates.isActive : template.isActive,
          updatedAt: new Date(),
        },
      });

      return this.formatTemplate(newTemplate);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create version: ${(error as any).message}`);
    }
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit: number = 10): Promise<EmailTemplate[]> {
    try {
      const templates = await this.prisma.email_templates.findMany({
        where: { isActive: true },
        orderBy: { usageCount: 'desc' },
        take: limit,
      });

      return templates.map(t => this.formatTemplate(t));
    } catch (error) {
      throw new BadRequestException(`Failed to get popular templates: ${(error as any).message}`);
    }
  }

  /**
   * Validate template syntax
   */
  async validateTemplate(content: string): Promise<{
    valid: boolean;
    variables: string[];
    errors: string[];
  }> {
    try {
      const variables = this.extractVariables(content);
      const errors: string[] = [];

      // Check for unclosed tags
      const openTags = (content.match(/\{\{/g) || []).length;
      const closeTags = (content.match(/\}\}/g) || []).length;

      if (openTags !== closeTags) {
        errors.push('Mismatched template tags {{ }}');
      }

      return {
        valid: errors.length === 0,
        variables,
        errors,
      };
    } catch (error) {
      throw new BadRequestException(`Validation failed: ${(error as any).message}`);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private extractVariables(content: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = regex.exec(content)) !== null) {
      variables.add(match[1]);
    }

    return Array.from(variables);
  }

  private replaceVariables(content: string, variables: Record<string, any>): string {
    let result = content;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value || ''));
    }

    return result;
  }

  private serializeContent(data: {
    html: string;
    plain: string;
    variables: string[];
    tags?: string[];
    createdBy?: string;
  }): string {
    return JSON.stringify({
      html: data.html,
      plain: data.plain,
      variables: data.variables,
      tags: data.tags || [],
      createdBy: data.createdBy,
      createdAt: new Date(),
    });
  }

  private parseContent(content: string): {
    html: string;
    plain: string;
    variables: string[];
    tags: string[];
  } {
    try {
      const parsed = JSON.parse(content);
      return {
        html: parsed.html || '',
        plain: parsed.plain || '',
        variables: parsed.variables || [],
        tags: parsed.tags || [],
      };
    } catch {
      return {
        html: content,
        plain: content,
        variables: this.extractVariables(content),
        tags: [],
      };
    }
  }

  private formatTemplate(template: any): EmailTemplate {
    const content = this.parseContent(template.content);

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      subject: template.subject,
      content: content.html,
      htmlContent: content.html,
      plainText: content.plain,
      variables: content.variables,
      usageCount: template.usageCount,
      isActive: template.isActive,
      version: 1, // Simplified versioning
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      tags: content.tags,
    };
  }

  private getDefaultVariables(variables: string[]): Record<string, string> {
    const defaults: Record<string, string> = {};

    for (const variable of variables) {
      defaults[variable] = `[${variable}]`;
    }

    return defaults;
  }
}
