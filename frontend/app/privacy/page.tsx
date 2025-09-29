import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Chính sách bảo mật</h1>
        <p className="text-muted-foreground mb-6">
          Audio Tài Lộc cam kết bảo vệ thông tin cá nhân của khách hàng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
        </p>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">1. Thông tin chúng tôi thu thập</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Thông tin liên hệ: họ tên, email, số điện thoại, địa chỉ</li>
            <li>Thông tin tài khoản: tên đăng nhập, mật khẩu (được mã hóa)</li>
            <li>Thông tin đơn hàng và thanh toán</li>
            <li>Dữ liệu kỹ thuật: địa chỉ IP, loại trình duyệt, cookie</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">2. Mục đích sử dụng</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Xử lý đơn hàng và cung cấp dịch vụ hỗ trợ</li>
            <li>Cải thiện trải nghiệm và cá nhân hóa nội dung</li>
            <li>Gửi thông báo về khuyến mãi (nếu bạn đồng ý)</li>
            <li>Đảm bảo an toàn hệ thống và phòng chống gian lận</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">3. Bảo mật và lưu trữ</h2>
          <p className="text-muted-foreground">
            Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ dữ liệu. Thông tin chỉ được lưu trữ trong thời gian cần thiết cho mục đích đã nêu hoặc theo quy định của pháp luật.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">4. Quyền của bạn</h2>
          <p className="text-muted-foreground">
            Bạn có quyền truy cập, cập nhật, yêu cầu xóa hoặc hạn chế xử lý dữ liệu cá nhân của mình. Vui lòng liên hệ chúng tôi để được hỗ trợ.
          </p>
        </section>

        <p className="text-sm text-muted-foreground">Cập nhật lần cuối: 25/09/2025</p>
      </main>
    </div>
  );
}
