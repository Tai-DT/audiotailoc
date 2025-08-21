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
    const res = await fetch(`${base}/catalog/products?pageSize=6`, {
      cache: 'no-store',
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
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
      cache: 'no-store',
      next: { revalidate: 600 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    fetchFeaturedProducts(),
    fetchCategories()
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
                <Link href="/products?featured=true">⭐ Sản phẩm nổi bật</Link>
              </Button>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Giao hàng miễn phí</h3>
              <p className="text-blue-100">Cho đơn hàng từ 500k</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">Bảo hành chính hãng</h3>
              <p className="text-blue-100">12-24 tháng</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-blue-100">Tư vấn chuyên nghiệp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Khám phá những sản phẩm audio được yêu thích nhất tại Audio Tài Lộc
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {featuredProducts.slice(0, 6).map((product: any) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.imageUrl || 'https://placehold.co/400x400?text=Audio+Product'}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">
                    <Link href={`/products/${product.slug}`} className="hover:text-blue-600">
                      {product.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mb-3 line-clamp-2">
                    {product.description || 'Sản phẩm audio chất lượng cao'}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {(product.priceCents / 100).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/products/${product.slug}`}>Xem chi tiết</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/products">Xem tất cả sản phẩm</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Danh mục sản phẩm</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá các danh mục sản phẩm audio đa dạng với chất lượng cao nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Tai nghe', icon: '🎧', description: 'Tai nghe chất lượng cao', href: '/products?category=headphones', color: 'from-blue-500 to-purple-600' },
              { name: 'Loa', icon: '🔊', description: 'Loa công suất cao', href: '/products?category=speakers', color: 'from-green-500 to-blue-600' },
              { name: 'Ampli', icon: '⚡', description: 'Ampli công suất', href: '/products?category=amplifiers', color: 'from-orange-500 to-red-600' },
              { name: 'Microphone', icon: '🎤', description: 'Microphone chuyên nghiệp', href: '/products?category=microphones', color: 'from-purple-500 to-pink-600' },
              { name: 'Phụ kiện', icon: '🔌', description: 'Phụ kiện âm thanh', href: '/products?category=accessories', color: 'from-gray-500 to-gray-700' },
              { name: 'Karaoke', icon: '🎤🎵', description: 'Hệ thống karaoke', href: '/products?category=karaoke', color: 'from-pink-500 to-red-600' }
            ].map((category, index) => (
              <Link key={index} href={category.href} className="group">
                <div className={`bg-gradient-to-r ${category.color} rounded-xl p-8 text-white hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-blue-100 mb-4">{category.description}</p>
                  <div className="flex items-center text-blue-100 group-hover:text-white transition-colors">
                    <span className="font-semibold">Khám phá ngay</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
              <Link href="/categories">Xem tất cả danh mục</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Tại sao chọn Audio Tài Lộc?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chất lượng cao</h3>
              <p className="text-gray-600">Sản phẩm audio chính hãng với chất lượng âm thanh tuyệt vời</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Giao hàng nhanh</h3>
              <p className="text-gray-600">Giao hàng toàn quốc, nhanh chóng và an toàn</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Đội ngũ hỗ trợ khách hàng chuyên nghiệp, sẵn sàng giúp đỡ</p>
            </div>
          </div>
                </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm của Audio Tài Lộc
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Nguyễn Văn A',
                role: 'Nhạc sĩ',
                content: 'Chất lượng âm thanh tuyệt vời! Tôi rất hài lòng với tai nghe studio mà tôi mua tại đây.',
                rating: 5,
                avatar: '👨‍🎤'
              },
              {
                name: 'Trần Thị B',
                role: 'DJ',
                content: 'Hệ thống loa công suất cao thực sự ấn tượng. Âm thanh sống động và chân thực.',
                rating: 5,
                avatar: '👩‍🎧'
              },
              {
                name: 'Lê Văn C',
                role: 'Kỹ sư âm thanh',
                content: 'Dịch vụ tư vấn chuyên nghiệp, sản phẩm chất lượng cao. Tôi sẽ quay lại mua sắm.',
                rating: 5,
                avatar: '👨‍🔧'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng trải nghiệm âm thanh tuyệt vời?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hãy đến với Audio Tài Lộc để được tư vấn và trải nghiệm những sản phẩm âm thanh chất lượng cao nhất.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
              <Link href="/products">🎧 Khám phá sản phẩm</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
              <Link href="/support/contact">💬 Liên hệ tư vấn</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  </>
  );
}


