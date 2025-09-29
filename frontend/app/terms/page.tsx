import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Điều khoản sử dụng</h1>
        <p className="text-muted-foreground mb-6">
          Khi truy cập và sử dụng website của Audio Tài Lộc, bạn đồng ý tuân thủ các điều khoản dưới đây.
        </p>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">1. Tài khoản người dùng</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
            <li>Mọi hoạt động diễn ra dưới tài khoản của bạn được coi là do bạn thực hiện.</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">2. Đặt hàng và thanh toán</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Đơn hàng chỉ được xác nhận khi chúng tôi liên hệ hoặc gửi thông báo xác nhận.</li>
            <li>Giá sản phẩm có thể thay đổi mà không cần thông báo trước.</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">3. Bảo hành và đổi trả</h2>
          <p className="text-muted-foreground">
            Sản phẩm được bảo hành theo chính sách của hãng và của Audio Tài Lộc. Vui lòng tham khảo trang Chính sách giao hàng & bảo hành để biết chi tiết.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">4. Quyền sở hữu trí tuệ</h2>
          <p className="text-muted-foreground">
            Tất cả nội dung trên website (logo, hình ảnh, văn bản...) thuộc sở hữu của Audio Tài Lộc hoặc đối tác và được bảo vệ bởi pháp luật.
          </p>
        </section>

        <p className="text-sm text-muted-foreground">Cập nhật lần cuối: 25/09/2025</p>
      </main>
    </div>
  );
}
