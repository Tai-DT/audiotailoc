/**
 * Seed script for FAQs data
 * Run with: npx ts-node prisma/seed-faqs.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FAQData {
    question: string;
    answer: string;
    category: string;
    displayOrder: number;
}

const faqs: FAQData[] = [
    // Mua hàng
    {
        question: 'Làm sao để đặt hàng tại Audio Tài Lộc?',
        answer: 'Bạn có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ hàng, điền thông tin giao hàng và chọn phương thức thanh toán. Hoặc liên hệ hotline 0901.234.567 để được tư vấn và đặt hàng qua điện thoại.',
        category: 'Mua hàng',
        displayOrder: 1,
    },
    {
        question: 'Audio Tài Lộc có nhận đặt hàng từ tỉnh thành khác không?',
        answer: 'Có, chúng tôi giao hàng toàn quốc. Phí vận chuyển sẽ được tính dựa trên khoảng cách và trọng lượng sản phẩm. Đơn hàng trên 500.000đ được miễn phí vận chuyển nội thành TP.HCM.',
        category: 'Mua hàng',
        displayOrder: 2,
    },
    {
        question: 'Tôi có thể thanh toán bằng hình thức nào?',
        answer: 'Chúng tôi hỗ trợ: Thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, thanh toán qua PayOS (VNPay, QR, thẻ ATM/Visa/MasterCard).',
        category: 'Thanh toán',
        displayOrder: 3,
    },
    // Dịch vụ
    {
        question: 'Audio Tài Lộc có dịch vụ lắp đặt tại nhà không?',
        answer: 'Có, chúng tôi có đội ngũ kỹ thuật viên chuyên nghiệp sẽ đến tận nơi khảo sát, tư vấn và lắp đặt. Dịch vụ lắp đặt miễn phí trong bán kính 20km từ cửa hàng cho đơn hàng trên 5 triệu đồng.',
        category: 'Dịch vụ',
        displayOrder: 4,
    },
    {
        question: 'Thời gian khảo sát và lắp đặt mất bao lâu?',
        answer: 'Thời gian khảo sát thường từ 30-60 phút. Thời gian lắp đặt tùy thuộc vào quy mô dự án, từ 2-3 giờ cho hệ thống karaoke gia đình đến 1-2 ngày cho hệ thống âm thanh hội trường.',
        category: 'Dịch vụ',
        displayOrder: 5,
    },
    // Bảo hành
    {
        question: 'Chính sách bảo hành như thế nào?',
        answer: 'Tất cả sản phẩm chính hãng đều được bảo hành từ 12-24 tháng tùy thương hiệu. Bảo hành 1 đổi 1 trong 7 ngày đầu nếu sản phẩm lỗi do nhà sản xuất.',
        category: 'Bảo hành',
        displayOrder: 6,
    },
    {
        question: 'Nếu sản phẩm bị hỏng trong thời gian bảo hành, tôi cần làm gì?',
        answer: 'Bạn liên hệ hotline hoặc mang sản phẩm đến cửa hàng kèm hóa đơn mua hàng. Chúng tôi sẽ kiểm tra và sửa chữa miễn phí trong vòng 7-14 ngày làm việc (tùy tình trạng sản phẩm).',
        category: 'Bảo hành',
        displayOrder: 7,
    },
    // Sản phẩm
    {
        question: 'Làm sao để chọn dàn karaoke phù hợp với diện tích phòng?',
        answer: 'Phòng 15-25m²: Loa 10-12 inch, Amply 200-300W. Phòng 25-40m²: Loa 12-15 inch, Amply 300-500W. Phòng trên 40m²: Nên tư vấn trực tiếp với kỹ thuật viên để có giải pháp tối ưu.',
        category: 'Sản phẩm',
        displayOrder: 8,
    },
    {
        question: 'Audio Tài Lộc có bán thiết bị âm thanh cũ không?',
        answer: 'Hiện tại chúng tôi chỉ kinh doanh sản phẩm mới 100%, chính hãng. Tuy nhiên chúng tôi có chương trình thu cũ đổi mới với giá ưu đãi.',
        category: 'Sản phẩm',
        displayOrder: 9,
    },
    // Hỗ trợ
    {
        question: 'Làm sao để liên hệ với Audio Tài Lộc?',
        answer: 'Bạn có thể liên hệ qua: Hotline: 0901.234.567 (8h-21h hàng ngày), Email: info@audiotailoc.com, Chat trực tiếp trên website, hoặc đến showroom tại địa chỉ.',
        category: 'Hỗ trợ',
        displayOrder: 10,
    },
];

async function main() {
    console.log('❓ Seeding FAQs data...');

    let created = 0;
    let skipped = 0;

    for (const faq of faqs) {
        // Check if FAQ already exists by question
        const existing = await prisma.faqs.findFirst({
            where: { question: faq.question },
        });

        if (existing) {
            console.log(`✓ FAQ "${faq.question.substring(0, 40)}..." already exists`);
            skipped++;
            continue;
        }

        await prisma.faqs.create({
            data: {
                question: faq.question,
                answer: faq.answer,
                category: faq.category,
                displayOrder: faq.displayOrder,
                isActive: true,
            },
        });

        console.log(`✅ Created FAQ: ${faq.question.substring(0, 50)}...`);
        created++;
    }

    console.log(`\n✅ FAQ seeding completed!`);
    console.log(`   - Created: ${created} FAQs`);
    console.log(`   - Skipped: ${skipped} FAQs (already exist)`);
    console.log(`   - Total: ${faqs.length} FAQs`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding FAQs:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
