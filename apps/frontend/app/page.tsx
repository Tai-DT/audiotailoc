import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section style={{ padding: 24, background: '#0b1a2b', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Audio Tài Lộc</h1>
          <p>Loa - Âm thanh - Lắp đặt - Cho thuê - Sửa chữa</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/products" className="btn">Mua loa</Link>
            <Link href="/services" className="btn">Đặt dịch vụ</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: 24 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Dịch vụ của chúng tôi</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <ServiceCard title="Sửa chữa thiết bị âm thanh" href="/services/repair" />
            <ServiceCard title="Cho thuê hệ thống âm thanh" href="/services/rental" />
            <ServiceCard title="Lắp đặt hệ thống âm thanh" href="/services/installation" />
            <ServiceCard title="Lắp đặt Tivi" href="/services/tv-installation" />
          </div>
        </div>
      </section>

      <section style={{ padding: 24, background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Sản phẩm nổi bật</h2>
          <p>Danh sách sản phẩm nổi bật sẽ hiển thị tại đây.</p>
          <Link href="/products" className="text-blue-600 underline">Xem tất cả sản phẩm</Link>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} style={{ border: '1px solid #eee', padding: 16, borderRadius: 8, display: 'block' }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ color: '#666', marginTop: 6 }}>Đội ngũ kỹ thuật tận tâm, chuyên nghiệp</div>
    </Link>
  );
}


