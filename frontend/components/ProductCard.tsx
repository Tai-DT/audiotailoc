import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    priceCents: number;
    imageUrl?: string;
  };
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(priceCents / 100);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow group">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={product.imageUrl || 'https://placehold.co/400x300?text=Audio+Product'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.priceCents)}
          </span>
          <Button asChild size="sm">
            <Link href={`/products/${product.slug}`}>Xem chi tiết</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}