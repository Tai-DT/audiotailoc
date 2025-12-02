import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface Testimonial {
  id: string;
  name: string;
  position?: string;
  company?: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTestimonials(): Promise<Testimonial[]> {
    try {
      // Try to get testimonials from database first
      const dbTestimonials = await this.prisma.testimonials.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      });

      if (dbTestimonials.length > 0) {
        return dbTestimonials.map(testimonial => ({
          id: testimonial.id,
          name: testimonial.name,
          position: testimonial.position || undefined,
          company: testimonial.company || undefined,
          content: testimonial.content,
          avatarUrl: testimonial.avatarUrl || undefined,
          rating: testimonial.rating,
          isActive: testimonial.isActive,
          displayOrder: testimonial.displayOrder,
          createdAt: testimonial.createdAt.toISOString(),
          updatedAt: testimonial.updatedAt.toISOString(),
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch testimonials from database:', error);
    }

    // Fallback to default testimonials
    return this.getDefaultTestimonials();
  }

  private getDefaultTestimonials(): Testimonial[] {
    return [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        position: 'Giám đốc kỹ thuật',
        company: 'Công ty ABC',
        content: 'Dịch vụ âm thanh của Audio Tài Lộc rất chuyên nghiệp. Đội ngũ kỹ thuật giàu kinh nghiệm, thiết bị hiện đại, giá cả hợp lý. Rất hài lòng với chất lượng phục vụ.',
        avatarUrl: undefined,
        rating: 5,
        isActive: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Trần Thị B',
        position: 'Chủ quán karaoke',
        company: 'Quán Karaoke XYZ',
        content: 'Đã sử dụng dịch vụ setup hệ thống âm thanh cho quán karaoke. Âm thanh chất lượng cao, cân bằng tốt. Khách hàng rất thích, doanh thu tăng đáng kể.',
        avatarUrl: undefined,
        rating: 5,
        isActive: true,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Lê Văn C',
        position: 'Nhà sản xuất sự kiện',
        company: 'Sự kiện 123',
        content: 'Hợp tác với Audio Tài Lộc cho nhiều sự kiện lớn. Luôn đảm bảo chất lượng âm thanh, setup nhanh chóng, hỗ trợ tận tình. Đối tác đáng tin cậy.',
        avatarUrl: undefined,
        rating: 5,
        isActive: true,
        displayOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}