# Quick Start Guide 🚀

Hướng dẫn nhanh để bắt đầu với Auto Media Editor.

## 📋 Yêu cầu hệ thống

- Python 3.8+
- FFmpeg
- 4GB RAM (khuyến nghị 8GB+)
- GPU (tùy chọn, cho AI models)

## ⚡ Cài đặt nhanh

### 1. Clone repository
```bash
git clone https://github.com/your-username/auto-media-editor.git
cd auto-media-editor
```

### 2. Cài đặt dependencies
```bash
# Cài đặt Python dependencies
pip install -r requirements.txt

# Cài đặt FFmpeg
# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Tải từ https://ffmpeg.org/download.html
```

### 3. Kiểm tra cài đặt
```bash
python -m src.main --help
```

## 🎯 Sử dụng cơ bản

### Xử lý ảnh
```bash
# Cải thiện chất lượng ảnh
python -m src.main image enhance input.jpg output.jpg --level medium

# Xóa nền
python -m src.main image remove-background input.jpg output.png

# Xử lý với nhiều tùy chọn
python -m src.main image process input.jpg output.jpg --enhance --remove-bg --enhance-faces
```

### Chỉnh sửa video
```bash
# Ổn định video
python -m src.main video edit input.mp4 output.mp4 --stabilize

# Tự động cắt cảnh
python -m src.main video edit input.mp4 output.mp4 --auto-cut

# Điều chỉnh tốc độ
python -m src.main video edit input.mp4 output.mp4 --speed 1.5
```

### Ghép nhạc
```bash
# Thêm nhạc nền
python -m src.main audio mix video.mp4 music.mp3 output.mp4 --volume 0.3
```

### Xử lý hàng loạt
```bash
# Xử lý nhiều ảnh
python -m src.main batch input_folder/ output_folder/ --type image --enhance

# Xử lý nhiều video
python -m src.main batch input_folder/ output_folder/ --type video
```

## 🌐 Giao diện web

Khởi động giao diện web:
```bash
python -m src.main web
```

Truy cập: http://localhost:8080

## 📖 Ví dụ chi tiết

Chạy các ví dụ có sẵn:
```bash
python examples/basic_usage.py
```

## 🔧 Cấu hình

Chỉnh sửa file `config/settings.yaml` để tùy chỉnh:
- Chất lượng output
- Sử dụng GPU
- Cài đặt AI models
- Cấu hình xử lý

## 🐛 Xử lý lỗi thường gặp

### Lỗi FFmpeg
```bash
# Kiểm tra FFmpeg
ffmpeg -version

# Cài đặt lại nếu cần
sudo apt install ffmpeg
```

### Lỗi memory
- Giảm `max_workers` trong config
- Xử lý file nhỏ hơn
- Đóng các ứng dụng khác

### Lỗi GPU
- Cài đặt CUDA drivers
- Hoặc set `use_gpu: false` trong config

## 📞 Hỗ trợ

- 📧 Email: contact@automediaeditor.com
- 🐛 Issues: https://github.com/your-username/auto-media-editor/issues
- 📖 Docs: https://github.com/your-username/auto-media-editor#readme

## 🎉 Chúc mừng!

Bạn đã sẵn sàng sử dụng Auto Media Editor! 🎬🎵🖼️