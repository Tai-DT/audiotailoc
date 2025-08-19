export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 mb-10 rounded-lg">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">🎵 Audio Tài Lộc</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Khám phá thế giới âm thanh tuyệt vời với các sản phẩm chất lượng cao từ những thương hiệu hàng đầu
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Khám phá ngay
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Xem khuyến mãi
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
          <div className="text-4xl mb-4">🎧</div>
          <h3 className="text-xl font-semibold mb-2">Tai nghe chất lượng</h3>
          <p className="text-gray-600">Từ gaming đến audiophile, chúng tôi có đầy đủ các loại tai nghe</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
          <div className="text-4xl mb-4">🔊</div>
          <h3 className="text-xl font-semibold mb-2">Loa cao cấp</h3>
          <p className="text-gray-600">Hệ thống loa từ mini portable đến home theater</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
          <div className="text-4xl mb-4">📟</div>
          <h3 className="text-xl font-semibold mb-2">Ampli & DAC</h3>
          <p className="text-gray-600">Thiết bị khuếch đại và chuyển đổi âm thanh chuyên nghiệp</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Bắt đầu hành trình âm thanh của bạn</h2>
        <p className="text-gray-600 mb-6">Tư vấn miễn phí từ các chuyên gia âm thanh của chúng tôi</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Liên hệ tư vấn
        </button>
      </section>
    </main>
  );
}


