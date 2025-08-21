type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
};

async function fetchProduct(slug: string): Promise<Product> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const res = await fetch(`${base}/catalog/products/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải sản phẩm');
  const data = (await res.json()) as Product;
  return data;
}

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
      return {
        title: 'Sản phẩm không tìm thấy',
        description: 'Sản phẩm bạn đang tìm kiếm không tồn tại.',
      };
    }

    const res = await fetch(`${base}/catalog/products/by-slug/${slug}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        title: 'Sản phẩm không tìm thấy',
        description: 'Sản phẩm bạn đang tìm kiếm không tồn tại.',
      };
    }

    const product = await res.json();

    return {
      title: product.name,
      description: product.description || `${product.name} - Sản phẩm audio chất lượng cao tại Audio Tài Lộc`,
      openGraph: {
        title: `${product.name} - Audio Tài Lộc`,
        description: product.description || `${product.name} - Sản phẩm audio chất lượng cao`,
        url: `/products/${slug}`,
        images: product.imageUrl ? [
          {
            url: product.imageUrl,
            width: 800,
            height: 600,
            alt: product.name,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - Audio Tài Lộc`,
        description: product.description || `${product.name} - Sản phẩm audio chất lượng cao`,
        images: product.imageUrl ? [product.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Sản phẩm không tìm thấy',
      description: 'Sản phẩm bạn đang tìm kiếm không tồn tại.',
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const product = await fetchProduct(p.slug);
  async function addToCart(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '');
    const qty = parseInt(String(formData.get('quantity') || '1'), 10) || 1;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const { cookies } = await import('next/headers');
    const c = await cookies();
    const token = c.get('accessToken')?.value;
    await fetch(`${base}/cart/items`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ slug, quantity: qty }),
      cache: 'no-store',
    });
    const { redirect } = await import('next/navigation');
    redirect('/cart');
  }

  // Structured data for product
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageUrl,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "price": product.priceCents / 100,
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Audio Tài Lộc"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "Audio Tài Lộc"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.imageUrl ?? 'https://placehold.co/800x600?text=No+Image'}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description ?? 'Không có mô tả'}
            </p>
          </div>

          <div className="border-t border-b py-4">
            <div className="text-3xl font-bold text-blue-600">
              {(product.priceCents / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </div>
          </div>

          <form action={addToCart} className="space-y-4">
            <input type="hidden" name="slug" value={product.slug} />
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Số lượng:
              </label>
              <Input
                type="number"
                name="quantity"
                id="quantity"
                min={1}
                defaultValue={1}
                className="w-20"
              />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Thêm vào giỏ hàng
            </Button>
          </form>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Thông tin sản phẩm</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Sản phẩm chính hãng</li>
              <li>✓ Bảo hành theo chính sách nhà sản xuất</li>
              <li>✓ Giao hàng toàn quốc</li>
              <li>✓ Hỗ trợ kỹ thuật 24/7</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
