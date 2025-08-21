import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h1>Không tìm thấy</h1>
          <p>Trang bạn yêu cầu không tồn tại.</p>
          <Link href="/">Quay về trang chủ</Link>
        </div>
      </body>
    </html>
  );
}


