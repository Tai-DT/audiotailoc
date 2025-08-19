export const metadata = {
  title: 'Cửa hàng Audio Tài Lộc',
  description: 'Cửa hàng trực tuyến',
};

import Link from 'next/link';
import './globals.css';
import ChatWidget from './components/ChatWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {/* Main Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/" className="text-2xl font-bold text-blue-600">
                    🎵 Audio Tài Lộc
                  </Link>
                </div>
                <nav className="hidden md:ml-8 md:flex md:space-x-8">
                  <Link 
                    href="/" 
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Trang chủ
                  </Link>
                  <Link 
                    href="/products" 
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Sản phẩm
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Giới thiệu
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Liên hệ
                  </Link>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link 
                  href="/cart" 
                  className="text-gray-600 hover:text-gray-900 p-2 transition-colors"
                >
                  🛒 Giỏ hàng
                </Link>
                <Link 
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Secondary Navigation */}
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 h-12">
              <Link 
                href="/categories/headphones" 
                className="text-white hover:text-blue-200 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-blue-200"
              >
                🎧 Tai nghe
              </Link>
              <Link 
                href="/categories/speakers" 
                className="text-white hover:text-blue-200 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-blue-200"
              >
                🔊 Loa
              </Link>
              <Link 
                href="/categories/amplifiers" 
                className="text-white hover:text-blue-200 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-blue-200"
              >
                📟 Ampli
              </Link>
              <Link 
                href="/categories/accessories" 
                className="text-white hover:text-blue-200 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-blue-200"
              >
                🔌 Phụ kiện
              </Link>
              <Link 
                href="/deals" 
                className="text-yellow-300 hover:text-yellow-100 flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-yellow-300"
              >
                ⚡ Khuyến mãi
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
        <ChatWidget />
      </body>
    </html>
  );
}
