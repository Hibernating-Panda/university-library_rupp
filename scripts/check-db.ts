import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('Checking database connection...');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // List all tables (SQLite specific)
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%' 
      AND name NOT LIKE '_prisma_%'
      ORDER BY name;
    `;
    
    console.log('\n📊 Database tables:');
    console.log(tables);
    
    // Check if User table exists and has data
    try {
      const users = await prisma.user.findMany();
      console.log('\n👥 Users in database:', users);
    } catch (e) {
      console.error('\n❌ Error querying users table:', e);
    }
    
  } catch (e) {
    console.error('❌ Database connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
