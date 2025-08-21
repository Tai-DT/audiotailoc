import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FAQ from '@/components/FAQ';
import KnowledgeBase from '@/components/KnowledgeBase';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Trung tâm hỗ trợ</h1>
          <p className="text-xl text-gray-600 mb-8">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn với mọi thắc mắc
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">💬</div>
              <CardTitle>Chat trực tiếp</CardTitle>
              <CardDescription>
                Nhận hỗ trợ ngay lập tức từ đội ngũ chăm sóc khách hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Bắt đầu chat</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">📧</div>
              <CardTitle>Gửi yêu cầu</CardTitle>
              <CardDescription>
                Gửi yêu cầu hỗ trợ chi tiết và nhận phản hồi qua email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/support/contact">Gửi yêu cầu</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">📞</div>
              <CardTitle>Hotline</CardTitle>
              <CardDescription>
                Gọi trực tiếp để được hỗ trợ nhanh chóng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold mb-2">1900-xxxx</div>
              <p className="text-sm text-gray-600">T2-T6: 8:00-18:00</p>
            </CardContent>
          </Card>
        </div>

        {/* Popular FAQs */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
            <Button variant="outline" asChild>
              <Link href="/support/faq">Xem tất cả</Link>
            </Button>
          </div>
          <FAQ limit={5} showCategories={false} />
        </div>

        {/* Knowledge Base Preview */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Hướng dẫn & Tài liệu</h2>
            <Button variant="outline" asChild>
              <Link href="/support/knowledge-base">Xem tất cả</Link>
            </Button>
          </div>
          <KnowledgeBase showSearch={false} limit={4} />
        </div>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold mb-2">📍 Địa chỉ</h3>
                <p className="text-gray-600">
                  123 Đường ABC, Quận XYZ<br />
                  TP. Hồ Chí Minh
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📧 Email</h3>
                <p className="text-gray-600">
                  support@audiotailoc.com<br />
                  info@audiotailoc.com
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🕒 Giờ làm việc</h3>
                <p className="text-gray-600">
                  Thứ 2 - Thứ 6: 8:00 - 18:00<br />
                  Thứ 7: 8:00 - 12:00
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Self-Service Options */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Tự phục vụ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">📦</div>
                <h3 className="font-semibold mb-2">Theo dõi đơn hàng</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Kiểm tra trạng thái đơn hàng của bạn
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders">Xem đơn hàng</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="font-semibold mb-2">Đổi trả</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Hướng dẫn đổi trả sản phẩm
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/support/returns">Tìm hiểu</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-semibold mb-2">Bảo hành</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Thông tin về chính sách bảo hành
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/support/warranty">Xem chi tiết</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="font-semibold mb-2">Thanh toán</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Hướng dẫn các phương thức thanh toán
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/support/payment">Tìm hiểu</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
