import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                AT
              </div>
              <span className="font-bold text-xl">Audio Tài Lộc</span>
            </div>
            <p className="text-gray-300 text-sm">
              Chuyên cung cấp thiết bị âm thanh chất lượng cao và dịch vụ kỹ thuật chuyên nghiệp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" title="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" title="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" title="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên kết nhanh</h3>
            <nav className="space-y-2">
              <Link href="/products" className="block text-gray-300 hover:text-white transition-colors">
                Sản phẩm
              </Link>
              <Link href="/services" className="block text-gray-300 hover:text-white transition-colors">
                Dịch vụ
              </Link>
              <Link href="/projects" className="block text-gray-300 hover:text-white transition-colors">
                Dự án
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors">
                Giới thiệu
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Liên hệ
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Danh mục</h3>
            <nav className="space-y-2">
              <Link href="/products?category=amplifiers" className="block text-gray-300 hover:text-white transition-colors">
                Amplifier
              </Link>
              <Link href="/products?category=speakers" className="block text-gray-300 hover:text-white transition-colors">
                Loa
              </Link>
              <Link href="/products?category=microphones" className="block text-gray-300 hover:text-white transition-colors">
                Micro
              </Link>
              <Link href="/products?category=mixers" className="block text-gray-300 hover:text-white transition-colors">
                Mixer
              </Link>
              <Link href="/products?category=accessories" className="block text-gray-300 hover:text-white transition-colors">
                Phụ kiện
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-300" />
                <span className="text-gray-300 text-sm">
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-300" />
                <span className="text-gray-300 text-sm">
                  (028) 1234 5678
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-300" />
                <span className="text-gray-300 text-sm">
                  info@audiotailoc.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © 2024 Audio Tài Lộc. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/shipping" className="text-gray-300 hover:text-white text-sm transition-colors">
                Chính sách giao hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
