"use client";
import { useEffect, useState } from 'react';

export default function RealtimeNotice() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const io = (await import('socket.io-client')).io;
        const url = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const socket = io(url, { transports: ['websocket'], autoConnect: true });
        socket.on('connect_error', () => {
          // ignore errors in dev
        });
        socket.on('order.updated', (payload: any) => {
          if (!mounted) return;
          setMsg(`Cập nhật đơn hàng: ${payload?.id || ''} → ${payload?.status || ''}`);
          setTimeout(() => mounted && setMsg(null), 4000);
        });
      } catch {
        // socket.io-client not installed; ignore gracefully
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  if (!msg) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        background: '#e6ffed',
        border: '1px solid #b7f5c5',
        padding: '8px 12px',
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      {msg}
    </div>
  );
}

