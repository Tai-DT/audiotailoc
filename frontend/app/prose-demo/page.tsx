'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProseDemoPage() {
  const sampleContent = `
# Xu hướng âm thanh 2024: Wireless và Smart Audio

Công nghệ âm thanh đang phát triển với tốc độ chóng mặt. Năm 2024 chứng kiến sự bùng nổ của các giải pháp âm thanh không dây và thông minh.

## Xu hướng chính 2024

### 1. Âm thanh không dây (Wireless Audio)
- **Bluetooth 5.3**: Tốc độ truyền tải nhanh hơn, phạm vi xa hơn
- **Wi-Fi 6/7**: Streaming âm thanh chất lượng cao
- **Multi-room**: Đồng bộ âm thanh trong nhiều phòng

### 2. Smart Audio với AI
- **Voice Control**: Điều khiển bằng giọng nói
- **Auto Calibration**: Tự động cân bằng âm thanh
- **Adaptive Sound**: Điều chỉnh âm thanh theo nội dung

### 3. Spatial Audio & 3D Sound
- **Dolby Atmos**: Âm thanh vòm sống động
- **Sony 360 Reality Audio**: Âm thanh 3D chân thực
- **Apple Spatial Audio**: Tích hợp với thiết bị Apple

## Công nghệ nổi bật

### Smart Speakers
- Tích hợp trợ lý ảo (Siri, Google Assistant, Alexa)
- Phát nhạc streaming (Spotify, Apple Music, Deezer)
- Điều khiển thiết bị thông minh trong nhà

### Soundbars thông minh
- Thiết kế gọn nhẹ, dễ lắp đặt
- Kết nối không dây với TV
- Hỗ trợ nhiều định dạng âm thanh

### Earbuds & Headphones
- Active Noise Cancellation tiên tiến
- Thời lượng pin dài (8-10 tiếng)
- Chống nước và mồ hôi

> Chúng tôi luôn cập nhật những công nghệ âm thanh mới nhất để phục vụ khách hàng. Các sản phẩm wireless và smart audio đang rất được ưa chuộng nhờ tính tiện lợi và chất lượng âm thanh vượt trội.

Đặc biệt, chúng tôi có đội ngũ kỹ thuật chuyên nghiệp để tư vấn và setup hệ thống âm thanh thông minh cho gia đình và doanh nghiệp.

---

## Bảng so sánh công nghệ

| Công nghệ    | Ưu điểm                  | Nhược điểm          |
|--------------|---------------------------|---------------------|
| Bluetooth 5.3| Tốc độ nhanh, phạm vi xa | Tiêu thụ pin cao    |
| Wi-Fi 6     | Chất lượng cao, ổn định  | Yêu cầu kết nối mạng|
| Multi-room  | Đồng bộ toàn nhà         | Đầu tư ban đầu cao  |

*Để biết thêm thông tin chi tiết, vui lòng [liên hệ với chúng tôi](/contact).*

\`console.log('Hello, Audio World!')\`
  `;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Demo Prose Styling</h1>

          <div className="bg-card border rounded-lg p-8">
            <div className="prose prose-xl max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {sampleContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
