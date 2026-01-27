import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function wakeUpDatabase() {
  console.log('⏰ Attempting to wake up Neon database...');
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`\n🔄 Connection attempt ${attempts}/${maxAttempts}...`);
      
      // Try a simple query
      await prisma.$queryRaw`SELECT 1`;
      
      console.log('✅ DATABASE IS AWAKE! Connection successful.');
      console.log('🚀 You can now start the server with: npm run dev');
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      console.log(`⏳ Database still sleeping or unreachable. Waiting 5 seconds...`);
      // console.log(error.message); // Uncomment to see full error
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.error('\n❌ Could not connect after multiple attempts.');
  console.error('👉 Please go to https://console.neon.tech to manually check your database status.');
  await prisma.$disconnect();
  process.exit(1);
}

wakeUpDatabase();
