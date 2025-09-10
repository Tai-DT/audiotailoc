'use client';

export default function ProductError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h1>
        <p className="text-gray-600 mb-6">Không thể tải trang chi tiết sản phẩm. Vui lòng thử lại.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
          <a
            href="/products"
            className="bg-gray-100 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Về danh sách sản phẩm
          </a>
        </div>
      </div>
    </div>
  );
}
