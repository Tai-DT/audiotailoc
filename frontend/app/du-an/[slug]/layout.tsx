import { Metadata } from 'next';
import { apiClient, handleApiResponse } from '@/lib/api';

interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  images?: string[];
  thumbnailUrl?: string;
  clientName?: string;
  completionDate?: string;
  isFeatured: boolean;
  viewCount: number;
  technologies?: string[];
  category?: {
    name: string;
  };
}

async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await apiClient.get(`/projects/by-slug/${slug}`);
    return handleApiResponse<Project>(response);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Dự án không tìm thấy | Audio Tài Lộc',
      description: 'Dự án bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
    };
  }

  const title = project.metaTitle || `${project.title} | Audio Tài Lộc`;
  const description = project.metaDescription || (project.shortDescription || project.description || '').substring(0, 160);
  const keywords = project.metaKeywords || `${project.title}, dự án âm thanh, karaoke, Audio Tài Lộc`;
  const image = project.images?.[0] || project.thumbnailUrl || '/og-image.jpg';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/projects/${slug}`,
    },
  };
}

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}