import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductUpdate {
  id: string;
  name: string;
  brand: string;
  model: string;
  sku: string;
  images?: string[];
  features?: string;
  warranty?: string;
  description?: string;
  specifications?: Record<string, string>;
}

const productUpdates: ProductUpdate[] = [
  {
    id: "cmf9f43ne00013kav7mh39xoe",
    name: "Test Product",
    brand: "AudioTailoc",
    model: "TP-001",
    sku: "ATP-TEST-001",
    features: "High quality audio, Durable construction, Easy to use",
    warranty: "12 months",
    description: "A comprehensive test product showcasing all features of our audio equipment line.",
    specifications: {
      "Power Output": "50W RMS",
      "Frequency Response": "20Hz - 20kHz",
      "Impedance": "8 ohms",
      "Dimensions": "200x150x100mm",
      "Weight": "2.5kg",
      "Connectivity": "Bluetooth 5.0, AUX, USB"
    }
  },
  {
    id: "cmf8wylks0003tyk8y1tjjsrx",
    name: "Import Test Product",
    brand: "AudioTailoc",
    model: "ITP-001",
    sku: "ATP-IMPORT-001",
    images: ["https://picsum.photos/400/400?random=1"],
    features: "Premium quality, Imported materials, Professional grade",
    warranty: "24 months",
    description: "High-quality imported audio product designed for professional use.",
    specifications: {
      "Origin": "Germany",
      "Material": "Premium Aluminum",
      "Power Rating": "100W",
      "Signal-to-Noise Ratio": "95dB",
      "Total Harmonic Distortion": "<0.05%",
      "Input Voltage": "220V/50Hz",
      "Operating Temperature": "0°C to 40°C"
    }
  },
  {
    id: "cmf8vxonf0001h2rxn6y4h8xo",
    name: "Test Product Dashboard",
    brand: "AudioTailoc",
    model: "TPD-001",
    sku: "ATP-DASH-001",
    images: ["https://picsum.photos/400/400?random=2"],
    features: "Dashboard optimized, User-friendly interface, Advanced controls",
    warranty: "12 months",
    description: "Dashboard-optimized audio product with intuitive controls and professional features.",
    specifications: {
      "Display": "2.4-inch LCD",
      "Control Type": "Touch + Buttons",
      "Battery Life": "8 hours",
      "Charging Time": "2 hours",
      "Wireless Range": "10 meters",
      "Supported Formats": "MP3, WAV, FLAC",
      "Memory Capacity": "32GB internal"
    }
  },
  {
    id: "cmf8usprk000cymqbvpdd0vvp",
    name: "Soundbar Tài Lộc 5.1",
    brand: "Tài Lộc Audio",
    model: "SB-51-TL",
    sku: "TL-SB-51-001",
    images: ["https://picsum.photos/600/300?random=3"],
    features: "5.1 surround sound, Wireless subwoofer, Bluetooth connectivity, HDMI ARC, Optical input",
    warranty: "24 months",
    description: "Premium 5.1 soundbar system delivering immersive surround sound experience for your home entertainment.",
    specifications: {
      "Configuration": "5.1 Channel",
      "Total Power": "300W RMS",
      "Subwoofer Power": "150W",
      "Frequency Response": "35Hz - 20kHz",
      "Connectivity": "HDMI ARC, Optical, Bluetooth 5.0, AUX",
      "Supported Formats": "Dolby Digital, DTS, Dolby Atmos",
      "Dimensions (Main)": "1000x60x100mm",
      "Dimensions (Sub)": "200x350x300mm",
      "Weight (Main)": "3.2kg",
      "Weight (Sub)": "8.5kg"
    }
  },
  {
    id: "cmf8uspoj0008ymqbgm373cr6",
    name: "Tai nghe Tài Lộc Pro",
    brand: "Tài Lộc Audio",
    model: "HP-PRO-TL",
    sku: "TL-HP-PRO-001",
    images: ["https://picsum.photos/400/400?random=4"],
    features: "Noise cancellation, Premium drivers, Comfortable fit, Long battery life, Wireless charging",
    warranty: "18 months",
    description: "Professional-grade wireless headphones with active noise cancellation and premium sound quality.",
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "10Hz - 40kHz",
      "Impedance": "32 ohms",
      "Sensitivity": "105dB",
      "Noise Cancellation": "Active ANC",
      "Battery Life": "30 hours (ANC on), 40 hours (ANC off)",
      "Charging Time": "2 hours",
      "Weight": "320g",
      "Connectivity": "Bluetooth 5.2, USB-C",
      "Codecs": "aptX HD, AAC, SBC",
      "Microphone": "Built-in with noise reduction"
    }
  },
  {
    id: "cmf8uspio0004ymqbkze4p775",
    name: "Loa Tài Lộc Classic",
    brand: "Tài Lộc Audio",
    model: "SP-CL-TL",
    sku: "TL-SP-CL-001",
    images: ["https://picsum.photos/400/400?random=5"],
    features: "Classic design, High-fidelity sound, Wooden enclosure, Multiple inputs, Remote control",
    warranty: "36 months",
    description: "Classic bookshelf speakers with timeless design and exceptional sound quality for audiophiles.",
    specifications: {
      "Configuration": "2-way bookshelf",
      "Power Handling": "150W RMS",
      "Frequency Response": "45Hz - 25kHz",
      "Sensitivity": "88dB",
      "Impedance": "8 ohms",
      "Drivers": "6.5\" woofer + 1\" tweeter",
      "Enclosure": "Bass reflex",
      "Material": "MDF wood with walnut veneer",
      "Dimensions": "220x320x280mm",
      "Weight": "7.8kg per speaker",
      "Inputs": "Binding posts, Bi-wire capable",
      "Recommended Amp Power": "30-150W"
    }
  }
];

async function populateProductData() {
  console.log('🚀 Starting product data population...');

  let updatedCount = 0;
  let errorCount = 0;

  for (const productUpdate of productUpdates) {
    try {
      console.log(`📝 Updating product: ${productUpdate.name}`);

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: productUpdate.id }
      });

      if (!existingProduct) {
        console.log(`❌ Product not found: ${productUpdate.id}`);
        errorCount++;
        continue;
      }

      // Prepare update data
      const updateData: any = {
        brand: productUpdate.brand,
        model: productUpdate.model,
        sku: productUpdate.sku,
        features: productUpdate.features,
        warranty: productUpdate.warranty,
        description: productUpdate.description || existingProduct.description,
      };

      // Only update images if provided and current images is null
      if (productUpdate.images && !existingProduct.images) {
        updateData.images = JSON.stringify(productUpdate.images);
        updateData.imageUrl = productUpdate.images[0];
      }

      // Add specifications if provided
      if (productUpdate.specifications) {
        updateData.specifications = JSON.stringify(productUpdate.specifications);
      }

      // Update the product directly with Prisma
      await prisma.product.update({
        where: { id: productUpdate.id },
        data: updateData
      });

      console.log(`✅ Successfully updated: ${productUpdate.name}`);
      updatedCount++;

    } catch (error) {
      console.error(`❌ Error updating product ${productUpdate.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Population Summary:`);
  console.log(`✅ Successfully updated: ${updatedCount} products`);
  console.log(`❌ Errors: ${errorCount} products`);

  if (updatedCount > 0) {
    console.log('\n🎉 Product data population completed!');
    console.log('💡 You can now view the updated products in your dashboard.');
  }
}

async function main() {
  try {
    await populateProductData();
  } catch (error) {
    console.error('💥 Script execution failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { populateProductData };
