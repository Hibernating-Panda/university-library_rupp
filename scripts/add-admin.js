import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth.js';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = 'admin123';
  
  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Admin User',
      email,
      password: hashedPassword,
      role: 'ADMIN'
    },
  });
  
  console.log(`✅ Admin user created/updated: ${user.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
