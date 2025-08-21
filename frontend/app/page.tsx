import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description: 'Khám phá bộ sưu tập audio chất lượng cao tại Audio Tài Lộc. Tai nghe, loa, ampli và phụ kiện âm thanh chính hãng với giá tốt nhất.',
  openGraph: {
    title: 'Audio Tài Lộc - Trang chủ',
    description: 'Khám phá bộ sưu tập audio chất lượng cao tại Audio Tài Lộc.',
    url: '/',
  },
};

// Fetch featured products
async function fetchFeaturedProducts() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return [];

    const response = await fetch(`${base}/catalog/products?featured=true&pageSize=6`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch {
    return [];
  }
}

// Fetch categories
async function fetchCategories() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return [];

    const res = await fetch(`${base}/catalog/categories`, {
      next: { revalidate: 600 }
    });

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
}

// Fetch featured services
async function fetchFeaturedServices() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return [];

    const response = await fetch(`${base}/services?isActive=true&pageSize=3`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch {
    return [];
  }
}

// Fetch featured projects
async function fetchFeaturedProjects() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return [];

    const response = await fetch(`${base}/projects?featured=true`, {
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories, featuredServices, featuredProjects] = await Promise.all([
    fetchFeaturedProducts(),
    fetchCategories(),
    fetchFeaturedServices(),
    fetchFeaturedProjects()
  ]);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Audio Tài Lộc",
    "description": "Cửa hàng audio chuyên nghiệp với các sản phẩm chất lượng cao",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.png`,
    "sameAs": [
      "https://facebook.com/audiotailoc",
      "https://instagram.com/audiotailoc"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Sản phẩm Audio",
      "itemListElement": featuredProducts.slice(0, 3).map((product: any) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": product.imageUrl,
          "offers": {
            "@type": "Offer",
            "price": product.priceCents / 100,
            "priceCurrency": "VND",
            "availability": "https://schema.org/InStock"
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32 text-center">
          <div className="mb-8">
            <div className="text-8xl mb-6">🎵</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Audio Tài Lộc
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Nâng tầm trải nghiệm âm thanh của bạn với những sản phẩm audio chất lượng cao
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto text-lg px-8 py-4">
                <Link href="/products">🎧 Khám phá sản phẩm</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto text-lg px-8 py-4">
                <Link href="/services">🔧 Dịch vụ chuyên nghiệp</Link>
              </Button>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-lg font-semibold mb-2">Giao hàng nhanh</h3>
              <p className="text-sm opacity-90">Giao hàng toàn quốc trong 24-48h</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Bảo hành chính hãng</h3>
              <p className="text-sm opacity-90">Bảo hành từ 12-24 tháng</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-sm opacity-90">Tư vấn và hỗ trợ mọi lúc</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Danh mục sản phẩm</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá các danh mục sản phẩm đa dạng với chất lượng cao
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category: any) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {category.icon || '📂'}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.productCount || 0} sản phẩm
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/categories">Xem tất cả danh mục</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những sản phẩm được yêu thích nhất với chất lượng và giá cả tốt nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product: any) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.imageUrl || 'https://placehold.co/400x300?text=Product'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(product.priceCents)}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/products/${product.slug}`}>Xem chi tiết</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/products">Xem tất cả sản phẩm</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {featuredServices.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Dịch vụ chuyên nghiệp</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Đội ngũ kỹ thuật viên giàu kinh nghiệm với các dịch vụ âm thanh chất lượng cao
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredServices.map((service: any) => (
                <Card key={service.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-4xl mb-4">🔧</div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(service.basePriceCents)}
                      </span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/booking?service=${service.id}`}>Đặt lịch ngay</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/services">Xem tất cả dịch vụ</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Dự án đã hoàn thành</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Khám phá các dự án âm thanh chuyên nghiệp mà chúng tôi đã thực hiện
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project: any) => (
                <Card key={project.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  {project.images && project.images.length > 0 && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.images[0]}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </CardTitle>
                    {project.description && (
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/projects/${project.slug}`}>Xem chi tiết</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/projects">Xem tất cả dự án</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại sao chọn Audio Tài Lộc?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm âm thanh tốt nhất cho khách hàng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Chất lượng hàng đầu</h3>
              <p className="text-blue-100">Sản phẩm chính hãng với chất lượng được kiểm định</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">👨‍🔧</div>
              <h3 className="text-xl font-semibold mb-2">Kỹ thuật viên chuyên nghiệp</h3>
              <p className="text-blue-100">Đội ngũ kỹ thuật viên giàu kinh nghiệm</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Giá cả hợp lý</h3>
              <p className="text-blue-100">Cam kết giá tốt nhất thị trường</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Dịch vụ tận tâm</h3>
              <p className="text-blue-100">Hỗ trợ khách hàng 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng nâng tầm âm thanh?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/contact">Liên hệ ngay</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/booking">Đặt lịch tư vấn</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}


