import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI?: GoogleGenerativeAI;
  private model?: any;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not configured');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.logger.log('Gemini AI service initialized');
  }

  async generateResponse(prompt: string, context?: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini service not properly initialized');
    }

    try {
      const fullPrompt = context 
        ? `Context về sản phẩm Audio Tài Lộc:\n${context}\n\nCâu hỏi của khách hàng: ${prompt}\n\nHãy trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp. Nếu có thông tin sản phẩm liên quan, hãy giới thiệu cụ thể.`
        : `Bạn là trợ lý AI của Audio Tài Lộc - cửa hàng thiết bị âm thanh chuyên nghiệp. Hãy trả lời câu hỏi sau bằng tiếng Việt một cách thân thiện và chuyên nghiệp:\n\n${prompt}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Failed to generate Gemini response:', error);
      throw new Error('Không thể tạo phản hồi AI. Vui lòng thử lại sau.');
    }
  }

  async generateProductRecommendation(query: string, products: any[]): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini service not properly initialized');
    }

    try {
      const productContext = products.map(p => 
        `- ${p.name}: ${p.description || ''} (Giá: ${(p.priceCents / 100).toLocaleString('vi-VN')} VNĐ)`
      ).join('\n');

      const prompt = `
Bạn là chuyên gia tư vấn thiết bị âm thanh của Audio Tài Lộc. 
Khách hàng tìm kiếm: "${query}"

Danh sách sản phẩm có sẵn:
${productContext}

Hãy:
1. Phân tích nhu cầu của khách hàng
2. Giới thiệu 2-3 sản phẩm phù hợp nhất
3. Giải thích tại sao những sản phẩm này phù hợp
4. Đưa ra lời khuyên về cách sử dụng
5. Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp

Lưu ý: Chỉ giới thiệu các sản phẩm có trong danh sách trên.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Failed to generate product recommendation:', error);
      throw new Error('Không thể tạo gợi ý sản phẩm. Vui lòng thử lại sau.');
    }
  }

  async generateProductDescription(product: any): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini service not properly initialized');
    }

    try {
      const prompt = `
Hãy tạo mô tả chi tiết và hấp dẫn cho sản phẩm âm thanh sau:

Tên sản phẩm: ${product.name}
Mô tả hiện tại: ${product.description || 'Không có mô tả'}
Giá: ${(product.priceCents / 100).toLocaleString('vi-VN')} VNĐ
Danh mục: ${product.category || 'Thiết bị âm thanh'}

Yêu cầu:
1. Viết bằng tiếng Việt
2. Tập trung vào chất lượng âm thanh và công nghệ
3. Nêu bật ưu điểm và tính năng nổi bật
4. Phù hợp với thị trường Việt Nam
5. Tạo cảm giác tin tưởng và muốn mua
6. Độ dài khoảng 150-200 từ

Tránh sử dụng từ ngữ quá kỹ thuật, giữ phong cách thân thiện.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Failed to generate product description:', error);
      throw new Error('Không thể tạo mô tả sản phẩm. Vui lòng thử lại sau.');
    }
  }

  async generateSearchKeywords(query: string): Promise<string[]> {
    if (!this.model) {
      throw new Error('Gemini service not properly initialized');
    }

    try {
      const prompt = `
Từ câu truy vấn tìm kiếm: "${query}"

Hãy tạo ra 5-7 từ khóa liên quan để tìm kiếm sản phẩm âm thanh, bao gồm:
1. Từ khóa chính từ câu gốc
2. Từ đồng nghĩa
3. Từ tiếng Anh tương ứng
4. Thuật ngữ kỹ thuật liên quan

Trả về dưới dạng danh sách, mỗi từ khóa trên một dòng, chỉ có từ khóa không có dấu đầu dòng.
Ví dụ:
tai nghe
headphone
âm thanh
chất lượng cao
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text()
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line && !line.startsWith('-') && !line.startsWith('*'))
        .slice(0, 7);
    } catch (error) {
      this.logger.error('Failed to generate search keywords:', error);
      return [query]; // Fallback to original query
    }
  }
}
