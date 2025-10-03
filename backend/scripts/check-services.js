const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkServices() {
  try {
    console.log('🔍 Checking services in database...\n');

    // Count all services
    const totalServices = await prisma.service.count();
    console.log(`📊 Total services: ${totalServices}`);

    // Count active services
    const activeServices = await prisma.service.count({
      where: { isActive: true }
    });
    console.log(`✅ Active services: ${activeServices}`);

    // Count featured services
    const featuredServices = await prisma.service.count({
      where: { isFeatured: true }
    });
    console.log(`⭐ Featured services: ${featuredServices}`);

    // Count active AND featured services (what homepage needs)
    const activeFeaturedServices = await prisma.service.count({
      where: { 
        isActive: true,
        isFeatured: true 
      }
    });
    console.log(`🌟 Active + Featured services: ${activeFeaturedServices}`);

    // List all services (limited to 20)
    const services = await prisma.service.findMany({
      take: 20,
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        isFeatured: true,
        basePriceCents: true,
        priceType: true,
      }
    });

    if (services.length > 0) {
      console.log('\n📋 Services list:');
      services.forEach((service, index) => {
        const active = service.isActive ? '✅' : '❌';
        const featured = service.isFeatured ? '⭐' : '  ';
        const price = service.basePriceCents / 100;
        console.log(`${index + 1}. ${active} ${featured} ${service.name} (${service.slug}) - ${price.toLocaleString('vi-VN')} VNĐ`);
      });
    } else {
      console.log('\n⚠️  No services found in database!');
    }

    // Check service types
    const serviceTypes = await prisma.serviceType.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        _count: {
          select: { services: true }
        }
      }
    });

    if (serviceTypes.length > 0) {
      console.log('\n📁 Service types:');
      serviceTypes.forEach((type, index) => {
        const active = type.isActive ? '✅' : '❌';
        console.log(`${index + 1}. ${active} ${type.name} (${type.slug}) - ${type._count.services} services`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking services:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkServices();
