"use client";
import { useEffect, useState } from 'react';

export default function FlashBanner(props: { type?: 'success' | 'error'; message: string }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 3500);
    return () => clearTimeout(t);
  }, []);
  if (!open) return null;
  const bg = props.type === 'error' ? '#fee' : '#e6ffed';
  const border = props.type === 'error' ? '#fcc' : '#b7f5c5';
  const color = '#222';
  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        background: bg,
        color,
        border: `1px solid ${border}`,
        padding: '8px 12px',
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
      onClick={() => setOpen(false)}
    >
      {props.message}
    </div>
  );
}

