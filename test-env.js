// Test script to verify environment variables and database connection
console.log('Testing environment configuration...\n');

// Check if we're in a Node.js environment
if (typeof process === 'undefined' || typeof process.env === 'undefined') {
    console.log('❌ Not running in Node.js environment');
    process.exit(1);
}

// List of required environment variables
const requiredEnvVars = [
    'DATABASE_URL',
    'DIRECT_URL', 
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
];

console.log('Checking required environment variables:');

let allVarsPresent = true;

requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
        console.log(`✅ ${envVar}: Present`);
        // Mask sensitive values for security
        if (envVar.includes('URL') || envVar.includes('SECRET')) {
            const value = process.env[envVar];
            const maskedValue = value.length > 20 
                ? value.substring(0, 10) + '...' + value.substring(value.length - 10)
                : '***';
            console.log(`   Value: ${maskedValue}`);
        }
    } else {
        console.log(`❌ ${envVar}: Missing`);
        allVarsPresent = false;
    }
});

console.log('\nEnvironment check completed.');

if (allVarsPresent) {
    console.log('✅ All required environment variables are present');
    
    // Test database connection format
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl && dbUrl.startsWith('prisma+postgres://')) {
        console.log('✅ DATABASE_URL format appears correct (Prisma Accelerate)');
    } else if (dbUrl && dbUrl.startsWith('postgres://')) {
        console.log('✅ DATABASE_URL format appears correct (Direct PostgreSQL)');
    } else {
        console.log('⚠️  DATABASE_URL format may need verification');
    }
    
} else {
    console.log('❌ Some environment variables are missing');
    console.log('Please ensure these are set in your Vercel project settings');
}

console.log('\nTo fix deployment issues:');
console.log('1. Go to Vercel Dashboard → Project Settings → Environment Variables');
console.log('2. Add all required variables from your .env file');
console.log('3. Redeploy your application');