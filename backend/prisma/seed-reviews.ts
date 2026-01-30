import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function seedReviews() {
    console.log('⭐ Seeding reviews...');

    // Get products and users
    const products = await prisma.products.findMany({ take: 5 });
    const users = await prisma.users.findMany({
        where: { role: 'USER' },
        take: 10
    });

    if (products.length === 0) {
        console.log('⚠️  No products found. Skipping reviews seed.');
        return;
    }

    if (users.length === 0) {
        console.log('⚠️  No users found. Skipping reviews seed.');
        return;
    }

    const now = new Date();
    const reviewTexts = [
        {
            title: 'Sản phẩm tuyệt vời!',
            comment: 'Âm thanh rất hay, chất lượng tốt. Đáng đồng tiền bát gạo.',
            rating: 5
        },
        {
            title: 'Rất hài lòng',
            comment: 'Giao hàng nhanh, sản phẩm chất lượng. Sẽ ủng hộ shop lâu dài.',
            rating: 5
        },
        {
            title: 'Tốt cho giá tiền',
            comment: 'Âm thanh ổn, phù hợp với mức giá. Đội ngũ tư vấn nhiệt tình.',
            rating: 4
        },
        {
            title: 'Sản phẩm tốt',
            comment: 'Chất lượng ổn định, bass mạnh, treble rõ. Recommended!',
            rating: 4
        },
        {
            title: 'Bình thường',
            comment: 'Sản phẩm ổn nhưng chưa thật sự xuất sắc. Có thể cải thiện hơn.',
            rating: 3
        },
        {
            title: 'Cần cải thiện',
            comment: 'Sản phẩm có một vài vấn đề nhỏ về kết nối Bluetooth.',
            rating: 3
        },
        {
            title: 'Không như mong đợi',
            comment: 'Chất lượng âm thanh chưa được như quảng cáo.',
            rating: 2
        },
    ];

    let reviewCount = 0;

    for (const product of products) {
        // Create 3-5 reviews per product
        const numReviews = Math.floor(Math.random() * 3) + 3;

        for (let i = 0; i < numReviews && i < users.length; i++) {
            const reviewData = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
            const reviewDate = new Date(now);
            reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 60));

            const review = await prisma.product_reviews.create({
                data: {
                    id: randomUUID(),
                    userId: users[i].id,
                    productId: product.id,
                    rating: reviewData.rating,
                    title: reviewData.title,
                    comment: reviewData.comment,
                    isVerified: Math.random() > 0.5, // 50% verified purchases
                    status: Math.random() > 0.1 ? 'APPROVED' : 'PENDING', // 90% approved
                    upvotes: Math.floor(Math.random() * 20),
                    downvotes: Math.floor(Math.random() * 3),
                    createdAt: reviewDate,
                    updatedAt: reviewDate,
                },
            });

            reviewCount++;

            // Add some votes
            const voteCount = Math.floor(Math.random() * 5);
            for (let j = 0; j < voteCount && j < users.length; j++) {
                if (users[j].id !== users[i].id) { // Don't let reviewer vote on own review
                    try {
                        await prisma.product_review_votes.create({
                            data: {
                                id: randomUUID(),
                                reviewId: review.id,
                                userId: users[j].id,
                                isUpvote: Math.random() > 0.3, // 70% upvotes
                            },
                        });
                    } catch (e) {
                        // Skip if duplicate
                    }
                }
            }

            // Add admin response for some reviews (especially low ratings)
            if (reviewData.rating <= 3 && Math.random() > 0.5) {
                await prisma.product_reviews.update({
                    where: { id: review.id },
                    data: {
                        response: 'Cảm ơn bạn đã đánh giá. Chúng tôi sẽ cải thiện chất lượng sản phẩm và dịch vụ tốt hơn.',
                    },
                });
            }
        }

        console.log(`✅ Created ${numReviews} reviews for product: ${product.name}`);
    }

    console.log(`\n✅ Successfully seeded ${reviewCount} reviews across ${products.length} products`);
}

seedReviews()
    .catch((e) => {
        console.error('❌ Error seeding reviews:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
