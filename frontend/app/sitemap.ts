import { MetadataRoute } from 'next';
import { apiClient, handleApiResponse } from '@/lib/api';
import type { BlogArticle, PaginatedBlogResponse } from '@/lib/types';

// Make sitemap dynamic to allow API calls
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

interface Product {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  updatedAt?: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  updatedAt: string;
}

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  updatedAt: string;
  published: boolean;
}

interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get('/catalog/products', {
      params: { page: 1, limit: 1000, isActive: true }
    });
    const data = handleApiResponse<PaginatedResponse<Product>>(response);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
    return [];
  }
}

async function getServices(): Promise<Service[]> {
  try {
    const response = await apiClient.get('/services', {
      params: { page: 1, limit: 1000, isActive: true }
    });
    const data = handleApiResponse<PaginatedResponse<Service>>(response);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.error('Failed to fetch services for sitemap:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get('/catalog/categories');
    const data = handleApiResponse<Category[]>(response);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch categories for sitemap:', error);
    return [];
  }
}

async function getProjects(): Promise<Project[]> {
  try {
    const response = await apiClient.get('/projects', {
      params: { page: 1, limit: 1000, isPublished: true }
    });
    const data = handleApiResponse<PaginatedResponse<Project>>(response);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.error('Failed to fetch projects for sitemap:', error);
    return [];
  }
}

async function getArticles(): Promise<KnowledgeBaseArticle[]> {
  try {
    const response = await apiClient.get('/support/kb/articles', {
      params: { page: 1, limit: 1000, published: true }
    });
    const data = handleApiResponse<PaginatedResponse<KnowledgeBaseArticle>>(response);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.error('Failed to fetch articles for sitemap:', error);
    return [];
  }
}

async function getBlogArticles(): Promise<BlogArticle[]> {
  try {
    // Use dashboard URL if available, otherwise skip
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || process.env.DASHBOARD_URL;
    
    if (!dashboardUrl) {
      console.warn('No dashboard URL configured, skipping blog sitemap entries');
      return [];
    }

    const response = await fetch(`${dashboardUrl}/api/blog/articles?page=1&limit=1000&published=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`Blog articles API returned ${response.status}, skipping blog sitemap entries`);
      return [];
    }

    const data = await response.json() as PaginatedBlogResponse<BlogArticle>;
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch blog articles for sitemap:', error);
    // Return empty array to allow sitemap generation to continue
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/du-an`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic product pages
  const products = await getProducts();
  const productPages = products.map((product) => ({
  url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic service pages
  const services = await getServices();
  const servicePages = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic category pages
  const categories = await getCategories();
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/danh-muc/${category.slug}`,
    lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic project pages
  const projects = await getProjects();
  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/du-an/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic blog article pages (new blog system)
  const blogArticles = await getBlogArticles();
  const blogArticlePages = blogArticles
    .filter((article) => article.status === 'PUBLISHED')
    .map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic knowledge base article pages
  const articles = await getArticles();
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.id}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...servicePages,
    ...categoryPages,
    ...projectPages,
    ...blogArticlePages,
    ...articlePages,
  ];
}
