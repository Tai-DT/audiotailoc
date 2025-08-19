import Link from 'next/link';

export default function SettingsIndex() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Cài đặt hệ thống</h1>
      <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
        <li>
          <Link href="/settings/payments">Cấu hình thanh toán</Link>
        </li>
      </ul>
    </main>
  );
}

