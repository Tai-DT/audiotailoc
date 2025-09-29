/*
  Product Reviews Seed Script - Tạo dữ liệu reviews cho các sản phẩm
  Usage: npx ts-node src/seed-product-reviews.ts
*/
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Seeding product reviews...');

  // Get all products
  const products = await prisma.products.findMany({
    where: { isDeleted: false, isActive: true },
    take: 50 // Limit to first 50 products
  });

  if (products.length === 0) {
    console.log('❌ No products found. Please seed products first.');
    return;
  }

  console.log(`📦 Found ${products.length} products to create reviews for`);

  // Create or get some users for reviews
  const users = [];
  for (let i = 1; i <= 10; i++) {
    let user = await prisma.users.findFirst({
      where: { email: `reviewer${i}@example.com` }
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          id: `user_${i}`,
          email: `reviewer${i}@example.com`,
          password: '$2a$10$PasswordHashHere', // Use bcrypt hash in production
          name: `Reviewer ${i}`,
          role: 'USER',
          updatedAt: new Date()
        }
      });
    }

    users.push(user);
  }

  console.log(`👥 Using ${users.length} users to create reviews`);

  // Sample review templates
  const reviewTemplates = [
    {
      title: 'Sản phẩm tuyệt vời, chất lượng cao!',
      comments: [
        'Tôi rất hài lòng với sản phẩm này. Âm thanh rất rõ ràng và chi tiết.',
        'Chất lượng build rất tốt, xứng đáng với giá tiền bỏ ra.',
        'Dễ dàng setup và sử dụng. Rất recommend cho người mới bắt đầu.',
        'Âm thanh hay hơn nhiều so với expectation. Bass rất mạnh và sâu.',
        'Thiết kế đẹp, phù hợp với không gian phòng khách hiện đại.'
      ]
    },
    {
      title: 'Giá trị tốt cho tiền bỏ ra',
      comments: [
        'Với mức giá này, đây là lựa chọn tốt nhất trên thị trường.',
        'Chất lượng âm thanh vượt trội so với các sản phẩm cùng phân khúc.',
        'Đã sử dụng được 3 tháng, hoạt động ổn định, không có vấn đề gì.',
        'Âm thanh balanced, phù hợp với nhiều thể loại nhạc khác nhau.',
        'Bảo hành và dịch vụ hậu mãi rất tốt từ Audio Tài Lộc.'
      ]
    },
    {
      title: 'Âm thanh xuất sắc',
      comments: [
        'Âm thanh trong trẻo, chi tiết cao, bass sâu và mạnh mẽ.',
        'Mid và treble rất rõ ràng, không bị chói hay mờ.',
        'Phù hợp cho cả nghe nhạc và xem phim.',
        'Có thể điều chỉnh EQ để phù hợp với sở thích cá nhân.',
        'So với các sản phẩm khác cùng giá, đây là lựa chọn tốt nhất.'
      ]
    },
    {
      title: 'Dễ sử dụng, phù hợp với người mới',
      comments: [
        'Giao diện đơn giản, dễ thao tác và điều chỉnh.',
        'Hướng dẫn sử dụng rõ ràng, setup nhanh chóng.',
        'Có nhiều preset âm thanh cho người mới sử dụng.',
        'Kết nối bluetooth ổn định, không bị lag.',
        'Phù hợp cho gia đình có trẻ em sử dụng.'
      ]
    },
    {
      title: 'Thiết kế đẹp, chất lượng cao',
      comments: [
        'Thiết kế sang trọng, phù hợp với nội thất hiện đại.',
        'Vật liệu cao cấp, chắc chắn và bền bỉ.',
        'Kích thước vừa phải, không chiếm nhiều diện tích.',
        'Màu sắc đẹp, không bị xước hay bám dấu tay.',
        'Logo và branding rất tinh tế và chuyên nghiệp.'
      ]
    }
  ];

  // Create reviews for each product
  let totalReviews = 0;
  for (const product of products) {
    // Random number of reviews per product (2-8 reviews)
    const numReviews = Math.floor(Math.random() * 7) + 2;

    for (let i = 0; i < numReviews; i++) {
      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      const comment = template.comments[Math.floor(Math.random() * template.comments.length)];

      // Random rating (3-5 stars, weighted towards higher ratings)
      const ratings = [3, 4, 4, 4, 5, 5, 5, 5];
      const rating = ratings[Math.floor(Math.random() * ratings.length)];

      // Random user
      const user = users[Math.floor(Math.random() * users.length)];

      // Random verification status (70% verified)
      const isVerified = Math.random() < 0.7;

      // Random creation date within last 6 months
      const now = new Date();
      const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
      const createdAt = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));

      try {
        const review = await prisma.product_reviews.create({
          data: {
            userId: user.id,
            productId: product.id,
            rating: rating,
            title: template.title,
            comment: comment,
            isVerified: isVerified,
            status: 'APPROVED',
            upvotes: Math.floor(Math.random() * 15), // 0-15 upvotes
            downvotes: Math.floor(Math.random() * 3), // 0-2 downvotes
            createdAt: createdAt,
            updatedAt: createdAt
          }
        });

        totalReviews++;

        // Add some review votes (optional)
        if (Math.random() < 0.3) { // 30% chance to add votes
          const numVotes = Math.floor(Math.random() * 3) + 1; // 1-3 votes
          for (let v = 0; v < numVotes; v++) {
            const voter = users[Math.floor(Math.random() * users.length)];
            if (voter.id !== user.id) { // Don't vote for own review
              try {
                await prisma.product_review_votes.create({
                  data: {
                    reviewId: review.id,
                    userId: voter.id,
                    isUpvote: Math.random() < 0.8 // 80% upvotes
                  }
                });
              } catch (voteError) {
                // Ignore duplicate vote errors
              }
            }
          }
        }

      } catch (error) {
        console.error(`❌ Error creating review for product ${product.name}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Successfully created ${totalReviews} product reviews!`);

  // Show summary statistics
  const totalReviewCount = await prisma.product_reviews.count();
  const verifiedCount = await prisma.product_reviews.count({ where: { isVerified: true } });
  const avgRating = await prisma.product_reviews.aggregate({ _avg: { rating: true } });

  console.log('\n📊 Reviews Summary:');
  console.log(`   • Total Reviews: ${totalReviewCount}`);
  console.log(`   • Verified Reviews: ${verifiedCount} (${((verifiedCount/totalReviewCount)*100).toFixed(1)}%)`);
  console.log(`   • Average Rating: ${avgRating._avg.rating?.toFixed(2) || 'N/A'}/5.0`);

  // Show reviews per product
  console.log('\n📋 Reviews per Product:');
  for (const product of products.slice(0, 10)) { // Show first 10 products
    const reviewCount = await prisma.product_reviews.count({ where: { productId: product.id } });
    if (reviewCount > 0) {
      console.log(`   • ${product.name}: ${reviewCount} reviews`);
    }
  }

  console.log('\n🎯 Reviews seeding completed successfully!');
  console.log('📱 Dashboard: http://localhost:3001');
  console.log('🔐 Login: admin@audiotailoc.com / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
