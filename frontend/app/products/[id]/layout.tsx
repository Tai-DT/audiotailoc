import { Metadata } from 'next';
import { apiClient, API_ENDPOINTS, handleApiResponse } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  images?: string[];
  imageUrl?: string;
  priceCents: number;
  category?: {
    name: string;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return handleApiResponse<Product>(response);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Sản phẩm không tìm thấy | Audio Tài Lộc',
      description: 'Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
    };
  }

  const title = product.metaTitle || `${product.name} | Audio Tài Lộc`;
  const description = product.metaDescription || (product.shortDescription || product.description || '').substring(0, 160);
  const keywords = product.metaKeywords || `${product.name}, âm thanh, karaoke, Audio Tài Lộc`;
  const image = product.images?.[0] || product.imageUrl || '/og-image.jpg';

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
          alt: product.name,
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/products/${id}`,
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}