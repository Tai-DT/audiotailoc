const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ImageProcessor {
  constructor(options = {}) {
    this.logoPath = options.logoPath || '../frontend/public/images/logo/logo-dark.svg';
    this.inputDir = options.inputDir || '../frontend/public/images/products/original';
    this.outputDir = options.outputDir || '../frontend/public/images/products/processed';
    this.logoSize = options.logoSize || { width: 100, height: 100 };
    this.logoPosition = options.logoPosition || 'bottom-right';
    this.logoOpacity = options.logoOpacity || 0.8;
  }

  async ensureDirectories() {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }

  async removeBackground(inputPath, outputPath) {
    try {
      console.log(`Processing: ${inputPath}`);
      
      // Read the input image
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // Simple background removal using Sharp (for white/solid backgrounds)
      // For more complex background removal, you'd need AI models
      const processed = await image
        .removeAlpha() // Remove existing alpha channel
        .flatten({ background: { r: 255, g: 255, b: 255 } }) // Flatten with white background
        .threshold(240) // Convert to binary (adjust threshold as needed)
        .negate() // Invert colors
        .png() // Convert to PNG for transparency support
        .toBuffer();

      // Create a mask from the processed image
      const mask = await sharp(processed)
        .greyscale()
        .normalise()
        .toBuffer();

      // Apply the mask to create transparency
      const result = await sharp(inputPath)
        .joinChannel(mask)
        .png()
        .toBuffer();

      await fs.writeFile(outputPath, result);
      console.log(`✅ Background removed: ${outputPath}`);
      
      return outputPath;
    } catch (error) {
      console.error(`❌ Error removing background from ${inputPath}:`, error.message);
      throw error;
    }
  }

  async addLogo(imagePath, outputPath) {
    try {
      console.log(`Adding logo to: ${imagePath}`);
      
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      
      // Prepare logo
      let logo = sharp(this.logoPath);
      
      // Resize logo
      if (this.logoPath.endsWith('.svg')) {
        logo = logo.resize(this.logoSize.width, this.logoSize.height);
      } else {
        logo = logo.resize(this.logoSize.width, this.logoSize.height, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        });
      }

      // Calculate logo position
      let left, top;
      const margin = 20;
      
      switch (this.logoPosition) {
        case 'top-left':
          left = margin;
          top = margin;
          break;
        case 'top-right':
          left = metadata.width - this.logoSize.width - margin;
          top = margin;
          break;
        case 'bottom-left':
          left = margin;
          top = metadata.height - this.logoSize.height - margin;
          break;
        case 'bottom-right':
          left = metadata.width - this.logoSize.width - margin;
          top = metadata.height - this.logoSize.height - margin;
          break;
        case 'center':
          left = Math.floor((metadata.width - this.logoSize.width) / 2);
          top = Math.floor((metadata.height - this.logoSize.height) / 2);
          break;
        default:
          left = metadata.width - this.logoSize.width - margin;
          top = metadata.height - this.logoSize.height - margin;
      }

      // Composite logo onto image
      const result = await image
        .composite([{
          input: await logo.png().toBuffer(),
          left: Math.max(0, left),
          top: Math.max(0, top),
          blend: 'over'
        }])
        .png()
        .toBuffer();

      await fs.writeFile(outputPath, result);
      console.log(`✅ Logo added: ${outputPath}`);
      
      return outputPath;
    } catch (error) {
      console.error(`❌ Error adding logo to ${imagePath}:`, error.message);
      throw error;
    }
  }

  async processImage(inputPath, options = {}) {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const extension = '.png'; // Always output as PNG for transparency
    
    // Step 1: Remove background
    const noBgPath = path.join(this.outputDir, `${filename}_no_bg${extension}`);
    await this.removeBackground(inputPath, noBgPath);
    
    // Step 2: Add logo
    if (options.addLogo !== false) {
      const finalPath = path.join(this.outputDir, `${filename}_final${extension}`);
      await this.addLogo(noBgPath, finalPath);
      return finalPath;
    }
    
    return noBgPath;
  }

  async processAllImages(options = {}) {
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.inputDir);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|webp|tiff|bmp)$/i.test(file)
      );
      
      if (imageFiles.length === 0) {
        console.log('📁 No images found in input directory');
        return [];
      }
      
      console.log(`🚀 Processing ${imageFiles.length} images...`);
      const results = [];
      
      for (const file of imageFiles) {
        try {
          const inputPath = path.join(this.inputDir, file);
          const outputPath = await this.processImage(inputPath, options);
          results.push({
            input: inputPath,
            output: outputPath,
            success: true
          });
        } catch (error) {
          console.error(`❌ Failed to process ${file}:`, error.message);
          results.push({
            input: path.join(this.inputDir, file),
            output: null,
            success: false,
            error: error.message
          });
        }
      }
      
      const successful = results.filter(r => r.success).length;
      console.log(`\n📊 Processing complete: ${successful}/${results.length} images processed successfully`);
      
      return results;
    } catch (error) {
      console.error('❌ Error reading input directory:', error.message);
      throw error;
    }
  }

  // Advanced background removal using edge detection
  async removeBackgroundAdvanced(inputPath, outputPath) {
    try {
      console.log(`Advanced processing: ${inputPath}`);
      
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // Create edge detection mask
      const edges = await image
        .clone()
        .greyscale()
        .convolve({
          width: 3,
          height: 3,
          kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
        })
        .threshold(50)
        .blur(1)
        .toBuffer();
      
      // Use edges to create alpha mask
      const result = await image
        .joinChannel(edges)
        .png()
        .toBuffer();
      
      await fs.writeFile(outputPath, result);
      console.log(`✅ Advanced background removed: ${outputPath}`);
      
      return outputPath;
    } catch (error) {
      console.error(`❌ Advanced processing error:`, error.message);
      throw error;
    }
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);
  
  const options = {
    logoPath: '../frontend/public/images/logo/logo-dark.svg',
    inputDir: '../frontend/public/images/products/original',
    outputDir: '../frontend/public/images/products/processed',
    logoSize: { width: 80, height: 80 },
    logoPosition: 'bottom-right',
    logoOpacity: 0.8
  };
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    
    switch (key) {
      case '--logo':
        options.logoPath = value;
        break;
      case '--input':
        options.inputDir = value;
        break;
      case '--output':
        options.outputDir = value;
        break;
      case '--position':
        options.logoPosition = value;
        break;
      case '--size':
        const [width, height] = value.split('x').map(Number);
        options.logoSize = { width, height };
        break;
    }
  }
  
  console.log('🎨 Audio Tài Lộc - Image Processor');
  console.log('=====================================');
  console.log('Configuration:');
  console.log(`📁 Input: ${options.inputDir}`);
  console.log(`📁 Output: ${options.outputDir}`);
  console.log(`🏷️ Logo: ${options.logoPath}`);
  console.log(`📏 Logo Size: ${options.logoSize.width}x${options.logoSize.height}`);
  console.log(`📍 Logo Position: ${options.logoPosition}`);
  console.log('=====================================\n');
  
  const processor = new ImageProcessor(options);
  
  try {
    await processor.processAllImages();
    console.log('\n🎉 All done! Check the output directory for processed images.');
  } catch (error) {
    console.error('\n💥 Processing failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ImageProcessor;