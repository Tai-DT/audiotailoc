import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter subscription */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Đăng ký nhận tin tức mới nhất từ Audio Tài Lộc
            </h3>
            <p className="mb-6">
              Cập nhật những sản phẩm mới, khuyến mãi hấp dẫn và kiến thức âm thanh hữu ích
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 bg-white text-black"
              />
              <Button variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">ATL</span>
              </div>
              <div>
                <div className="text-xl font-bold">Audio Tài Lộc</div>
                <div className="text-sm text-gray-400">Nâng tầm trải nghiệm âm thanh</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Chuyên cung cấp các thiết bị âm thanh cao cấp, dịch vụ tư vấn và setup hệ thống âm thanh chuyên nghiệp. 
              Hơn 10 năm kinh nghiệm trong lĩnh vực âm thanh.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="ghost" className="p-2 h-auto text-gray-300 hover:text-white hover:bg-orange-600">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 h-auto text-gray-300 hover:text-white hover:bg-orange-600">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 h-auto text-gray-300 hover:text-white hover:bg-orange-600">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Liên kết nhanh</h3>
            <nav className="space-y-2">
              <Link href="/products" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Sản phẩm
              </Link>
              <Link href="/services" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Dịch vụ
              </Link>
              <Link href="/projects" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Dự án
              </Link>
              <Link href="/blog" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Blog
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Về chúng tôi
              </Link>
              <Link href="/support" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Hỗ trợ
              </Link>
            </nav>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Danh mục sản phẩm</h3>
            <nav className="space-y-2">
              <Link href="/categories/tai-nghe" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Tai nghe
              </Link>
              <Link href="/categories/loa" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Loa
              </Link>
              <Link href="/categories/ampli" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Ampli
              </Link>
              <Link href="/categories/dac" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                DAC
              </Link>
              <Link href="/categories/phu-kien" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Phụ kiện
              </Link>
              <Link href="/categories/may-nghe-nhac" className="block text-gray-300 hover:text-orange-400 text-sm transition-colors">
                Máy nghe nhạc
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>123 Đường Nguyễn Văn Cừ</p>
                  <p>Quận 5, TP. Hồ Chí Minh</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-gray-300">Hotline: </p>
                  <Link href="tel:0901234567" className="text-orange-400 hover:text-orange-300">
                    0901 234 567
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <div className="text-sm">
                  <Link href="mailto:info@audiotailoc.com" className="text-orange-400 hover:text-orange-300">
                    info@audiotailoc.com
                  </Link>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>Thứ 2 - Thứ 7: 8:00 - 20:00</p>
                  <p>Chủ nhật: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Bottom footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © 2024 Audio Tài Lộc. Tất cả quyền được bảo lưu.
          </div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="/shipping-policy" className="text-gray-400 hover:text-orange-400 transition-colors">
              Chính sách vận chuyển
            </Link>
            <Link href="/return-policy" className="text-gray-400 hover:text-orange-400 transition-colors">
              Chính sách đổi trả
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
