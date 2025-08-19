"use client";
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dịch vụ âm thanh - Tivi</h1>
      <p>Chúng tôi cung cấp các dịch vụ chuyên nghiệp:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><Link className="text-blue-600 underline" href="/services/repair">Sửa chữa thiết bị âm thanh</Link></li>
        <li><Link className="text-blue-600 underline" href="/services/rental">Cho thuê hệ thống âm thanh</Link></li>
        <li><Link className="text-blue-600 underline" href="/services/installation">Lắp đặt hệ thống âm thanh</Link></li>
        <li><Link className="text-blue-600 underline" href="/services/tv-installation">Lắp đặt Tivi</Link></li>
      </ul>
    </div>
  );
}