import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Danh mục sản phẩm | Audio Tài Lộc',
  description: 'Khám phá các danh mục sản phẩm audio đa dạng tại Audio Tài Lộc: Tai nghe, Loa, Ampli, Microphone, Phụ kiện và Hệ thống Karaoke.',
};

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
  image: string;
  features: string[];
}

const categories: Category[] = [
  {
    id: 'headphones',
    name: 'Tai nghe',
    slug: 'headphones',
    icon: '🎧',
    description: 'Tai nghe chất lượng cao với công nghệ âm thanh tiên tiến',
    productCount: 150,
    image: '/images/categories/headphones.jpg',
    features: ['Tai nghe có dây', 'Tai nghe không dây', 'Tai nghe gaming', 'Tai nghe studio']
  },
  {
    id: 'speakers',
    name: 'Loa',
    slug: 'speakers',
    icon: '🔊',
    description: 'Loa công suất cao cho trải nghiệm âm thanh sống động',
    productCount: 200,
    image: '/images/categories/speakers.jpg',
    features: ['Loa bookshelf', 'Loa floorstanding', 'Loa subwoofer', 'Loa portable']
  },
  {
    id: 'amplifiers',
    name: 'Ampli',
    slug: 'amplifiers',
    icon: '⚡',
    description: 'Ampli công suất chuyên nghiệp cho hệ thống âm thanh',
    productCount: 80,
    image: '/images/categories/amplifiers.jpg',
    features: ['Ampli tích hợp', 'Ampli công suất', 'Ampli tube', 'Ampli class D']
  },
  {
    id: 'microphones',
    name: 'Microphone',
    slug: 'microphones',
    icon: '🎤',
    description: 'Microphone chuyên nghiệp cho thu âm và biểu diễn',
    productCount: 120,
    image: '/images/categories/microphones.jpg',
    features: ['Microphone condenser', 'Microphone dynamic', 'Microphone USB', 'Microphone wireless']
  },
  {
    id: 'accessories',
    name: 'Phụ kiện',
    slug: 'accessories',
    icon: '🔌',
    description: 'Phụ kiện âm thanh chất lượng cao',
    productCount: 300,
    image: '/images/categories/accessories.jpg',
    features: ['Cáp âm thanh', 'Adapter', 'Stand', 'Case bảo vệ']
  },
  {
    id: 'karaoke',
    name: 'Karaoke',
    slug: 'karaoke',
    icon: '🎤🎵',
    description: 'Hệ thống karaoke chuyên nghiệp cho gia đình và kinh doanh',
    productCount: 50,
    image: '/images/categories/karaoke.jpg',
    features: ['Bộ karaoke gia đình', 'Hệ thống karaoke kinh doanh', 'Microphone karaoke', 'Mixer karaoke']
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Danh mục sản phẩm</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Khám phá các danh mục sản phẩm audio đa dạng với chất lượng cao nhất
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {category.productCount} sản phẩm
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-blue-100">{category.description}</p>
                </div>

                {/* Category Features */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Sản phẩm chính:</h4>
                  <div className="space-y-2">
                    {category.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                    >
                      Xem tất cả sản phẩm
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Danh mục nổi bật</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Headphones */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="text-6xl mr-4">🎧</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Tai nghe cao cấp</h3>
                  <p className="text-gray-600">Trải nghiệm âm thanh tuyệt vời</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Bộ sưu tập tai nghe chất lượng cao với công nghệ âm thanh tiên tiến, 
                phù hợp cho mọi nhu cầu từ nghe nhạc đến gaming chuyên nghiệp.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/products?category=headphones&featured=true"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Xem sản phẩm nổi bật
                </Link>
                <Link
                  href="/products?category=headphones"
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>

            {/* Speakers */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="text-6xl mr-4">🔊</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Hệ thống loa</h3>
                  <p className="text-gray-600">Âm thanh sống động</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Hệ thống loa công suất cao với thiết kế hiện đại, 
                mang đến trải nghiệm âm thanh sống động và chân thực.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/products?category=speakers&featured=true"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Xem sản phẩm nổi bật
                </Link>
                <Link
                  href="/products?category=speakers"
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Không tìm thấy danh mục phù hợp?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Đội ngũ tư vấn chuyên nghiệp của chúng tôi sẵn sàng hỗ trợ bạn tìm kiếm 
            sản phẩm phù hợp nhất với nhu cầu và ngân sách.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/support/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Liên hệ tư vấn
            </Link>
            <Link
              href="/products"
              className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

