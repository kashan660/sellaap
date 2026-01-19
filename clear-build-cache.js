const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Next.js build cache...');

// Clear .next directory
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  console.log('Removing .next directory...');
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('✅ .next directory cleared');
} else {
  console.log('ℹ️  .next directory not found');
}

// Clear node_modules/.cache
const cacheDir = path.join(__dirname, 'node_modules', '.cache');
if (fs.existsSync(cacheDir)) {
  console.log('Removing node_modules/.cache directory...');
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('✅ node_modules/.cache cleared');
} else {
  console.log('ℹ️  node_modules/.cache directory not found');
}

// Clear TypeScript cache
const tsbuildinfo = path.join(__dirname, 'tsconfig.tsbuildinfo');
if (fs.existsSync(tsbuildinfo)) {
  console.log('Removing tsconfig.tsbuildinfo...');
  fs.unlinkSync(tsbuildinfo);
  console.log('✅ tsconfig.tsbuildinfo cleared');
} else {
  console.log('ℹ️  tsconfig.tsbuildinfo not found');
}

console.log('\n🚀 Running build...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}