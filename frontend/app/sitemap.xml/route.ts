import { NextResponse } from 'next/server';
import { apiClient, handleApiResponse } from '@/lib/api';
import type { BlogArticle, PaginatedBlogResponse } from '@/lib/types';

interface SitemapEntry {
  url: string;
  priority: number;
  changefreq: string;
  lastmod?: string;
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

interface Product {
  id: string;
  name: string;
  updatedAt: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
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

async function getProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get('/catalog/products', {
      params: { page: 1, limit: 1000, isActive: true }
    });
    const data = handleApiResponse<PaginatedResponse<Product>>(response);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.warn('Products API not available during build, skipping products in sitemap:', error);
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
    console.warn('Services API not available during build, skipping services in sitemap:', error);
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
    console.warn('Projects API not available during build, skipping projects in sitemap:', error);
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
    console.warn('Knowledge base articles API not available during build, skipping articles in sitemap:', error);
    return [];
  }
}

async function getBlogArticles(): Promise<BlogArticle[]> {
  try {
    const response = await apiClient.get('/blog/articles', {
      params: { page: 1, limit: 1000, published: true }
    });
    const data = handleApiResponse<PaginatedBlogResponse<BlogArticle>>(response);
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.warn('Blog articles API not available during build, skipping blog articles in sitemap:', error);
    return [];
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com';

  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1, changefreq: 'daily' },
    { url: `${baseUrl}/products`, priority: 0.9, changefreq: 'daily' },
    { url: `${baseUrl}/services`, priority: 0.9, changefreq: 'weekly' },
    { url: `${baseUrl}/projects`, priority: 0.8, changefreq: 'weekly' },
    { url: `${baseUrl}/about`, priority: 0.7, changefreq: 'monthly' },
    { url: `${baseUrl}/contact`, priority: 0.7, changefreq: 'monthly' },
    { url: `${baseUrl}/blog`, priority: 0.8, changefreq: 'weekly' },
  ];

  // Dynamic pages
  const products = await getProducts();
  const services = await getServices();
  const projects = await getProjects();
  const blogArticles = await getBlogArticles();
  const articles = await getArticles();

  const productPages = Array.isArray(products) ? products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastmod: product.updatedAt,
    priority: 0.8,
    changefreq: 'weekly',
  })) : [];

  const servicePages = Array.isArray(services) ? services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastmod: service.updatedAt,
    priority: 0.8,
    changefreq: 'weekly',
  })) : [];

  const projectPages = Array.isArray(projects) ? projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastmod: project.updatedAt,
    priority: 0.7,
    changefreq: 'monthly',
  })) : [];

  const blogArticlePages = Array.isArray(blogArticles) ? blogArticles.filter((article) => article.status === 'PUBLISHED')
    .map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastmod: article.updatedAt,
      priority: 0.7,
      changefreq: 'weekly',
    })) : [];

  const articlePages = Array.isArray(articles) ? articles.map((article) => ({
    url: `${baseUrl}/blog/${article.id}`,
    lastmod: article.updatedAt,
    priority: 0.6,
    changefreq: 'monthly',
  })) : [];  const allPages: SitemapEntry[] = [
    ...staticPages,
    ...productPages,
    ...servicePages,
    ...projectPages,
    ...blogArticlePages,
    ...articlePages,
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
