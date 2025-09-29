import { Metadata } from 'next';
import { apiClient, handleApiResponse } from '@/lib/api';

interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  images?: string[];
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  priceType: string;
  duration: number;
  serviceType?: {
    name: string;
  };
}

async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const response = await apiClient.get(`/services/slug/${slug}`);
    return handleApiResponse<Service>(response);
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Dịch vụ không tìm thấy | Audio Tài Lộc',
      description: 'Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
    };
  }

  const title = service.metaTitle || `${service.name} | Audio Tài Lộc`;
  const description = service.metaDescription || (service.shortDescription || service.description || '').substring(0, 160);
  const keywords = service.metaKeywords || `${service.name}, dịch vụ âm thanh, karaoke, Audio Tài Lộc`;
  const image = Array.isArray(service.images) && service.images.length > 0 ? service.images[0] : '/og-image.jpg';

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
          alt: service.name,
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/services/${slug}`,
    },
  };
}

export default function ServiceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}