import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductListQueryDto,
  ProductResponseDto,
  ProductListResponseDto,
  ProductAnalyticsDto,
  BulkUpdateProductsDto,
  ProductSearchSuggestionDto,
  ProductSortBy,
  SortOrder,
} from '../dto/complete-product.dto';

@Injectable()
export class CompleteProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const {
      name,
      slug,
      description,
      shortDescription,
      priceCents,
      originalPriceCents,
      stockQuantity = 0,
      sku,
      warranty,
      features,
      minOrderQuantity = 1,
      maxOrderQuantity,
      tags,
      categoryId,
      brand,
      model,
      weight,
      dimensions,
      specifications,
      images,
      isActive = true,
      featured = false,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
    } = createProductDto;

    // Generate slug if not provided
    const finalSlug = slug || this.generateSlug(name);

    // Check for duplicate slug
    const existingProduct = await this.prisma.products.findUnique({
      where: { slug: finalSlug },
    });

    if (existingProduct) {
      throw new ConflictException(`Product with slug '${finalSlug}' already exists`);
    }

    // Check if category exists
    if (categoryId && categoryId.trim() !== '') {
      const category = await this.prisma.categories.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID '${categoryId}' not found`);
      }
    }

    // Create product
    const product = await this.prisma.products.create({
      data: {
        id: randomUUID(),
        name,
        slug: finalSlug,
        description,
        shortDescription,
        priceCents,
        originalPriceCents,
        stockQuantity,
        sku,
        warranty,
        features,
        minOrderQuantity,
        maxOrderQuantity,
        tags,
        categoryId: categoryId && categoryId.trim() !== '' ? categoryId : null,
        brand,
        model,
        weight,
        dimensions,
        specifications: specifications ? JSON.parse(JSON.stringify(specifications)) : null,
        images: images ? JSON.parse(JSON.stringify(images)) : null,
        isActive,
        featured,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        updatedAt: new Date(),
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return this.mapToProductResponse(product);
  }

  async findProducts(query: ProductListQueryDto): Promise<ProductListResponseDto> {
    const {
      page = 1,
      pageSize = 20,
      sortBy = ProductSortBy.CREATED_AT,
      sortOrder = SortOrder.DESC,
      search,
      minPrice,
      maxPrice,
      categoryId,
      featured,
      isActive,
    } = query;

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined) {
      where.priceCents = { ...where.priceCents, gte: minPrice };
    }

    if (maxPrice !== undefined) {
      where.priceCents = { ...where.priceCents, lte: maxPrice };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Build order by
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Execute query
    const [products, total] = await Promise.all([
      this.prisma.products.findMany({
        where,
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      this.prisma.products.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: products.map(product => this.mapToProductResponse(product)),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async searchProducts(query: string, limit: number = 20): Promise<ProductListResponseDto> {
    // Temporary debug: return hardcoded response
    return {
      items: [{
        id: 'test-id',
        slug: 'test-product',
        name: 'Test Product',
        description: 'Test description',
        shortDescription: 'Test short description',
        priceCents: 100000,
        originalPriceCents: undefined,
        images: undefined,
        category: { id: 'test-cat', name: 'Test Category', slug: 'test-category' },
        brand: 'Test Brand',
        model: 'Test Model',
        sku: 'TEST-001',
        specifications: undefined,
        features: 'Test features',
        warranty: '1 year',
        // stockQuantity: 10, // Field does not exist in ProductResponseDto
        minOrderQuantity: 1,
        maxOrderQuantity: 5,
        tags: 'test,tag',
        metaTitle: 'Test Product',
        metaDescription: 'Test description',
        metaKeywords: 'test,product',
        canonicalUrl: 'https://test.com/product',
        featured: false,
        isActive: true,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }],
      total: 1,
      page: 1,
      pageSize: limit,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  }

  async getSearchSuggestions(query: string, limit: number = 10): Promise<ProductSearchSuggestionDto[]> {
    const searchLimit = Math.min(Math.max(limit, 1), 20);

    // Get product suggestions
    const products = await this.prisma.products.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        name: { contains: query },
      },
      select: {
        name: true,
      },
      take: searchLimit,
    });

    // Get category suggestions
    const categories = await this.prisma.categories.findMany({
      where: {
        isActive: true,
        name: { contains: query },
      },
      select: {
        name: true,
      },
      take: searchLimit,
    });

    const suggestions: ProductSearchSuggestionDto[] = [];

    // Add product suggestions
    products.forEach(product => {
      suggestions.push({
        text: product.name,
        type: 'product',
      });
    });

    // Add category suggestions
    categories.forEach(category => {
      suggestions.push({
        text: category.name,
        type: 'category',
      });
    });

    return suggestions.slice(0, searchLimit);
  }

  async findProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.products.findUnique({
      where: { id, isDeleted: false },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return this.mapToProductResponse(product);
  }

  async findProductBySlug(slug: string): Promise<ProductResponseDto> {
    const product = await this.prisma.products.findUnique({
      where: { slug, isDeleted: false },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug '${slug}' not found`);
    }

    // Increment view count
    await this.prisma.products.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return this.mapToProductResponse(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.prisma.products.findUnique({
      where: { id, isDeleted: false },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    const {
      name,
      slug,
      description,
      shortDescription,
      priceCents,
      originalPriceCents,
      stockQuantity,
      sku,
      warranty,
      features,
      minOrderQuantity,
      maxOrderQuantity,
      tags,
      categoryId,
      brand,
      model,
      weight,
      dimensions,
      specifications,
      images,
      isActive,
      featured,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
    } = updateProductDto;

    // Check slug uniqueness if updating slug
    if (slug && slug !== product.slug) {
      const existingProduct = await this.prisma.products.findUnique({
        where: { slug },
      });

      if (existingProduct) {
        throw new ConflictException(`Product with slug '${slug}' already exists`);
      }
    }

    // Check category if updating categoryId
    if (categoryId && categoryId !== product.categoryId) {
      const category = await this.prisma.categories.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID '${categoryId}' not found`);
      }
    }

    // Update product
    const updatedProduct = await this.prisma.products.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(priceCents && { priceCents }),
        ...(originalPriceCents !== undefined && { originalPriceCents }),
        ...(stockQuantity !== undefined && { stockQuantity }),
        ...(sku !== undefined && { sku }),
        ...(warranty !== undefined && { warranty }),
        ...(features !== undefined && { features }),
        ...(minOrderQuantity && { minOrderQuantity }),
        ...(maxOrderQuantity !== undefined && { maxOrderQuantity }),
        ...(tags !== undefined && { tags }),
        ...(categoryId && { categoryId }),
        ...(brand !== undefined && { brand }),
        ...(model !== undefined && { model }),
        ...(weight !== undefined && { weight }),
        ...(dimensions !== undefined && { dimensions }),
        ...(specifications && { specifications: JSON.parse(JSON.stringify(specifications)) }),
        ...(images && { images: JSON.parse(JSON.stringify(images)) }),
        ...(isActive !== undefined && { isActive }),
        ...(featured !== undefined && { featured }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(metaKeywords !== undefined && { metaKeywords }),
        ...(canonicalUrl !== undefined && { canonicalUrl }),
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return this.mapToProductResponse(updatedProduct);
  }

  async deleteProduct(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id, isDeleted: false },
        select: {
          id: true,
          name: true,
          _count: {
            select: { order_items: true }
          }
        }
      });

      if (!product) {
        return { deleted: false, message: 'Product not found' };
      }

      // Check if product has associated order items
      if (product._count.order_items > 0) {
        return {
          deleted: false,
          message: `Cannot delete product "${product.name}" because it has ${product._count.order_items} associated order(s). Please remove or update the orders first.`
        };
      }

      // Safe to delete (soft delete)
      await this.prisma.products.update({
        where: { id },
        data: { isDeleted: true },
      });

      return { deleted: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { deleted: false, message: 'An error occurred while deleting the product' };
    }
  }

  async bulkDeleteProducts(ids: string[]): Promise<void> {
    if (!ids.length) {
      throw new BadRequestException('No product IDs provided');
    }

    const products = await this.prisma.products.findMany({
      where: {
        id: { in: ids },
        isDeleted: false,
      },
    });

    if (products.length !== ids.length) {
      const foundIds = products.map(p => p.id);
      const missingIds = ids.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Products not found: ${missingIds.join(', ')}`);
    }

    await this.prisma.products.updateMany({
      where: { id: { in: ids } },
      data: { isDeleted: true },
    });
  }

  async bulkUpdateProducts(bulkUpdateDto: BulkUpdateProductsDto): Promise<{ updated: number }> {
    const { productIds, categoryId, isActive, featured, addTags, removeTags } = bulkUpdateDto;

    if (!productIds.length) {
      throw new BadRequestException('No product IDs provided');
    }

    // Check if category exists if updating category
    if (categoryId) {
      const category = await this.prisma.categories.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID '${categoryId}' not found`);
      }
    }

    const updateData: any = {};

    if (categoryId) {
      updateData.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (featured !== undefined) {
      updateData.featured = featured;
    }

    if (addTags || removeTags) {
      // Get current products to update tags
      const products = await this.prisma.products.findMany({
        where: { id: { in: productIds }, isDeleted: false },
        select: { id: true, tags: true },
      });

      for (const product of products) {
        let currentTags = product.tags ? product.tags.split(',').map(t => t.trim()) : [];

        if (addTags) {
          const tagsToAdd = addTags.split(',').map((t: string) => t.trim());
          currentTags = [...new Set([...currentTags, ...tagsToAdd])];
        }

        if (removeTags) {
          const tagsToRemove = removeTags.split(',').map((t: string) => t.trim());
          currentTags = currentTags.filter(tag => !tagsToRemove.includes(tag));
        }

        await this.prisma.products.update({
          where: { id: product.id },
          data: { tags: currentTags.join(', ') },
        });
      }

      return { updated: products.length };
    }

    const result = await this.prisma.products.updateMany({
      where: { id: { in: productIds }, isDeleted: false },
      data: updateData,
    });

    return { updated: result.count };
  }

  async duplicateProduct(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.products.findUnique({
      where: { id, isDeleted: false },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    // Generate new slug
    const baseSlug = this.generateSlug(product.name);
    let newSlug = `${baseSlug}-copy`;
    let counter = 1;

    while (await this.prisma.products.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${baseSlug}-copy-${counter}`;
      counter++;
    }

    // Create duplicate
    const duplicatedProduct = await this.prisma.products.create({
      data: {
        id: randomUUID(),
        name: `${product.name} (Copy)`,
        slug: newSlug,
        description: product.description,
        shortDescription: product.shortDescription,
        priceCents: product.priceCents,
        originalPriceCents: product.originalPriceCents,
        // stockQuantity: product.stockQuantity, // Field does not exist in ProductResponseDto
        sku: product.sku ? `${product.sku}-COPY` : null,
        warranty: product.warranty,
        features: product.features,
        minOrderQuantity: product.minOrderQuantity,
        maxOrderQuantity: product.maxOrderQuantity,
        tags: product.tags,
        categoryId: product.categoryId,
        brand: product.brand,
        model: product.model,
        weight: product.weight,
        dimensions: product.dimensions,
        specifications: product.specifications ? JSON.parse(JSON.stringify(product.specifications)) : null,
        images: product.images ? JSON.parse(JSON.stringify(product.images)) : null,
        isActive: false, // Set as inactive by default
        featured: false,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
        canonicalUrl: product.canonicalUrl,
        updatedAt: new Date(),
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return this.mapToProductResponse(duplicatedProduct);
  }

  async incrementProductView(id: string): Promise<void> {
    const product = await this.prisma.products.findUnique({
      where: { id, isDeleted: false },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    await this.prisma.products.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  async getProductAnalytics(): Promise<ProductAnalyticsDto> {
    const [
      totalProducts,
      activeProducts,
      featuredProducts,
      outOfStockProducts,
      totalViewsResult,
      averagePriceResult,
      productsByCategory,
      topViewedProducts,
      recentProducts,
    ] = await Promise.all([
      this.prisma.products.count({ where: { isDeleted: false } }),
      this.prisma.products.count({ where: { isDeleted: false, isActive: true } }),
      this.prisma.products.count({ where: { isDeleted: false, featured: true } }),
      this.prisma.products.count({ where: { isDeleted: false, stockQuantity: { lte: 0 } } }),
      this.prisma.products.aggregate({
        where: { isDeleted: false },
        _sum: { viewCount: true },
      }),
      this.prisma.products.aggregate({
        where: { isDeleted: false },
        _avg: { priceCents: true },
      }),
      this.prisma.products.groupBy({
        by: ['categoryId'],
        where: { isDeleted: false },
        _count: { id: true },
      }),
      this.prisma.products.findMany({
        where: { isDeleted: false },
        include: {
          categories: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { viewCount: 'desc' },
        take: 10,
      }),
      this.prisma.products.findMany({
        where: { isDeleted: false },
        include: {
          categories: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // Get category names for productsByCategory
    const categoryMap = new Map();
    const categories = await this.prisma.categories.findMany({
      where: {
        id: { in: productsByCategory.map(p => p.categoryId).filter(Boolean) as string[] },
      },
      select: { id: true, name: true },
    });

    categories.forEach(cat => categoryMap.set(cat.id, cat.name));

    const productsByCategoryFormatted: Record<string, number> = {};
    productsByCategory.forEach(item => {
      const categoryName = categoryMap.get(item.categoryId) || 'Unknown';
      productsByCategoryFormatted[categoryName] = item._count.id;
    });

    return {
      totalProducts,
      activeProducts,
      featuredProducts,
      outOfStockProducts,
      totalViews: totalViewsResult._sum.viewCount || 0,
      averagePrice: Math.round(averagePriceResult._avg.priceCents || 0),
      productsByCategory: productsByCategoryFormatted,
      topViewedProducts: topViewedProducts.map(p => this.mapToProductResponse(p)),
      recentProducts: recentProducts.map(p => this.mapToProductResponse(p)),
    };
  }

  async getTopViewedProducts(limit: number = 10): Promise<ProductResponseDto[]> {
    const products = await this.prisma.products.findMany({
      where: { isDeleted: false },
      include: {
        categories: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { viewCount: 'desc' },
      take: Math.min(Math.max(limit, 1), 50),
    });

    return products.map(product => this.mapToProductResponse(product));
  }

  async getRecentProducts(limit: number = 10): Promise<ProductResponseDto[]> {
    const products = await this.prisma.products.findMany({
      where: { isDeleted: false },
      include: {
        categories: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 50),
    });

    return products.map(product => this.mapToProductResponse(product));
  }

  async exportProductsToCsv(): Promise<string> {
    const products = await this.prisma.products.findMany({
      where: { isDeleted: false },
      include: {
        categories: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'ID',
      'Name',
      'Slug',
      'Description',
      'Price (VND)',
      'Original Price (VND)',
      'Stock Quantity',
      'SKU',
      'Category',
      'Brand',
      'Model',
      'Is Active',
      'Featured',
      'Created At',
    ];

    const rows = products.map(product => [
      product.id,
      product.name,
      product.slug,
      product.description || '',
      product.priceCents,
      product.originalPriceCents || '',
      product.stockQuantity,
      product.sku || '',
      product.categories?.name || '',
      product.brand || '',
      product.model || '',
      product.isActive,
      product.featured,
      product.createdAt.toISOString(),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  async importProductsFromCsv(csvData: string): Promise<{ imported: number; errors: string[] }> {
    const lines = csvData.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    let imported = 0;

    if (lines.length < 2) {
      throw new BadRequestException('CSV must contain at least header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCsvLine(lines[i]);
        const productData: any = {};

        headers.forEach((header, index) => {
          const value = values[index]?.replace(/"/g, '').trim();
          switch (header.toLowerCase()) {
            case 'name':
              productData.name = value;
              break;
            case 'slug':
              productData.slug = value;
              break;
            case 'description':
              productData.description = value;
              break;
            case 'price (vnd)':
            case 'price':
              productData.priceCents = parseInt(value);
              break;
            case 'original price (vnd)':
            case 'original price':
              productData.originalPriceCents = value ? parseInt(value) : undefined;
              break;
            case 'stock quantity':
              productData.stockQuantity = parseInt(value) || 0;
              break;
            case 'sku':
              productData.sku = value || undefined;
              break;
            case 'categories':
              // Would need to map category name to ID
              break;
            case 'brand':
              productData.brand = value || undefined;
              break;
            case 'model':
              productData.model = value || undefined;
              break;
            case 'is active':
              productData.isActive = value?.toLowerCase() === 'true';
              break;
            case 'featured':
              productData.featured = value?.toLowerCase() === 'true';
              break;
          }
        });

        if (productData.name && productData.priceCents) {
          // Set default category if not provided
          if (!productData.categoryId) {
            const defaultCategory = await this.prisma.categories.findFirst({
              where: { isActive: true },
            });
            if (defaultCategory) {
              productData.categoryId = defaultCategory.id;
            }
          }

          await this.createProduct(productData as CreateProductDto);
          imported++;
        } else {
          errors.push(`Row ${i + 1}: Missing required fields (name, price)`);
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { imported, errors };
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .substring(0, 100); // Limit length
  }

  private mapToProductResponse(product: any): ProductResponseDto {
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      priceCents: product.priceCents,
      originalPriceCents: product.originalPriceCents,
      images: product.images,
      category: product.categories,
      brand: product.brand,
      model: product.model,
      sku: product.sku,
      specifications: product.specifications,
      features: product.features,
      warranty: product.warranty,
      // stockQuantity: product.stockQuantity, // Field does not exist in ProductResponseDto
      minOrderQuantity: product.minOrderQuantity,
      maxOrderQuantity: product.maxOrderQuantity,
      tags: product.tags,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      metaKeywords: product.metaKeywords,
      canonicalUrl: product.canonicalUrl,
      featured: product.featured,
      isActive: product.isActive,
      viewCount: product.viewCount,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  async checkProductDeletable(id: string): Promise<{ canDelete: boolean; message: string; associatedOrdersCount: number }> {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id, isDeleted: false },
        select: {
          id: true,
          name: true,
          _count: {
            select: { order_items: true }
          }
        }
      });

      if (!product) {
        return { canDelete: false, message: 'Product not found', associatedOrdersCount: 0 };
      }

      const associatedOrdersCount = product._count.order_items;

      if (associatedOrdersCount > 0) {
        return {
          canDelete: false,
          message: `Cannot delete product "${product.name}" because it has ${associatedOrdersCount} associated order(s). Please remove or update the orders first.`,
          associatedOrdersCount
        };
      }

      return {
        canDelete: true,
        message: 'Product can be safely deleted',
        associatedOrdersCount: 0
      };
    } catch (error) {
      console.error('Error checking product deletable status:', error);
      return { canDelete: false, message: 'An error occurred while checking deletion status', associatedOrdersCount: 0 };
    }
  }
}
