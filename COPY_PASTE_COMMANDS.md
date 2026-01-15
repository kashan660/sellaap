# 🚀 Copy-Paste Git Bash Commands to Fix Prisma Error

## Quick Fix - Run These Commands Now

```bash
# 1. Clear all cache (copy and paste this entire block)
rm -rf .next node_modules/.cache node_modules/.prisma .turbo

# 2. Regenerate Prisma client (without --force flag)
npx prisma generate

# 3. Test the connection
npx prisma db pull

# 4. Start your development server
npm run dev
```

## 🎯 What This Fixes

- ✅ **Turbopack Cache**: Clears cached JavaScript with old environment variables
- ✅ **Prisma Client**: Regenerates with correct `prisma+postgres://` protocol
- ✅ **Runtime Error**: Eliminates "URL must start with prisma://" error
- ✅ **Product Loading**: [`getProducts()`](file:///d:/sellaap/src/lib/products.ts#L14) will now work

## 🌍 Your International SEO Features Ready

After running these commands, test these URLs:
- **UK**: http://localhost:3000/uk
- **US**: http://localhost:3000/us  
- **Canada**: http://localhost:3000/canada
- **Europe**: http://localhost:3000/europe
- **Australia**: http://localhost:3000/australia

## 📋 If You Still Get Errors

### Nuclear Option (Complete Reset)
```bash
# Stop dev server first (Ctrl+C)
rm -rf node_modules package-lock.json .next
npm install
npx prisma generate
npm run dev
```

### Check Environment Variables
```bash
# Verify correct URL is loaded
echo $PRISMA_DATABASE_URL | cut -c1-50
```

## 🚀 Deploy to Vercel (After Fix Works Locally)

```bash
# Add all changes
git add .

# Commit with fix message
git commit -m "🔧 Fix Prisma Runtime Error - Clear Turbopack Cache

✅ Fixed Turbopack caching issue with environment variables
✅ Regenerated Prisma client with correct prisma+postgres:// protocol
✅ International SEO features ready for UK/US/Canada/Europe/Australia
✅ Products now load correctly without runtime errors"

# Deploy to Vercel
git push origin main
```

## ⏱️ Expected Timeline
- **Cache clear**: 30 seconds
- **Prisma regenerate**: 1-2 minutes
- **Dev server start**: 30 seconds
- **Total**: Under 5 minutes

**Run the commands above now to fix the runtime error!**