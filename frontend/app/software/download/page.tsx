'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Clock, Download, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

type PaymentStatus = {
  status: string;
  transactionId?: string | null;
  createdAt?: string;
  completedAt?: string | null;
};

type DownloadItem = {
  productId: string;
  name: string;
  quantity: number;
  downloadUrl: string;
};

function DownloadContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loadingDownloads, setLoadingDownloads] = useState(false);
  const fetchedDownloadsRef = useRef(false);
  const toastShownRef = useRef(false);

  const checkPaymentStatus = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(orderId)}&paymentMethod=payos`);
      const json = await res.json();
      if (json?.success) {
        setPaymentStatus(json.status);
        if (json.status?.status === 'COMPLETED') {
          if (!toastShownRef.current) {
            toastShownRef.current = true;
            toast.success('Thanh toán thành công. Bạn có thể tải phần mềm.');
          }
        }
      }
    } catch (error) {
      console.error('Failed to check payment status:', error);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    checkPaymentStatus();
    const interval = setInterval(checkPaymentStatus, 2500);
    return () => clearInterval(interval);
  }, [orderId, checkPaymentStatus]);

  useEffect(() => {
    if (!orderId) return;
    if (paymentStatus?.status !== 'COMPLETED') return;
    if (fetchedDownloadsRef.current) return;
    fetchedDownloadsRef.current = true;

    (async () => {
      try {
        setLoadingDownloads(true);
        let intentId = '';
        try {
          intentId = localStorage.getItem(`atl_payos_intent_${orderId}`) || '';
          if (!intentId) {
            const lastOrder = localStorage.getItem('atl_last_payos_order') || '';
            const lastIntent = localStorage.getItem('atl_last_payos_intent') || '';
            if (lastOrder === orderId && lastIntent) intentId = lastIntent;
          }
        } catch (_err) {
          intentId = '';
        }

        const qs = new URLSearchParams({ orderId });
        if (intentId) qs.set('intentId', intentId);

        const res = await fetch(`/api/orders/downloads?${qs.toString()}`);
        const json = await res.json();
        if (json?.success) {
          const items = (json.data?.downloads || []) as DownloadItem[];
          setDownloads(items);
        } else {
          const message = json?.error || 'Không thể lấy link tải xuống';
          toast.error(message);
        }
      } catch (error) {
        console.error('Failed to fetch downloads:', error);
        toast.error('Không thể lấy link tải xuống');
      } finally {
        setLoadingDownloads(false);
      }
    })();
  }, [orderId, paymentStatus?.status]);

  const status = paymentStatus?.status || 'PENDING';

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-black uppercase tracking-widest">Tải phần mềm</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Đơn hàng: <span className="font-semibold">#{orderId || 'N/A'}</span>
              </p>
            </div>
            <div className="shrink-0">
              {status === 'COMPLETED' ? (
                <CheckCircle className="h-6 w-6 text-primary" />
              ) : status === 'FAILED' ? (
                <XCircle className="h-6 w-6 text-red-500" />
              ) : (
                <Clock className="h-6 w-6 text-accent" />
              )}
            </div>
          </div>

          {status !== 'COMPLETED' && (
            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 text-sm">
              <p className="font-semibold">Đang xác nhận thanh toán…</p>
              <p className="text-muted-foreground mt-1">
                Trang sẽ tự cập nhật khi PayOS xác nhận giao dịch thành công.
              </p>
            </div>
          )}

          {status === 'FAILED' && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
              <p className="font-semibold text-red-500">Thanh toán thất bại hoặc bị hủy.</p>
              <p className="text-muted-foreground mt-1">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
            </div>
          )}
        </div>

        {status === 'COMPLETED' && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest">Link tải xuống</h2>

            {loadingDownloads ? (
              <p className="text-sm text-muted-foreground">Đang tải link…</p>
            ) : downloads.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Chưa có link tải cho đơn hàng này (vui lòng kiểm tra sản phẩm đã được cấu hình link Google Drive).
              </p>
            ) : (
              <div className="space-y-3">
                {downloads.map((d) => (
                  <div key={d.productId} className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{d.name}</p>
                      <p className="text-xs text-muted-foreground">Số lượng: {d.quantity}</p>
                    </div>
                    <a
                      href={d.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest"
                    >
                      <Download className="h-4 w-4" />
                      Tải xuống
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link href="/software" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
            Quay lại phần mềm
          </Link>
          <Link href="/" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
            Trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SoftwareDownloadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <DownloadContent />
    </Suspense>
  );
}
