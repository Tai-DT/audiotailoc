import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding technicians...');

  // Sample technicians data
  const technicians = [
    {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@audio-tailoc.com',
      specialties: ['INSTALLATION', 'MAINTENANCE'],
      isActive: true,
    },
    {
      name: 'Trần Thị B',
      phone: '0901234568',
      email: 'tranthib@audio-tailoc.com',
      specialties: ['REPAIR', 'CONSULTATION'],
      isActive: true,
    },
    {
      name: 'Lê Văn C',
      phone: '0901234569',
      email: 'levanc@audio-tailoc.com',
      specialties: ['INSTALLATION', 'LIGHTING'],
      isActive: true,
    },
    {
      name: 'Phạm Thị D',
      phone: '0901234570',
      email: 'phamthid@audio-tailoc.com',
      specialties: ['MAINTENANCE', 'REPAIR'],
      isActive: false, // Inactive technician
    },
  ];

  for (const tech of technicians) {
    try {
      const technician = await prisma.technician.create({
        data: {
          name: tech.name,
          phone: tech.phone,
          email: tech.email,
          specialties: JSON.stringify(tech.specialties),
          isActive: tech.isActive,
        },
      });

      // Create sample schedule for active technicians
      if (tech.isActive) {
        const schedules = [
          {
            date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            startTime: '08:00',
            endTime: '17:00',
            isAvailable: true,
          },
          {
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
            startTime: '09:00',
            endTime: '18:00',
            isAvailable: true,
          },
        ];

        for (const schedule of schedules) {
          await prisma.technicianSchedule.create({
            data: {
              technicianId: technician.id,
              ...schedule,
            },
          });
        }
      }

      console.log(`✅ Created technician ${technician.name}`);
    } catch (error) {
      console.error(`❌ Failed to create technician ${tech.name}:`, error);
    }
  }

  console.log('🎉 Technicians seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding technicians:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });