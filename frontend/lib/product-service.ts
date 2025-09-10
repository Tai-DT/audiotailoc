import apiClient from './api-client';

export interface Product {
  id: string;
  slug?: string;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  priceCents: number;
  originalPriceCents?: number | null;
  imageUrl?: string | null; // Backward compatibility
  images?: string[]; // Array of image URLs from Cloudinary
  categoryId?: string | null;
  brand?: string | null;
  model?: string | null;
  sku?: string | null;
  specifications?: any;
  features?: string | null;
  warranty?: string | null;
  weight?: number | null;
  dimensions?: string | null;
  stockQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number | null;
  tags?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  featured?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdAt' | 'name' | 'priceCents' | 'price';
  sortOrder?: 'asc' | 'desc';
  categoryId?: string;
  brand?: string;
  featured?: boolean;
  isActive?: boolean;
  inStock?: boolean;
  tags?: string;
}

export interface ProductSearchSuggestion {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  priceCents: number;
}

export class ProductService {
  private static readonly BASE_URL = '/catalog/products';

  /**
   * Lấy danh sách sản phẩm với phân trang và filter
   */
  static async getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
    const response = await apiClient.getProducts({
      page: params.page,
      pageSize: params.pageSize,
      category: params.categoryId,
      search: params.q,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    });
    return response.data;
  }

  /**
   * Lấy sản phẩm theo ID
   */
  static async getProductById(id: string): Promise<Product> {
    // API client hiện tại chưa có getById theo ID, chỉ có theo slug
    // Tạm thời sử dụng apiClient trực tiếp
    const response = await apiClient.get(`/catalog/products/${id}`);
    return response.data;
  }

  /**
   * Lấy sản phẩm theo slug
   */
  static async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.getProduct(slug); // API client sử dụng slug
    return response.data;
  }

  /**
   * Tìm kiếm sản phẩm
   */
  static async searchProducts(query: string, limit?: number): Promise<ProductListResponse> {
    // API client chưa có search riêng, dùng getProducts với search param
    const response = await apiClient.getProducts({
      search: query,
      pageSize: limit || 20,
    });
    return response.data;
  }

  /**
   * Lấy gợi ý tìm kiếm
   */
  static async getSearchSuggestions(query: string, limit?: number): Promise<ProductSearchSuggestion[]> {
    // Tạm thời trả về mảng rỗng vì API client chưa hỗ trợ suggestions
    return [];
  }

  /**
   * Tăng lượt xem sản phẩm
   */
  static async incrementView(id: string): Promise<void> {
    try {
      await apiClient.post(`/catalog/products/${id}/view`);
    } catch (error) {
      // Ignore view increment errors
      console.warn('Failed to increment product view:', error);
    }
  }

  /**
   * Lấy hình ảnh chính của sản phẩm
   */
  static getMainImage(product: Product): string | null {
    // Ưu tiên images array trước, sau đó mới đến imageUrl
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.imageUrl || null;
  }

  /**
   * Lấy tất cả hình ảnh của sản phẩm
   */
  static getAllImages(product: Product): string[] {
    const images: string[] = [];
    
    // Thêm images array nếu có
    if (product.images && Array.isArray(product.images)) {
      images.push(...product.images);
    }
    
    // Thêm imageUrl nếu có và chưa có trong images array
    if (product.imageUrl && !images.includes(product.imageUrl)) {
      images.push(product.imageUrl);
    }
    
    return images;
  }

  /**
   * Kiểm tra xem URL có phải là Cloudinary URL không
   */
  static isCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com');
  }

  /**
  /**
   * Trích xuất public ID từ Cloudinary URL để sử dụng với CldImage
   */
  static extractCloudinaryPublicId(url: string): string | null {
    if (!this.isCloudinaryUrl(url)) {
      return null;
    }

    try {
      // Extract public_id từ Cloudinary URL
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex === -1) return null;

      const publicIdWithFormat = urlParts.slice(uploadIndex + 1).join('/');
      const publicId = publicIdWithFormat.replace(/\.[^.]+$/, ''); // Remove extension
      return publicId;
    } catch (error) {
      console.error('Error extracting Cloudinary public ID:', error);
      return null;
    }
  }

  /**
   * Tạo URL tối ưu cho hình ảnh Cloudinary
   */
  static getOptimizedImageUrl(
    url: string, 
    options: {
      width?: number;
      height?: number;
      quality?: number | 'auto';
      format?: 'auto' | 'webp' | 'jpg' | 'png';
    } = {}
  ): string {
    if (!this.isCloudinaryUrl(url)) {
      return url; // Trả về URL gốc nếu không phải Cloudinary
    }

    try {
      // Extract public_id từ Cloudinary URL
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex === -1) return url;

      const publicIdWithFormat = urlParts.slice(uploadIndex + 1).join('/');
      const publicId = publicIdWithFormat.replace(/\.[^.]+$/, ''); // Remove extension

      // Build transformation string
      const transformations: string[] = [];
      if (options.width) transformations.push(`w_${options.width}`);
      if (options.height) transformations.push(`h_${options.height}`);
      if (options.quality) transformations.push(`q_${options.quality}`);
      if (options.format) transformations.push(`f_${options.format}`);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) return url;

      const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';
      return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
    } catch (error) {
      console.error('Error optimizing Cloudinary URL:', error);
      return url; // Fallback to original URL
    }
  }

  /**
   * Format giá từ cents sang VND
   */
  static formatPrice(priceCents: number): string {
    const price = priceCents / 100;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Kiểm tra sản phẩm có trong kho không
   */
  static isInStock(product: Product): boolean {
    return (product.stockQuantity ?? 0) > 0;
  }

  /**
   * Kiểm tra sản phẩm có đang sale không
   */
  static isOnSale(product: Product): boolean {
    return (
      product.originalPriceCents &&
      product.originalPriceCents > product.priceCents
    );
  }

  /**
   * Tính % giảm giá
   */
  static getDiscountPercentage(product: Product): number | null {
    if (!this.isOnSale(product) || !product.originalPriceCents) {
      return null;
    }
    
    const discount = product.originalPriceCents - product.priceCents;
    return Math.round((discount / product.originalPriceCents) * 100);
  }
}
