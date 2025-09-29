# Zalo Chat Components

Thư mục này chứa các component liên quan đến việc tích hợp Zalo Chat vào website.

## Components

### ZaloChatWidget

Component chính để hiển thị nút chat Zalo trên website.

```tsx
import { ZaloChatWidget } from '@/components/ui/zalo-chat-widget';

export default function MyPage() {
  return (
    <div>
      {/* Nội dung trang */}
      <ZaloChatWidget phoneNumber="0987654321" />
    </div>
  );
}
```

**Props:**
- `phoneNumber`: Số điện thoại Zalo (string, bắt buộc)
- `position`: Vị trí hiển thị ('bottom-right' | 'bottom-left' | 'top-right' | 'top-left', mặc định: 'bottom-right')
- `size`: Kích thước nút ('small' | 'medium' | 'large', mặc định: 'medium')

### ZaloChat

Component nâng cao với nhiều tùy chỉnh hơn.

```tsx
import { ZaloChat } from '@/components/ui/zalo-chat';

export default function MyPage() {
  return (
    <ZaloChat
      phoneNumber="0987654321"
      position="bottom-left"
      size="large"
      className="custom-class"
    />
  );
}
```

## Hook

### useZaloChat

Hook để mở chat Zalo programmatically.

```tsx
import { useZaloChat } from '@/hooks/use-zalo-chat';

export default function MyComponent() {
  const { openZaloChat } = useZaloChat();

  const handleContact = () => {
    openZaloChat('0987654321');
  };

  return (
    <button onClick={handleContact}>
      Liên hệ qua Zalo
    </button>
  );
}
```

## Cấu hình

Thông tin liên hệ được cấu hình trong `/lib/contact-config.ts`:

```typescript
export const CONTACT_CONFIG = {
  zalo: {
    phoneNumber: '0987654321', // Thay bằng số điện thoại Zalo thực tế
    displayName: 'Audio Tài Lộc',
    welcomeMessage: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?'
  },
  // ... các thông tin khác
};
```

## Cách sử dụng

### 1. Tích hợp vào toàn bộ website

Thêm vào `app/layout.tsx` để hiển thị trên tất cả các trang:

```tsx
import { ZaloChatWidget } from '@/components/ui/zalo-chat-widget';
import { CONTACT_CONFIG } from '@/lib/contact-config';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ZaloChatWidget phoneNumber={CONTACT_CONFIG.zalo.phoneNumber} />
      </body>
    </html>
  );
}
```

### 2. Sử dụng trong component cụ thể

```tsx
import { ZaloChatWidget } from '@/components/ui/zalo-chat-widget';

export default function ContactPage() {
  return (
    <div>
      <h1>Liên hệ</h1>
      <ZaloChatWidget
        phoneNumber="0987654321"
        position="bottom-left"
        size="large"
      />
    </div>
  );
}
```

### 3. Mở chat từ button tùy chỉnh

```tsx
import { useZaloChat } from '@/hooks/use-zalo-chat';

export default function CustomButton() {
  const { openZaloChat } = useZaloChat();

  return (
    <button
      onClick={() => openZaloChat('0987654321')}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Chat Zalo
    </button>
  );
}
```

## Lưu ý

- Số điện thoại sẽ được tự động format với mã quốc gia +84 nếu chưa có
- Trên mobile sẽ thử mở app Zalo trước, sau đó fallback về web
- Trên desktop sẽ mở Zalo Web trực tiếp
- Component tự động load Zalo SDK khi cần thiết