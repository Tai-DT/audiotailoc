import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProjects() {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        status: true,
        featured: true,
        viewCount: true,
        createdAt: true
      }
    });
    
    console.log('📊 Database Projects Summary:');
    console.log('================================');
    console.log(`Total projects: ${projects.length}\n`);
    
    projects.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Featured: ${p.featured ? 'Yes' : 'No'}`);
      console.log(`   Views: ${p.viewCount}`);
      console.log(`   Created: ${p.createdAt.toLocaleDateString()}`);
      console.log('');
    });
    
    // Check one project in detail
    if (projects.length > 0) {
      const detailedProject = await prisma.project.findFirst({
        include: {
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      });
      
      console.log('📄 Detailed view of first project:');
      console.log('================================');
      console.log(`Name: ${detailedProject?.name}`);
      console.log(`Content length: ${detailedProject?.content?.length || 0} characters`);
      console.log(`Has SEO metadata: ${detailedProject?.metaTitle ? 'Yes' : 'No'}`);
      console.log(`Created by: ${detailedProject?.user?.email}`);
      
      // Parse and check technologies
      if (detailedProject?.technologies) {
        const techs = JSON.parse(detailedProject.technologies as string);
        console.log(`Technologies: ${techs.join(', ')}`);
      }
      
      // Parse and check gallery images
      if (detailedProject?.galleryImages) {
        const images = JSON.parse(detailedProject.galleryImages as string);
        console.log(`Gallery images: ${images.length} images`);
      }
    }
    
  } catch (error) {
    console.error('Error checking projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjects();
