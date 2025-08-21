import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import ProductCard from '../../components/ProductCard';

type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  images?: string[];
  categoryId?: string;
  inStock?: boolean;
  featured?: boolean;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
};

async function fetchProduct(slug: string): Promise<Product> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  
  const res = await fetch(`${base}/catalog/products/${slug}`, {
    next: { revalidate: 300 }
  });
  
  if (!res.ok) {
    throw new Error('Product not found');
  }
  
  return res.json();
}

async function fetchRelatedProducts(categoryId?: string, excludeSlug?: string): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return [];
  
  try {
    const url = new URL(`${base}/catalog/products`);
    url.searchParams.set('pageSize', '4');
    if (categoryId) url.searchParams.set('categoryId', categoryId);
    
    const res = await fetch(url.toString(), {
      next: { revalidate: 300 }
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.items?.filter((product: Product) => product.slug !== excludeSlug) || [];
  } catch {
    return [];
  }
}

async function fetchCategory(categoryId?: string): Promise<Category | null> {
  if (!categoryId) return null;
  
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return null;
  
  try {
    const res = await fetch(`${base}/catalog/categories/${categoryId}`, {
      next: { revalidate: 600 }
    });
    
    if (!res.ok) return null;
    
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product: Product;
  let category: Category | null = null;
  let relatedProducts: Product[] = [];

  try {
    product = await fetchProduct(params.slug);
    category = await fetchCategory(product.categoryId);
    relatedProducts = await fetchRelatedProducts(product.categoryId, params.slug);
  } catch (error) {
    notFound();
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageUrl,
    "offers": {
      "@type": "Offer",
      "price": product.priceCents / 100,
      "priceCurrency": "VND",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "category": category?.name,
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Sản phẩm</Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/categories/${category.slug}`} className="hover:text-blue-600">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Không có hình ảnh</span>
                </div>
              )}
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500">
                  Nổi bật
                </Badge>
              )}
            </div>
            
            {/* Additional Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square relative overflow-hidden rounded border">
                    <Image
                      src={image}
                      alt={`${product.name} - Hình ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {category && (
                <Link href={`/categories/${category.slug}`} className="text-blue-600 hover:underline">
                  {category.name}
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(product.priceCents)}
              </span>
              {product.inStock !== undefined && (
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                </Badge>
              )}
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="space-y-4">
              <Button size="lg" className="w-full" disabled={!product.inStock}>
                {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="lg">
                  ❤️ Yêu thích
                </Button>
                <Button variant="outline" size="lg">
                  📞 Tư vấn
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã sản phẩm:</span>
                  <span className="font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-medium">{category?.name || 'Chưa phân loại'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lượt xem:</span>
                  <span className="font-medium">{product.viewCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đăng:</span>
                  <span className="font-medium">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500 py-8">
                <p>Chưa có đánh giá nào cho sản phẩm này</p>
                <Button variant="outline" className="mt-4">
                  Viết đánh giá đầu tiên
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
