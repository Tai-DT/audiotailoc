const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = 'admin@audiotailoc.com';
    const password = 'Admin123!';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists, updating password...');
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('Admin user updated successfully');
    } else {
      console.log('Creating new admin user...');
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN'
        }
      });
      console.log('Admin user created successfully');
    }

    // Verify the user was created/updated
    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log('User details:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
