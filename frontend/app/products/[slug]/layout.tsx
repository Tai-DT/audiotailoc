import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { api } from '@/lib/api-client';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.products.getById(slug);
    const product = res?.data;

    const title = product?.name ? `${product.name} | Audio Tài Lộc` : 'Sản phẩm | Audio Tài Lộc';
    const description = product?.description
      ? String(product.description).slice(0, 160)
      : 'Khám phá thiết bị âm thanh chất lượng cao tại Audio Tài Lộc.';

    const image = (product?.images && product.images[0]) || product?.imageUrl || '/images/product-og.jpg';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: product?.name || 'Product image',
          },
        ],
      },
      alternates: {
        canonical: `/products/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Sản phẩm | Audio Tài Lộc',
      description: 'Khám phá thiết bị âm thanh chất lượng cao tại Audio Tài Lộc.',
    };
  }
}

export default function ProductSlugLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
