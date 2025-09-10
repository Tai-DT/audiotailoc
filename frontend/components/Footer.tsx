import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                🎵
              </div>
              <div>
                <span className="text-xl font-bold">Audio Tài Lộc</span>
                <div className="text-xs text-gray-400">Nâng tầm âm thanh</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Cửa hàng audio chuyên nghiệp với các sản phẩm chất lượng cao. 
              Tai nghe, loa, ampli và phụ kiện âm thanh chính hãng.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href={`https://zalo.me/${process.env.NEXT_PUBLIC_ZALO_PHONE || '0582454014'}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Zalo</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Danh mục
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                  Hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support/contact" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/support/faq" className="text-gray-300 hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/support/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/support/returns" className="text-gray-300 hover:text-white transition-colors">
                  Đổi trả
                </Link>
              </li>
              <li>
                <Link href="/support/warranty" className="text-gray-300 hover:text-white transition-colors">
                  Bảo hành
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-blue-400">📍</span>
                <div>
                  <p className="text-gray-300">123 Đường ABC, Quận 1</p>
                  <p className="text-gray-300">TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">📞</span>
                <a href="tel:+84901234567" className="text-gray-300 hover:text-white transition-colors">
                  0901 234 567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">✉️</span>
                <a href="mailto:info@audiotailoc.com" className="text-gray-300 hover:text-white transition-colors">
                  info@audiotailoc.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">🕒</span>
                <div>
                  <p className="text-gray-300">Thứ 2 - Thứ 7: 8:00 - 22:00</p>
                  <p className="text-gray-300">Chủ nhật: 9:00 - 21:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Audio Tài Lộc. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
