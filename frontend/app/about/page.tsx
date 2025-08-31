import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Về Audio Tài Lộc
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Chúng tôi là cửa hàng audio chuyên nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực âm thanh, 
          cam kết mang đến những sản phẩm chất lượng cao nhất cho khách hàng.
        </p>
      </div>
      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎯</span>
              <span>Sứ mệnh</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              Mang đến trải nghiệm âm thanh tuyệt vời cho mọi khách hàng thông qua các sản phẩm chất lượng cao, 
              dịch vụ tư vấn chuyên nghiệp và hỗ trợ kỹ thuật tận tâm.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>👁️</span>
              <span>Tầm nhìn</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              Trở thành cửa hàng audio hàng đầu Việt Nam, được tin tưởng và lựa chọn bởi đông đảo khách hàng 
              yêu âm thanh và công nghệ.
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Company Story */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Câu chuyện của chúng tôi</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Audio Tài Lộc được thành lập vào năm 2014 với tình yêu và đam mê âm thanh. 
              Từ một cửa hàng nhỏ tại TP. Hồ Chí Minh, chúng tôi đã phát triển thành một trong những 
              cửa hàng audio uy tín nhất Việt Nam.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Với đội ngũ nhân viên giàu kinh nghiệm và am hiểu sâu sắc về âm thanh, 
              chúng tôi cam kết mang đến những sản phẩm chính hãng với chất lượng tốt nhất 
              và dịch vụ tư vấn chuyên nghiệp.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Hơn 10 năm qua, chúng tôi đã phục vụ hàng nghìn khách hàng và nhận được sự tin tưởng 
              từ cộng đồng yêu âm thanh Việt Nam.
            </p>
          </div>
          <div className="relative h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold mb-2">10+ Năm Kinh Nghiệm</h3>
              <p className="text-blue-100">Phục vụ cộng đồng âm thanh Việt Nam</p>
            </div>
          </div>
        </div>
      </div>
      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Chất lượng</h3>
              <p className="text-gray-600">
                Chỉ cung cấp những sản phẩm chính hãng với chất lượng tốt nhất
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Tận tâm</h3>
              <p className="text-gray-600">
                Dịch vụ khách hàng tận tâm, tư vấn chuyên nghiệp
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">Sáng tạo</h3>
              <p className="text-gray-600">
                Luôn cập nhật công nghệ mới và giải pháp âm thanh tiên tiến
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Đội ngũ của chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                NT
              </div>
              <h3 className="text-xl font-semibold mb-1">Nguyễn Văn Tài</h3>
              <p className="text-blue-600 mb-2">Giám đốc điều hành</p>
              <p className="text-gray-600 text-sm">
                Chuyên gia âm thanh với 15 năm kinh nghiệm trong lĩnh vực audio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                TL
              </div>
              <h3 className="text-xl font-semibold mb-1">Trần Thị Lộc</h3>
              <p className="text-blue-600 mb-2">Quản lý kinh doanh</p>
              <p className="text-gray-600 text-sm">
                Chuyên viên tư vấn với kiến thức sâu rộng về sản phẩm audio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                KT
              </div>
              <h3 className="text-xl font-semibold mb-1">Lê Văn Kỹ Thuật</h3>
              <p className="text-blue-600 mb-2">Kỹ thuật viên</p>
              <p className="text-gray-600 text-sm">
                Chuyên viên kỹ thuật với chứng chỉ quốc tế về âm thanh
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Stats */}
      <div className="mb-16">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">10+</div>
                <div className="text-blue-100">Năm kinh nghiệm</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">5000+</div>
                <div className="text-blue-100">Khách hàng hài lòng</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">1000+</div>
                <div className="text-blue-100">Sản phẩm đa dạng</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Hỗ trợ khách hàng</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Hãy trải nghiệm âm thanh tuyệt vời cùng chúng tôi
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Liên hệ ngay để được tư vấn và chọn sản phẩm phù hợp nhất với nhu cầu của bạn
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" legacyBehavior>
            <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              🛍️ Xem sản phẩm
            </span>
          </Link>
          <Link href="/support/contact" legacyBehavior>
            <span className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              💬 Liên hệ tư vấn
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

