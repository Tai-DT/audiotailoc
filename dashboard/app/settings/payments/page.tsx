function mask(v?: string | null) {
  if (!v) return '';
  if (v.length <= 6) return '*'.repeat(v.length);
  return v.slice(0, 3) + '****' + v.slice(-3);
}

export default function PaymentSettingsPage() {
  const env = {
    VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE,
    VNPAY_PAY_URL: process.env.VNPAY_PAY_URL,
    MOMO_PAY_URL: process.env.MOMO_PAY_URL,
    PAYOS_API_URL: process.env.PAYOS_API_URL,
    PAYOS_CLIENT_ID: process.env.PAYOS_CLIENT_ID,
    PAYOS_API_KEY: process.env.PAYOS_API_KEY,
    PAYOS_CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY,
  } as Record<string, string | undefined>;
  return (
    <main style={{ padding: 24 }}>
      <h1>Cấu hình thanh toán</h1>
      <p style={{ color: '#555' }}>Hiện tại dùng biến môi trường (.env) trên backend.</p>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Khóa</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Giá trị</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(env).map(([k, v]) => (
            <tr key={k}>
              <td style={{ padding: 8 }}>{k}</td>
              <td style={{ padding: 8 }}>{mask(v ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 12 }}>
        Để thay đổi, cập nhật file <code>backend/.env</code> và khởi động lại backend.
      </p>
    </main>
  );
}

