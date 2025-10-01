#!/bin/bash

# Integration script for Audio Tài Lộc Image Processor
echo "🔗 Integrating Image Processor with Frontend..."

# Create symlinks for easy access
FRONTEND_DIR="/Users/macbook/Desktop/audiotailoc/frontend"
PROCESSOR_DIR="/Users/macbook/Desktop/audiotailoc/image-processor"

# Create processor access in frontend
if [ ! -L "$FRONTEND_DIR/image-processor" ]; then
    ln -s "$PROCESSOR_DIR" "$FRONTEND_DIR/image-processor"
    echo "✅ Created symlink: frontend/image-processor"
fi

# Copy processed images to public directory
if [ -d "$PROCESSOR_DIR/../frontend/public/images/products/processed" ]; then
    echo "📁 Processed images available in: frontend/public/images/products/processed"
fi

echo ""
echo "🎯 Quick Start Guide:"
echo "===================="
echo ""
echo "1. Web Interface:"
echo "   cd image-processor && open index.html"
echo ""
echo "2. Command Line:"
echo "   cd image-processor && npm run process"
echo ""
echo "3. Access from Frontend:"
echo "   Use processed images in: /images/products/processed/"
echo ""
echo "📝 Example usage in React:"
echo ""
echo "   <img "
echo "     src=\"/images/products/processed/product_final.png\""
echo "     alt=\"Product with transparent background\""
echo "     className=\"product-image\""
echo "   />"
echo ""
echo "🎨 The processor will:"
echo "   • Remove white/solid backgrounds"
echo "   • Add Audio Tài Lộc logo watermark"  
echo "   • Create transparent PNG files"
echo "   • Optimize for web display"
echo ""