// Simple build verification script
const { execSync } = require('child_process');

console.log('🔍 Checking build configuration...\n');

try {
    // Test if we can run Prisma generate (which should validate the database connection)
    console.log('Running prisma generate...');
    execSync('npx prisma generate', { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development' }
    });
    console.log('✅ Prisma generate completed successfully');
    
} catch (error) {
    console.log('❌ Prisma generate failed - this indicates environment variable issues');
    console.log('Error:', error.message);
    console.log('\n💡 Solution: Ensure these environment variables are set in Vercel:');
    console.log('   - DATABASE_URL');
    console.log('   - DIRECT_URL');
    console.log('   - NEXTAUTH_SECRET');
    console.log('   - NEXTAUTH_URL');
    console.log('\n📋 They must match exactly what\'s in your local .env file');
}