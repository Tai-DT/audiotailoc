import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                AT
              </div>
              <span className="font-bold text-xl">Audio Tài Lộc</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Chuyên cung cấp thiết bị âm thanh chất lượng cao và dịch vụ kỹ thuật chuyên nghiệp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors touch-manipulation p-2" title="Facebook" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors touch-manipulation p-2" title="Instagram" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors touch-manipulation p-2" title="YouTube" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base sm:text-lg">Liên kết nhanh</h3>
            <nav className="space-y-2">
              <Link href="/san-pham" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Sản phẩm
              </Link>
              <Link href="/dich-vu" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Dịch vụ
              </Link>
              <Link href="/du-an" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Dự án
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Giới thiệu
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Liên hệ
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base sm:text-lg">Danh mục</h3>
            <nav className="space-y-2">
                            <Link href="/san-pham?category=amplifiers" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Amply
              </Link>
              <Link href="/san-pham?category=speakers" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Loa
              </Link>
              <Link href="/san-pham?category=microphones" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Micro
              </Link>
              <Link href="/san-pham?category=mixers" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Mixer
              </Link>
              <Link href="/san-pham?category=accessories" className="block text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 touch-manipulation">
                Phụ kiện
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base sm:text-lg">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 touch-manipulation">
                <MapPin className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm leading-relaxed">
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </div>
              <a href="tel:02812345678" className="flex items-center space-x-3 touch-manipulation hover:text-white transition-colors">
                <Phone className="h-5 w-5 text-gray-300 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  (028) 1234 5678
                </span>
              </a>
              <a href="mailto:info@audiotailoc.com" className="flex items-center space-x-3 touch-manipulation hover:text-white transition-colors">
                <Mail className="h-5 w-5 text-gray-300 flex-shrink-0" />
                <span className="text-gray-300 text-sm break-all">
                  info@audiotailoc.com
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-4">
            <p className="text-gray-300 text-xs sm:text-sm text-center md:text-left">
              © 2024 Audio Tài Lộc. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 md:gap-6">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation whitespace-nowrap">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation whitespace-nowrap">
                Điều khoản sử dụng
              </Link>
              <Link href="/shipping-policy" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation whitespace-nowrap">
                Chính sách giao hàng
              </Link>
              <Link href="/warranty" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation whitespace-nowrap">
                Chính sách bảo hành
              </Link>
              <Link href="/return-policy" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation whitespace-nowrap hidden sm:inline">
                Chính sách đổi trả
              </Link>
              <Link href="/technical-support" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation whitespace-nowrap hidden sm:inline">
                Hỗ trợ kỹ thuật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
