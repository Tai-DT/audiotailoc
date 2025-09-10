import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCategoriesAndServices() {
  try {
    console.log('🌱 Seeding categories and services...')

    // Create categories
    const categories = [
      {
        name: 'Thanh Lý',
        slug: 'thanh-ly',
        description: 'Dịch vụ thanh lý thiết bị âm thanh cũ'
      },
      {
        name: 'Lắp đặt',
        slug: 'lap-dat',
        description: 'Dịch vụ lắp đặt hệ thống âm thanh'
      },
      {
        name: 'Cho thuê',
        slug: 'cho-thue',
        description: 'Dịch vụ cho thuê thiết bị âm thanh'
      }
    ]

    const createdCategories = []

    for (const category of categories) {
      const existingCategory = await prisma.serviceCategory.findUnique({
        where: { slug: category.slug }
      })

      if (!existingCategory) {
        const newCategory = await prisma.serviceCategory.create({
          data: category
        })
        createdCategories.push(newCategory)
        console.log(`✅ Created category: ${newCategory.name}`)
      } else {
        createdCategories.push(existingCategory)
        console.log(`⏭️  Category already exists: ${existingCategory.name}`)
      }
    }

    // Get service types
    const serviceTypes = await prisma.serviceType.findMany()
    if (serviceTypes.length === 0) {
      console.log('❌ No service types found. Please create service types first.')
      return
    }

    // Create services for each category
    const servicesData = [
      // Thanh Lý services
      {
        categoryIndex: 0,
        services: [
          {
            name: 'Thanh lý loa cũ',
            slug: 'thanh-ly-loa-cu',
            shortDescription: 'Thanh lý loa cũ với giá tốt',
            description: 'Dịch vụ thanh lý loa cũ, loa hỏng, loa không sử dụng với giá cả hợp lý.',
            basePriceCents: 500000, // 5,000 VND
            estimatedDuration: 30,
            isActive: true
          },
          {
            name: 'Thanh lý ampli cũ',
            slug: 'thanh-ly-ampli-cu',
            shortDescription: 'Thanh lý ampli cũ giá cao',
            description: 'Thanh lý ampli cũ, ampli không sử dụng với giá thu mua cao.',
            basePriceCents: 1000000, // 10,000 VND
            estimatedDuration: 45,
            isActive: true
          },
          {
            name: 'Thanh lý micro cũ',
            slug: 'thanh-ly-micro-cu',
            shortDescription: 'Thanh lý micro và phụ kiện',
            description: 'Thanh lý micro, stand micro và các phụ kiện âm thanh cũ.',
            basePriceCents: 200000, // 2,000 VND
            estimatedDuration: 20,
            isActive: true
          },
          {
            name: 'Thanh lý mixer cũ',
            slug: 'thanh-ly-mixer-cu',
            shortDescription: 'Thanh lý mixer âm thanh cũ',
            description: 'Thanh lý mixer cũ, mixer analog và digital với giá cạnh tranh.',
            basePriceCents: 800000, // 8,000 VND
            estimatedDuration: 40,
            isActive: true
          }
        ]
      },
      // Lắp đặt services
      {
        categoryIndex: 1,
        services: [
          {
            name: 'Lắp đặt hệ thống loa',
            slug: 'lap-dat-he-thong-loa',
            shortDescription: 'Lắp đặt hệ thống loa chuyên nghiệp',
            description: 'Dịch vụ lắp đặt hệ thống loa cho sân khấu, hội trường, nhà hàng.',
            basePriceCents: 5000000, // 50,000 VND
            estimatedDuration: 240, // 4 hours
            isActive: true
          },
          {
            name: 'Lắp đặt micro và mixer',
            slug: 'lap-dat-micro-mixer',
            shortDescription: 'Lắp đặt hệ thống micro và mixer',
            description: 'Lắp đặt micro, mixer và hệ thống âm thanh cho karaoke, hội nghị.',
            basePriceCents: 3000000, // 30,000 VND
            estimatedDuration: 180, // 3 hours
            isActive: true
          },
          {
            name: 'Lắp đặt hệ thống âm thanh gia đình',
            slug: 'lap-dat-am-thanh-gia-dinh',
            shortDescription: 'Lắp đặt âm thanh cho gia đình',
            description: 'Lắp đặt hệ thống âm thanh gia đình, home theater.',
            basePriceCents: 2000000, // 20,000 VND
            estimatedDuration: 120, // 2 hours
            isActive: true
          },
          {
            name: 'Lắp đặt âm thanh quán bar',
            slug: 'lap-dat-am-thanh-quan-bar',
            shortDescription: 'Lắp đặt âm thanh cho quán bar',
            description: 'Lắp đặt hệ thống âm thanh chuyên nghiệp cho quán bar, club.',
            basePriceCents: 8000000, // 80,000 VND
            estimatedDuration: 360, // 6 hours
            isActive: true
          }
        ]
      },
      // Cho thuê services
      {
        categoryIndex: 2,
        services: [
          {
            name: 'Cho thuê loa và ampli',
            slug: 'cho-thue-loa-ampli',
            shortDescription: 'Cho thuê loa và ampli sự kiện',
            description: 'Dịch vụ cho thuê loa, ampli cho sự kiện, tiệc cưới, hội nghị.',
            basePriceCents: 2000000, // 20,000 VND/ngày
            estimatedDuration: 480, // 8 hours
            isActive: true
          },
          {
            name: 'Cho thuê hệ thống karaoke',
            slug: 'cho-thue-he-thong-karaoke',
            shortDescription: 'Cho thuê hệ thống karaoke',
            description: 'Cho thuê hệ thống karaoke hoàn chỉnh cho tiệc sinh nhật, liên hoan.',
            basePriceCents: 1500000, // 15,000 VND/ngày
            estimatedDuration: 480, // 8 hours
            isActive: true
          },
          {
            name: 'Cho thuê micro không dây',
            slug: 'cho-thue-micro-khong-day',
            shortDescription: 'Cho thuê micro không dây',
            description: 'Cho thuê micro không dây cho hội nghị, sự kiện, biểu diễn.',
            basePriceCents: 300000, // 3,000 VND/ngày
            estimatedDuration: 480, // 8 hours
            isActive: true
          },
          {
            name: 'Cho thuê hệ thống âm thanh sân khấu',
            slug: 'cho-thue-am-thanh-san-khau',
            shortDescription: 'Cho thuê âm thanh sân khấu',
            description: 'Cho thuê hệ thống âm thanh chuyên nghiệp cho sân khấu, biểu diễn.',
            basePriceCents: 5000000, // 50,000 VND/ngày
            estimatedDuration: 480, // 8 hours
            isActive: true
          }
        ]
      }
    ]

    for (const categoryData of servicesData) {
      const category = createdCategories[categoryData.categoryIndex]
      const type = serviceTypes[0] // Use first service type

      for (const service of categoryData.services) {
        const existingService = await prisma.service.findUnique({
          where: { slug: service.slug }
        })

        if (!existingService) {
          await prisma.service.create({
            data: {
              ...service,
              categoryId: category.id,
              typeId: type.id
            }
          })
          console.log(`✅ Created service: ${service.name}`)
        } else {
          console.log(`⏭️  Service already exists: ${service.name}`)
        }
      }
    }

    console.log('🎉 Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCategoriesAndServices()
