export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔎</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h1>
        <p className="text-gray-600 mb-6">Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
        <a
          href="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Quay lại danh sách sản phẩm
        </a>
      </div>
    </div>
  );
}
