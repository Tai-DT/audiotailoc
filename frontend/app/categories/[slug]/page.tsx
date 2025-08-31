import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '../../components/ProductCard';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
};

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

type ProductsResponse = {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

async function fetchCategory(slug: string): Promise<Category> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  
  const res = await fetch(`${base}/catalog/categories/${slug}`, {
    next: { revalidate: 600 }
  });
  
  if (!res.ok) {
    throw new Error('Category not found');
  }
  
  return res.json();
}

async function fetchCategoryProducts(
  categoryId: string,
  page: number = 1,
  pageSize: number = 12
): Promise<ProductsResponse> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  
  const url = new URL(`${base}/catalog/products`);
  url.searchParams.set('categoryId', categoryId);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('pageSize', pageSize.toString());
  
  const res = await fetch(url.toString(), {
    next: { revalidate: 300 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return res.json();
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  let category: Category;
  let productsResponse: ProductsResponse;

  try {
    category = await fetchCategory(slug);
    const page = parseInt(searchParamsResolved.page || '1', 10);
    productsResponse = await fetchCategoryProducts(category.id, page, 12);
  } catch (error) {
    notFound();
  }

  const { items: products, totalCount, page, pageSize, totalPages } = productsResponse;

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} - Audio Tài Lộc`,
    "description": category.description || `Sản phẩm ${category.name} chất lượng cao`,
    "url": `/categories/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": product.imageUrl,
          "url": `/products/${product.slug}`,
          "offers": {
            "@type": "Offer",
            "price": product.priceCents / 100,
            "priceCurrency": "VND",
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        }
      }))
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
          <Link href="/categories" className="hover:text-blue-600">Danh mục</Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
              {category.description && (
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  {category.description}
                </p>
              )}
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {totalCount} sản phẩm
                </Badge>
                <span className="text-gray-500">
                  Trang {page} / {totalPages}
                </span>
              </div>
            </div>
            
            {category.imageUrl && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bộ lọc và sắp xếp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Sắp xếp:</label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    defaultValue={searchParamsResolved.sort || 'newest'}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="name_asc">Tên A-Z</option>
                    <option value="name_desc">Tên Z-A</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Giá:</label>
                  <input
                    type="number"
                    placeholder="Từ"
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm w-24"
                    defaultValue={searchParamsResolved.minPrice}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm w-24"
                    defaultValue={searchParamsResolved.maxPrice}
                  />
                  <Button size="sm">Lọc</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  {page > 1 && (
                    <Link href={`/categories/${category.slug}?page=${page - 1}`} legacyBehavior>
                      <Button variant="outline" size="sm">
                        ← Trước
                      </Button>
                    </Link>
                  )}
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/categories/${category.slug}?page=${pageNum}`}
                      legacyBehavior>
                      <Button 
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  ))}
                  
                  {page < totalPages && (
                    <Link href={`/categories/${category.slug}?page=${page + 1}`} legacyBehavior>
                      <Button variant="outline" size="sm">
                        Sau →
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Chưa có sản phẩm nào trong danh mục này
            </h2>
            <p className="text-gray-600 mb-6">
              Chúng tôi sẽ cập nhật sản phẩm mới sớm nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" legacyBehavior>
                <Button>
                  Xem tất cả sản phẩm
                </Button>
              </Link>
              <Link href="/support" legacyBehavior>
                <Button variant="outline">
                  Liên hệ tư vấn
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Cần tư vấn về sản phẩm {category.name}?
              </h2>
              <p className="text-blue-100 mb-6">
                Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn sản phẩm phù hợp nhất
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/support" legacyBehavior>
                  <Button variant="secondary" size="lg">
                    💬 Tư vấn miễn phí
                  </Button>
                </Link>
                <Link href="/products" legacyBehavior>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                    🛍️ Xem tất cả sản phẩm
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
