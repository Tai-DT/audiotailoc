import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Giới thiệu | Audio Tài Lộc',
  description: 'Tìm hiểu về Audio Tài Lộc - Cửa hàng audio chuyên nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực âm thanh.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Về Audio Tài Lộc</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Hơn 10 năm kinh nghiệm trong lĩnh vực âm thanh, chúng tôi tự hào mang đến những sản phẩm chất lượng cao nhất
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Audio Tài Lộc được thành lập vào năm 2013 với tình yêu và đam mê vô tận dành cho âm thanh. 
                  Từ một cửa hàng nhỏ tại Hà Nội, chúng tôi đã phát triển thành một trong những địa chỉ tin cậy 
                  hàng đầu trong lĩnh vực audio tại Việt Nam.
                </p>
                <p>
                  Với đội ngũ kỹ thuật viên giàu kinh nghiệm và tâm huyết, chúng tôi không chỉ cung cấp sản phẩm 
                  chất lượng mà còn mang đến dịch vụ tư vấn chuyên nghiệp, giúp khách hàng tìm được giải pháp âm thanh 
                  phù hợp nhất.
                </p>
                <p>
                  Chúng tôi tin rằng âm thanh không chỉ là âm thanh, mà là cảm xúc, là nghệ thuật, là cuộc sống. 
                  Đó là lý do tại sao chúng tôi luôn nỗ lực mang đến những trải nghiệm âm thanh tuyệt vời nhất.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-2xl font-bold mb-4">Sứ mệnh của chúng tôi</h3>
                <p className="text-lg leading-relaxed">
                  "Nâng tầm trải nghiệm âm thanh của mọi người, mang đến những sản phẩm chất lượng cao 
                  với giá cả hợp lý và dịch vụ chuyên nghiệp."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chất lượng</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết chỉ cung cấp những sản phẩm chất lượng cao nhất, 
                được kiểm định nghiêm ngặt trước khi đến tay khách hàng.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Uy tín</h3>
              <p className="text-gray-600">
                Xây dựng niềm tin với khách hàng thông qua dịch vụ chuyên nghiệp, 
                minh bạch và tận tâm trong mọi giao dịch.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sáng tạo</h3>
              <p className="text-gray-600">
                Luôn cập nhật xu hướng công nghệ mới nhất, mang đến những giải pháp 
                âm thanh hiện đại và sáng tạo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Đội ngũ của chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👨‍💼
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nguyễn Văn A</h3>
              <p className="text-gray-600">Giám đốc điều hành</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👨‍🔧
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trần Văn B</h3>
              <p className="text-gray-600">Kỹ thuật viên trưởng</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👩‍💼
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lê Thị C</h3>
              <p className="text-gray-600">Quản lý kinh doanh</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👨‍💻
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phạm Văn D</h3>
              <p className="text-gray-600">Chuyên viên tư vấn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <p className="text-lg">Năm kinh nghiệm</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="text-lg">Khách hàng hài lòng</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <p className="text-lg">Sản phẩm đa dạng</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-lg">Hỗ trợ khách hàng</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sẵn sàng trải nghiệm âm thanh tuyệt vời?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Hãy đến với Audio Tài Lộc để được tư vấn và trải nghiệm những sản phẩm âm thanh chất lượng cao nhất.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Khám phá sản phẩm
            </Link>
            <Link 
              href="/support/contact" 
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

