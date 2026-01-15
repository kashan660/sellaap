// Test database connection
import { prisma } from './src/lib/prisma';

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful:', result);
    
    // Test fetching products
    const products = await prisma.product.findMany({
      take: 5,
      include: { category: true }
    });
    console.log(`✅ Found ${products.length} products`);
    
    // Test fetching posts
    const posts = await prisma.post.findMany({
      take: 3
    });
    console.log(`✅ Found ${posts.length} posts`);
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();