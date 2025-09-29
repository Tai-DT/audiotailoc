import React from 'react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Chính sách giao hàng & bảo hành</h1>
        <p className="text-muted-foreground mb-6">
          Chúng tôi luôn nỗ lực giao hàng nhanh chóng và hỗ trợ bảo hành tận tâm để mang đến trải nghiệm tốt nhất cho khách hàng.
        </p>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">1. Phí và phạm vi giao hàng</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Miễn phí giao hàng cho đơn hàng từ 1.000.000₫ trong nội thành TP.HCM.</li>
            <li>Phí giao hàng ngoại thành và tỉnh sẽ được thông báo khi xác nhận đơn hàng.</li>
            <li>Giao hàng toàn quốc qua các đơn vị vận chuyển uy tín.</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">2. Thời gian giao hàng</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Nội thành TP.HCM: 1–3 ngày làm việc.</li>
            <li>Các tỉnh thành khác: 3–7 ngày làm việc tùy khu vực.</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">3. Chính sách bảo hành</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Bảo hành chính hãng 12 tháng (nếu không có quy định khác của nhà sản xuất).</li>
            <li>Hỗ trợ kỹ thuật trọn đời sử dụng sản phẩm.</li>
            <li>Đổi trả trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất.</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-semibold">4. Lưu ý</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Vui lòng kiểm tra tình trạng sản phẩm khi nhận hàng.</li>
            <li>Giữ lại hóa đơn và phụ kiện đầy đủ để được hỗ trợ bảo hành.</li>
          </ul>
        </section>

        <p className="text-sm text-muted-foreground">Cập nhật lần cuối: 25/09/2025</p>
      </main>
    </div>
  );
}
