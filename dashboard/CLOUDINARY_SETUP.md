# Hướng dẫn cấu hình Cloudinary cho Dashboard

## 🚀 Cấu hình Upload Preset

### Bước 1: Truy cập Cloudinary Dashboard
1. Đăng nhập vào [Cloudinary Console](https://cloudinary.com/console)
2. Chọn **Settings** > **Upload**

### Bước 2: Tạo Upload Preset
1. Click **Add upload preset**
2. Điền thông tin:
   - **Preset name**: `audio-tailoc`
   - **Mode**: `Unsigned` (quan trọng!)
   - **Folder**: `products`
3. Trong phần **Allowed formats**: Chọn `jpg`, `png`, `jpeg`, `gif`, `webp`
4. Trong phần **Format**: Chọn `Auto`
5. Trong phần **Quality**: Chọn `Auto`
6. Trong phần **Max file size**: Đặt `5242880` (5MB)
7. Click **Save**

### Bước 3: Test Upload
Sau khi tạo preset, chạy lại test:
```bash
cd /Users/macbook/Desktop/Code/audiotailoc/dashboard
node scripts/test-cloudinary.js
```

## 🔧 Cấu hình Dashboard

Dashboard đã được cấu hình với:
- ✅ Cloudinary service (`lib/cloudinary.ts`)
- ✅ Image upload component (`components/ui/image-upload.tsx`)
- ✅ Tích hợp vào ProductFormDialog
- ✅ Next.js image configuration (`next.config.ts`)

## 📋 Thông tin cấu hình

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dib7tbv7w
CLOUDINARY_API_KEY=515973253722995
CLOUDINARY_API_SECRET=JHQbBTbJicxxdF7qoJrLUBLYI7w
CLOUDINARY_UPLOAD_PRESET=audio-tailoc
```

## 🎯 Cách sử dụng

1. **Thêm sản phẩm mới**: Click "Thêm sản phẩm" → Upload hình ảnh
2. **Chỉnh sửa sản phẩm**: Click "Chỉnh sửa" → Thay đổi hình ảnh
3. **Hiển thị**: Hình ảnh sẽ tự động hiển thị trong danh sách và chi tiết sản phẩm

## 🐛 Xử lý sự cố

### Lỗi "Upload preset not found"
- Kiểm tra tên preset: phải là `audio-tailoc`
- Đảm bảo Mode là `Unsigned`

### Lỗi "Hostname not configured"
- Đã được fix trong `next.config.ts`
- Restart dashboard nếu cần

### Lỗi "File too large"
- Kiểm tra kích thước file (max 5MB)
- Có thể tăng giới hạn trong upload preset
