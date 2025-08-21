"use client";

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  categoryId?: string;
  inStock?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const {
    slug,
    name,
    description,
    priceCents,
    imageUrl,
    inStock,
    featured,
  } = product;

  return (
    <div className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link href={`/products/${slug}`} aria-label={name}>
        <div className="aspect-square relative overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            // Keep an <img> with alt text so tests can find it even when image is missing
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={name}
              src="https://placehold.co/600x600?text=No+Image"
              className="w-full h-full object-cover"
            />
          )}
          {featured ? (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Nổi bật
            </span>
          ) : null}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          <Link href={`/products/${slug}`} className="hover:text-blue-600 transition-colors">
            {name}
          </Link>
        </h3>
        {description ? (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        ) : null}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(priceCents)}
          </span>
          {inStock === undefined ? null : (
            <span className={`text-xs px-2 py-1 rounded ${inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {inStock ? 'Còn hàng' : 'Hết hàng'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


