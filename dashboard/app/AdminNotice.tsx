"use client";

export default function AdminNotice(props: { children?: React.ReactNode }) {
  return (
    <p
      style={{
        background: '#fffbe6',
        border: '1px solid #ffe58f',
        padding: '8px 12px',
        borderRadius: 8,
        color: '#614700',
        margin: '8px 0 16px',
      }}
    >
      {props.children ?? 'Khu vực quản trị viên: bạn đang ở chế độ xem chỉ đọc.'}
    </p>
  );
}

