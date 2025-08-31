import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
};

async function fetchCategories(): Promise<Category[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return [];
  
  try {
    const res = await fetch(`${base}/catalog/categories`, {
      next: { revalidate: 600 }
    });
    
    if (!res.ok) return [];
    
    return res.json();
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Danh mục sản phẩm Audio Tài Lộc",
    "description": "Tất cả danh mục sản phẩm audio chất lượng cao",
    "itemListElement": categories.map((category, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Category",
        "name": category.name,
        "description": category.description,
        "url": `/categories/${category.slug}`
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Danh mục sản phẩm
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các danh mục sản phẩm audio chất lượng cao tại Audio Tài Lộc
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-shadow">
              <Link href={`/categories/${category.slug}`} legacyBehavior>
                <CardHeader className="pb-4">
                  <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-4xl text-white">🎵</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {category.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {category._count?.products || 0} sản phẩm
                    </Badge>
                    <span className="text-blue-600 group-hover:text-blue-800 transition-colors">
                      Xem tất cả →
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Chưa có danh mục nào
            </h2>
            <p className="text-gray-600 mb-6">
              Các danh mục sản phẩm sẽ được hiển thị ở đây
            </p>
            <Link href="/products" legacyBehavior>
              <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Xem tất cả sản phẩm
              </span>
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Không tìm thấy danh mục phù hợp?
            </h2>
            <p className="text-blue-100 mb-6">
              Liên hệ với chúng tôi để được tư vấn về sản phẩm phù hợp với nhu cầu của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support" legacyBehavior>
                <span className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors">
                  💬 Tư vấn miễn phí
                </span>
              </Link>
              <Link href="/products" legacyBehavior>
                <span className="inline-flex items-center px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-blue-600 transition-colors">
                  🛍️ Xem tất cả sản phẩm
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

