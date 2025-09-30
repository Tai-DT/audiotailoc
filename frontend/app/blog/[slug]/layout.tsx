import { Metadata } from 'next';
import { apiClient, handleApiResponse } from '@/lib/api';
import type { BlogArticle } from '@/lib/types';

async function getArticle(slug: string): Promise<BlogArticle | null> {
  try {
    const response = await apiClient.get(`/blog/articles/slug/${slug}`);
    return handleApiResponse<BlogArticle>(response);
  } catch (error) {
    console.error('Failed to fetch blog article metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Bài viết không tìm thấy | Audio Tài Lộc',
      description: 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com';
  const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/blog/${article.slug}`;
  const description = (article.seoDescription || article.excerpt || article.content)
    .replace(/<[^>]*>/g, '')
    .substring(0, 160)
    .trim();

  const keywords = article.seoKeywords
    ? article.seoKeywords.split(',').map((keyword) => keyword.trim()).filter(Boolean)
    : [];

  return {
    title: article.seoTitle || `${article.title} | Audio Tài Lộc`,
    description: description || `Đọc bài viết: ${article.title}`,
    keywords,
    authors: [{ name: article.author?.name || 'Audio Tài Lộc' }],
    openGraph: {
      title: article.seoTitle || article.title,
      description: description || `Đọc bài viết: ${article.title}`,
      type: 'article',
      url: canonicalUrl,
      publishedTime: article.publishedAt ?? article.createdAt,
      modifiedTime: article.updatedAt,
      authors: [article.author?.name || 'Audio Tài Lộc'],
      tags: keywords,
      section: article.category?.name,
      images: article.imageUrl
        ? [{ url: article.imageUrl, width: 1200, height: 630, alt: article.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle || article.title,
      description: description || `Đọc bài viết: ${article.title}`,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'article:author': article.author?.name || 'Audio Tài Lộc',
      'article:section': article.category?.name || '',
      'article:tag': keywords.join(','),
      'article:published_time': article.publishedAt ?? article.createdAt,
      'article:modified_time': article.updatedAt,
    },
  };
}

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
