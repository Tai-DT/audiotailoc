import { Metadata } from 'next';
import { apiClient } from '@/lib/api';

interface BlogDetailLayoutProps {
 children: React.ReactNode;
 params: Promise<{
 slug: string;
 }>;
}

export async function generateMetadata({ params }: BlogDetailLayoutProps): Promise<Metadata> {
 const { slug } = await params;

 try {
 const response = await apiClient.get(`/blog/articles/slug/${slug}`);
 const article = response.data;

 if (!article) {
 return {
 title: 'Bài viết không tồn tại | Audio Tài Lộc',
 description: 'Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.',
 };
 }

 // Use SEO fields if available, otherwise fall back to title and excerpt
 const title = article.seoTitle || article.title;
 const description = article.seoDescription || article.excerpt || article.title;
 const keywords = article.seoKeywords ? article.seoKeywords.split(',').map((k: string) => k.trim()) : [];

 const metadata: Metadata = {
 title: `${title} | Audio Tài Lộc`,
 description: description.substring(0, 160), // Limit description length
 keywords: keywords.length > 0 ? keywords : ['âm thanh', 'audio', 'thiết bị âm thanh', 'blog'],
 authors: [{ name: article.author?.name || 'Audio Tài Lộc' }],
 openGraph: {
 title: title,
 description: description.substring(0, 160),
 url: `https://audiotailoc.com/blog-new/${article.slug}`,
 siteName: 'Audio Tài Lộc',
 images: article.imageUrl ? [
 {
 url: article.imageUrl,
 width: 1200,
 height: 630,
 alt: article.title,
 }
 ] : [],
 locale: 'vi_VN',
 type: 'article',
 publishedTime: article.publishedAt || article.createdAt,
 modifiedTime: article.updatedAt,
 authors: [article.author?.name || 'Audio Tài Lộc'],
 tags: keywords,
 },
 twitter: {
 card: 'summary_large_image',
 title: title,
 description: description.substring(0, 160),
 images: article.imageUrl ? [article.imageUrl] : [],
 creator: '@audiotailoc',
 site: '@audiotailoc',
 },
 alternates: {
 canonical: `https://audiotailoc.com/blog-new/${article.slug}`,
 },
 robots: {
 index: article.status === 'PUBLISHED',
 follow: true,
 googleBot: {
 index: article.status === 'PUBLISHED',
 follow: true,
 'max-video-preview': -1,
 'max-image-preview': 'large',
 'max-snippet': -1,
 },
 },
 };

 return metadata;
 } catch (error) {
 console.error('Error generating metadata for blog article:', error);
 return {
 title: 'Bài viết | Audio Tài Lộc',
 description: 'Đọc bài viết từ Audio Tài Lộc - chuyên gia về thiết bị âm thanh.',
 };
 }
}

export default function BlogDetailLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return children;
}