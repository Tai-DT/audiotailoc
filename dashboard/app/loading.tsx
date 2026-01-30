export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Đang tải...</h2>
        <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  )
}