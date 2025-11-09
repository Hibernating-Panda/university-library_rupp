const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../lib/auth');

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
  
  console.log(`Created/Updated admin user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
