// test-simple.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function test() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query funcionó:', result);
    
    const roles = await prisma.$queryRaw`SELECT COUNT(*) FROM roles`;
    console.log('✅ Roles count:', roles);
    
  } catch (error) {
    console.error('❌ Error completo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();