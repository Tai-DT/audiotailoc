import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Chính sách bảo mật</h1>
          <p className="text-gray-600">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Thông tin chúng tôi thu thập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi thu thập thông tin bạn cung cấp trực tiếp cho chúng tôi, bao gồm:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Thông tin cá nhân (tên, email, số điện thoại)</li>
              <li>Thông tin địa chỉ giao hàng</li>
              <li>Thông tin thanh toán</li>
              <li>Lịch sử đơn hàng và mua sắm</li>
              <li>Thông tin liên hệ hỗ trợ</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Cách chúng tôi sử dụng thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi sử dụng thông tin thu thập để:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Xử lý và hoàn thành đơn hàng</li>
              <li>Cung cấp dịch vụ khách hàng</li>
              <li>Gửi thông báo về đơn hàng và dịch vụ</li>
              <li>Cải thiện trải nghiệm người dùng</li>
              <li>Phân tích và tối ưu hóa website</li>
              <li>Tuân thủ các yêu cầu pháp lý</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Chia sẻ thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn, ngoại trừ:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Đối tác thanh toán để xử lý giao dịch</li>
              <li>Đơn vị vận chuyển để giao hàng</li>
              <li>Yêu cầu pháp lý hoặc bảo vệ quyền lợi</li>
              <li>Bảo vệ an toàn và bảo mật</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Bảo mật thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Mã hóa SSL cho tất cả dữ liệu truyền tải</li>
              <li>Bảo mật cơ sở dữ liệu</li>
              <li>Kiểm soát truy cập nghiêm ngặt</li>
              <li>Giám sát bảo mật liên tục</li>
              <li>Cập nhật bảo mật định kỳ</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>5. Cookie và công nghệ theo dõi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi sử dụng cookie và các công nghệ tương tự để:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ghi nhớ tùy chọn và cài đặt</li>
              <li>Phân tích lưu lượng truy cập</li>
              <li>Cải thiện hiệu suất website</li>
              <li>Cung cấp nội dung phù hợp</li>
            </ul>
            <p>
              Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt của mình.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>6. Quyền của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Bạn có các quyền sau đối với thông tin cá nhân của mình:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Quyền truy cập và xem thông tin</li>
              <li>Quyền chỉnh sửa và cập nhật</li>
              <li>Quyền xóa thông tin</li>
              <li>Quyền rút lại sự đồng ý</li>
              <li>Quyền khiếu nại về xử lý dữ liệu</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>7. Lưu trữ thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cung cấp dịch vụ cho bạn</li>
              <li>Tuân thủ nghĩa vụ pháp lý</li>
              <li>Giải quyết tranh chấp</li>
              <li>Thực thi thỏa thuận</li>
            </ul>
            <p>
              Khi không còn cần thiết, chúng tôi sẽ xóa hoặc ẩn danh hóa thông tin của bạn.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>8. Thay đổi chính sách</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Những thay đổi sẽ được đăng tải trên trang này với ngày cập nhật mới nhất.
            </p>
            <p>
              Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ để nắm rõ cách chúng tôi bảo vệ thông tin của bạn.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>9. Liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Nếu bạn có câu hỏi về chính sách bảo mật này hoặc cách chúng tôi xử lý thông tin cá nhân, vui lòng liên hệ:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@audiotailoc.com</p>
              <p><strong>Điện thoại:</strong> 0901 234 567</p>
              <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
            </div>
            <p>
              Chúng tôi sẽ phản hồi trong vòng 30 ngày kể từ khi nhận được yêu cầu của bạn.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
