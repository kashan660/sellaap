const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting regional availability migration...');

try {
  // Generate Prisma client with new schema
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema changes to database
  console.log('Pushing schema changes to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Run the seed script to add regional availability
  console.log('Seeding regional availability data...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
  
  console.log('✅ Regional availability migration completed successfully!');
  console.log('All products are now available in UK, US, Canada, Europe, and Australia.');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}