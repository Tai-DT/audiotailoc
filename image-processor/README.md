# 🎨 Audio Tài Lộc - Image Processor

Công cụ xử lý hình ảnh sản phẩm chuyên nghiệp cho Audio Tài Lộc - Xóa nền và thêm logo tự động.

## ✨ Tính năng

- 🖼️ **Xóa nền tự động** - Loại bỏ background trắng/đơn sắc
- 🏷️ **Thêm logo** - Watermark logo tự động với nhiều vị trí
- 🎨 **Tạo background trong suốt** - Export PNG với alpha channel
- ⚡ **Xử lý hàng loạt** - Process nhiều ảnh cùng lúc
- 🌐 **Web interface** - Giao diện web thân thiện
- 📱 **Responsive** - Hoạt động trên mọi thiết bị

## 🚀 Cách sử dụng

### Phương pháp 1: Web Interface (Khuyến nghị)

1. **Mở web interface:**
   ```bash
   cd /Users/macbook/Desktop/audiotailoc/image-processor
   open index.html
   ```

2. **Upload hình ảnh:**
   - Kéo thả files vào vùng upload
   - Hoặc click để chọn files
   - Hỗ trợ: JPG, PNG, WebP (tối đa 10MB)

3. **Cấu hình:**
   - **Vị trí logo:** Góc dưới phải, trên trái, v.v.
   - **Kích thước:** 60px đến 120px
   - **Độ trong suốt:** 30% đến 100%
   - **Logo tùy chọn:** Upload logo riêng

4. **Xử lý:**
   - Click "🚀 Xử lý hình ảnh"
   - Chờ processing hoàn tất
   - Download từng ảnh hoặc tất cả

### Phương pháp 2: Command Line

1. **Setup:**
   ```bash
   ./setup.sh
   ```

2. **Chuẩn bị ảnh:**
   ```bash
   # Copy ảnh gốc vào thư mục input
   cp your-images/* frontend/public/images/products/original/
   ```

3. **Chạy processor:**
   ```bash
   npm run process
   ```

4. **Tùy chọn nâng cao:**
   ```bash
   # Logo góc trên trái, size 60x60
   node process-images.js --position top-left --size 60x60
   
   # Sử dụng logo khác
   node process-images.js --logo path/to/your/logo.png
   
   # Thư mục khác
   node process-images.js --input /path/to/input --output /path/to/output
   ```

## 📁 Cấu trúc thư mục

```
image-processor/
├── index.html              # Web interface
├── process-images.js       # Node.js processor
├── package.json           # Dependencies
├── setup.sh              # Setup script
└── README.md             # Hướng dẫn này

frontend/public/images/
├── logo/                  # Logo files
│   ├── logo-dark.svg
│   └── logo-light.svg
└── products/
    ├── original/          # Ảnh gốc (input)
    └── processed/         # Ảnh đã xử lý (output)
```

## ⚙️ Tùy chọn cấu hình

### Vị trí logo:
- `top-left` - Góc trên trái
- `top-right` - Góc trên phải  
- `bottom-left` - Góc dưới trái
- `bottom-right` - Góc dưới phải (mặc định)
- `center` - Giữa ảnh

### Kích thước logo:
- `60x60` - Nhỏ
- `80x80` - Vừa (mặc định)
- `100x100` - Lớn
- `120x120` - Rất lớn

### Độ trong suốt:
- `0.3` - 30% (mờ nhất)
- `0.8` - 80% (mặc định)
- `1.0` - 100% (đậm nhất)

## 🎯 Quy trình xử lý

1. **Load ảnh gốc** - Đọc file JPG/PNG
2. **Phân tích background** - Detect nền trắng/đơn sắc
3. **Tạo mask** - Tạo alpha channel cho transparency
4. **Xóa nền** - Apply mask để loại bỏ background
5. **Thêm logo** - Composite logo với vị trí và opacity chỉ định
6. **Export PNG** - Lưu với format PNG để giữ transparency

## 🛠️ Kỹ thuật

### Web Version:
- **HTML5 Canvas** - Xử lý ảnh client-side
- **JavaScript ES6+** - Modern browser features
- **CSS Grid/Flexbox** - Responsive layout
- **Drag & Drop API** - Intuitive file upload

### Node.js Version:
- **Sharp** - High-performance image processing
- **Canvas** - 2D graphics and compositing
- **Edge Detection** - Advanced background removal
- **Batch Processing** - Multiple files handling

## 🔧 Troubleshooting

### Web version không hoạt động:
- Kiểm tra browser hỗ trợ HTML5 Canvas
- Đảm bảo JavaScript được enable
- File size không quá 10MB

### Node.js version lỗi:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (cần >= 14)
node --version
```

### Logo không hiển thị:
- Kiểm tra đường dẫn logo file
- Đảm bảo file format hỗ trợ (PNG, JPG, SVG)
- Check quyền đọc file

### Background không được xóa sạch:
- Sử dụng ảnh có nền trắng hoặc đơn sắc
- Điều chỉnh threshold trong code
- Thử advanced processing mode

## 🎨 Tips để có kết quả tốt nhất

1. **Ảnh gốc chất lượng:**
   - Resolution cao (tối thiểu 800x800px)
   - Nền trắng hoặc đơn sắc
   - Sản phẩm rõ nét, không mờ

2. **Logo design:**
   - Vector format (SVG) cho chất lượng tốt nhất
   - Background trong suốt
   - Contrast tốt với sản phẩm

3. **Vị trí logo:**
   - Tránh che khuất chi tiết quan trọng
   - Góc dưới phải thường work tốt nhất
   - Size 80-100px là optimal

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Check console log cho error details
2. Verify file formats và sizes
3. Test với ảnh đơn giản trước
4. Contact team để support

## 🚀 Phát triển tiếp

Planned features:
- [ ] AI-powered background removal
- [ ] Batch logo placement optimization  
- [ ] Integration với backend API
- [ ] Mobile app version
- [ ] Cloud processing option

---

**Audio Tài Lộc** - Chuyên nghiệp hóa hình ảnh sản phẩm! 🎵🔊