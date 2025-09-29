import { NextRequest, NextResponse } from 'next/server';

interface ProductSpecifications {
  [key: string]: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  specifications: ProductSpecifications;
  images: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;

  try {
    // Mock product data - in a real app, this would come from a database
    const mockProducts: Record<string, Product> = {
      '1': {
        id: '1',
        name: 'Loa Bluetooth Sony SRS-XB13',
        price: 1200000,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
        category: 'loa',
        description: 'Loa bluetooth di động với âm thanh chất lượng cao, chống nước IP67, thời lượng pin 16 giờ.',
        inStock: true,
        rating: 4.5,
        reviews: 128,
        specifications: {
          'Công suất': '8W',
          'Kích thước': '76 x 95 x 76 mm',
          'Trọng lượng': '253g',
          'Pin': '16 giờ',
          'Kết nối': 'Bluetooth 5.0',
          'Chống nước': 'IP67'
        },
        images: [
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
          'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        ]
      },
      '2': {
        id: '2',
        name: 'Microphone AKG C214',
        price: 8500000,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        category: 'mic',
        description: 'Microphone condenser chuyên nghiệp cho thu âm và biểu diễn với chất lượng âm thanh tuyệt vời.',
        inStock: true,
        rating: 4.8,
        reviews: 89,
        specifications: {
          'Type': 'Large-diaphragm condenser',
          'Polar Pattern': 'Cardioid',
          'Frequency Response': '20Hz - 20kHz',
          'Sensitivity': '20 mV/Pa',
          'Max SPL': '156 dB',
          'Dynamic Range': '136 dB'
        },
        images: [
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
          'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800'
        ]
      },
      '3': {
        id: '3',
        name: 'Mixer Yamaha MG10XU',
        price: 6500000,
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
        category: 'mixer',
        description: 'Mixer 10 kênh với USB interface, SPX effects và chất lượng âm thanh chuyên nghiệp.',
        inStock: true,
        rating: 4.6,
        reviews: 156,
        specifications: {
          'Channels': '10 (4 mono + 3 stereo)',
          'Effects': 'SPX Digital Effects',
          'USB': 'USB 2.0 interface',
          'Phantom Power': '+48V',
          'EQ': '3-band EQ per channel',
          'Dimensions': '244 x 71 x 294 mm'
        },
        images: [
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        ]
      },
      '4': {
        id: '4',
        name: 'Amplifier Crown XLi 800',
        price: 12000000,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        category: 'amplifiers',
        description: 'Power amplifier 2 kênh với công suất 300W/kênh, thiết kế chắc chắn cho sân khấu chuyên nghiệp.',
        inStock: true,
        rating: 4.7,
        reviews: 73,
        specifications: {
          'Power Output': '300W per channel @ 4Ω',
          'Channels': '2',
          'Input Sensitivity': '0.775V or 1.4V',
          'Frequency Response': '20Hz - 20kHz',
          'THD': '< 0.5%',
          'Weight': '11.3 kg'
        },
        images: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800'
        ]
      }
    };

    const product = mockProducts[productId];

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
