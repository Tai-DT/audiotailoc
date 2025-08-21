import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Điều khoản sử dụng</h1>
          <p className="text-gray-600">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Điều khoản chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Bằng việc truy cập và sử dụng website Audio Tài Lộc, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng này.
            </p>
            <p>
              Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Sử dụng dịch vụ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Website Audio Tài Lộc cung cấp các dịch vụ mua sắm sản phẩm âm thanh và đặt lịch dịch vụ âm thanh chuyên nghiệp.
            </p>
            <p>
              Bạn có thể sử dụng dịch vụ của chúng tôi để:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Xem và mua sắm các sản phẩm âm thanh</li>
              <li>Đặt lịch dịch vụ âm thanh</li>
              <li>Xem portfolio dự án</li>
              <li>Liên hệ hỗ trợ khách hàng</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Tài khoản người dùng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Khi tạo tài khoản trên website, bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật.
            </p>
            <p>
              Bạn có trách nhiệm bảo mật mật khẩu và tài khoản của mình, cũng như tất cả các hoạt động xảy ra dưới tài khoản của bạn.
            </p>
            <p>
              Bạn đồng ý thông báo ngay lập tức cho chúng tôi về bất kỳ việc sử dụng trái phép tài khoản hoặc bất kỳ vi phạm bảo mật nào khác.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Đặt hàng và thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Khi đặt hàng, bạn đồng ý cung cấp thông tin thanh toán chính xác và đầy đủ.
            </p>
            <p>
              Chúng tôi có quyền từ chối hoặc hủy đơn hàng nếu có lý do hợp lý, bao gồm nhưng không giới hạn ở:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sản phẩm không có sẵn</li>
              <li>Thông tin thanh toán không hợp lệ</li>
              <li>Vi phạm điều khoản sử dụng</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>5. Bảo mật thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo chính sách bảo mật của chúng tôi.
            </p>
            <p>
              Thông tin thanh toán được mã hóa và bảo mật theo tiêu chuẩn quốc tế.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>6. Giới hạn trách nhiệm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Audio Tài Lộc không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả nào phát sinh từ việc sử dụng dịch vụ của chúng tôi.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>7. Thay đổi điều khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Những thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.
            </p>
            <p>
              Việc tiếp tục sử dụng dịch vụ sau khi thay đổi điều khoản được coi là chấp nhận các điều khoản mới.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>8. Liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về các điều khoản sử dụng này, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> support@audiotailoc.com</p>
              <p><strong>Điện thoại:</strong> 0901 234 567</p>
              <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
