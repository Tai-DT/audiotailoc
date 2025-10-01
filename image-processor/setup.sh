#!/bin/bash

# Image Processor Setup Script for Audio Tài Lộc
echo "🎨 Setting up Image Processor for Audio Tài Lộc..."

# Install Node.js dependencies
echo "📦 Installing dependencies..."
cd /Users/macbook/Desktop/audiotailoc/image-processor
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Usage Instructions:"
echo "====================="
echo ""
echo "1. Put your product images in:"
echo "   frontend/public/images/products/original/"
echo ""
echo "2. Run the processor:"
echo "   npm run process"
echo ""
echo "3. Or with custom options:"
echo "   node process-images.js --position top-left --size 60x60"
echo ""
echo "🎛️ Available options:"
echo "   --logo <path>      : Path to logo file"
echo "   --input <dir>      : Input directory"
echo "   --output <dir>     : Output directory"
echo "   --position <pos>   : Logo position (top-left, top-right, bottom-left, bottom-right, center)"
echo "   --size <WxH>       : Logo size (e.g., 80x80)"
echo ""
echo "🎯 The processor will:"
echo "   • Remove white/solid backgrounds"
echo "   • Create transparent PNG files"
echo "   • Add your logo watermark"
echo "   • Save processed images with '_final' suffix"
echo ""