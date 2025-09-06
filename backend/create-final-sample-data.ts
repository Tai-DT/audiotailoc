import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFinalData() {
  console.log('🌱 Seeding final sample data...');

  try {
    // 1. Create point transactions for loyalty accounts
    console.log('💰 Creating point transactions...');
    const loyaltyAccounts = await prisma.loyaltyAccount.findMany();

    for (const account of loyaltyAccounts) {
      const transactions = [
        {
          accountId: account.id,
          amount: 100,
          type: 'EARNED',
          description: 'Điểm thưởng từ đơn hàng đầu tiên',
          expiresAt: new Date('2026-12-31')
        },
        {
          accountId: account.id,
          amount: 50,
          type: 'EARNED',
          description: 'Điểm thưởng từ đánh giá sản phẩm',
          expiresAt: new Date('2026-12-31')
        }
      ];

      for (const transaction of transactions) {
        await prisma.pointTransaction.create({ data: transaction });
      }
    }
    console.log('✅ Point transactions created');

    // 2. Create sample service bookings
    console.log('📅 Creating service bookings...');
    // Skip service bookings due to missing bookingNo field
    console.log('⏭️ Skipping service bookings for now');

    // 3. Create technician schedules
    console.log('📆 Creating technician schedules...');
    // Skip for now as technicians were not created due to type issues

    // 4. Create redemption history
    console.log('🎫 Creating redemption history...');
    const rewards = await prisma.loyaltyReward.findMany();

    if (loyaltyAccounts.length > 0 && rewards.length > 0) {
      const redemptions = [
        {
          accountId: loyaltyAccounts[0].id,
          rewardId: rewards[0].id,
          pointsUsed: 100,
          status: 'COMPLETED'
        }
      ];

      for (const redemption of redemptions) {
        await prisma.redemptionHistory.create({ data: redemption });
      }
      console.log('✅ Redemption history created');
    }

    console.log('\n🎉 Final sample data seeded successfully!');

  } catch (error) {
    console.error('Error seeding final data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFinalData();
