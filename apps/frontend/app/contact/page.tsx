import Link from 'next/link';

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Liên hệ</h1>
      <p>Hotline: 09xx xxx xxx</p>
      <p>Email: support@audiotailoc.com</p>
      <p>
        Cần hỗ trợ nhanh? <Link className="text-blue-600 underline" href="/services/repair">Gửi yêu cầu dịch vụ</Link>
      </p>
    </div>
  );
}