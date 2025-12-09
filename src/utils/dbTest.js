import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async () => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Connected to PostgreSQL:', result[0]);
  } catch (error) {
    console.error('❌ DB Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
