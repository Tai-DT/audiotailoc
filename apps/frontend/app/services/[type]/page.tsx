"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiBase } from "../../lib/api";

const SERVICE_LABEL: Record<string, string> = {
  repair: 'Sửa chữa thiết bị âm thanh',
  rental: 'Cho thuê hệ thống âm thanh',
  installation: 'Lắp đặt hệ thống âm thanh',
  'tv-installation': 'Lắp đặt Tivi',
};

function mapTypeToEnum(t: string): 'REPAIR' | 'RENTAL' | 'INSTALLATION' | 'TV_INSTALLATION' {
  switch (t) {
    case 'repair': return 'REPAIR';
    case 'rental': return 'RENTAL';
    case 'installation': return 'INSTALLATION';
    case 'tv-installation': return 'TV_INSTALLATION';
    default: return 'REPAIR';
  }
}

export default function ServiceRequestPage({ params }: { params: { type: string } }) {
  const type = params.type;
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setOk(null); setErr(null);
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/services/requests`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, serviceType: mapTypeToEnum(type) }),
      });
      if (!res.ok) throw new Error(`Bad status ${res.status}`);
      setOk('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.');
      setForm({ name: '', phone: '', email: '', address: '', message: '' });
      setTimeout(() => router.push('/'), 1500);
    } catch (e: any) {
      setErr('Gửi yêu cầu thất bại, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">{SERVICE_LABEL[type] || 'Đặt dịch vụ'}</h1>
      {ok && <div className="p-3 rounded bg-green-100 text-green-800">{ok}</div>}
      {err && <div className="p-3 rounded bg-red-100 text-red-800">{err}</div>}
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Họ tên</label>
          <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Số điện thoại</label>
          <input className="w-full border rounded px-3 py-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email (tuỳ chọn)</label>
          <input className="w-full border rounded px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Địa chỉ (tuỳ chọn)</label>
          <input className="w-full border rounded px-3 py-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Nội dung yêu cầu</label>
          <textarea className="w-full border rounded px-3 py-2" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button disabled={submitting} onClick={submit} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
          {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
      </div>
    </div>
  );
}