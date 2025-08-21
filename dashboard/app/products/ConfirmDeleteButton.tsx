"use client";

export default function ConfirmDeleteButton(props: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
          e.preventDefault();
        }
      }}
      style={{ color: '#b00020' }}
    >
      {props.children ?? 'Xóa'}
    </button>
  );
}

