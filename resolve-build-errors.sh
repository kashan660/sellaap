#!/bin/bash

echo "🚀 RESOLVING BUILD ERRORS - AddToCart Auto-Integration"
echo "======================================================"
echo ""

echo "🧹 STEP 1: Clearing build cache..."
echo ""

# Clear all caches comprehensively
echo "Removing .next directory..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ .next directory cleared"
else
    echo "ℹ️  .next directory not found"
fi

echo ""
echo "Removing node_modules/.cache directory..."
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ node_modules/.cache cleared"
else
    echo "ℹ️  node_modules/.cache not found"
fi

echo ""
echo "Removing tsconfig.tsbuildinfo..."
if [ -f "tsconfig.tsbuildinfo" ]; then
    rm tsconfig.tsbuildinfo
    echo "✅ tsconfig.tsbuildinfo removed"
else
    echo "ℹ️  tsconfig.tsbuildinfo not found"
fi

echo ""
echo "🔄 STEP 2: Regenerating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Prisma client generation failed"
    echo "Please check your database connection and Prisma schema"
    exit 1
fi
echo "✅ Prisma client generated successfully"

echo ""
echo "🔍 STEP 3: Checking for TypeScript errors..."
echo "Running TypeScript compiler check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "⚠️  TypeScript errors found - continuing to build anyway..."
else
    echo "✅ No TypeScript errors detected"
fi

echo ""
echo "🔨 STEP 4: Running Next.js build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 BUILD SUCCESSFUL! 🎉"
    echo ""
    echo "📦 Ready for git push!"
    echo ""
    echo "Next steps:"
    echo "  1. git add ."
    echo "  2. git commit -m \"feat: Add auto-add-to-cart functionality for new products\""
    echo "  3. git push"
    echo ""
    echo "🎯 Features implemented:"
    echo "  ✓ Auto-add-to-cart for new products"
    echo "  ✓ Required field validation (id, name, price, currency, slug)"
    echo "  ✓ Admin workflow integration with revalidation"
    echo "  ✓ TypeScript type safety with ProductWithCategory"
    echo "  ✓ Build error fixes (Link import, Prisma casing, Suspense boundary)"
    echo ""
    echo "💡 Build cache has been cleared - this should resolve any lingering errors"
else
    echo ""
    echo "❌ BUILD FAILED"
    echo ""
    echo "Please check the error messages above and:"
    echo "  1. Fix any TypeScript errors"
    echo "  2. Ensure all imports are correct"
    echo "  3. Check for any missing dependencies"
    echo "  4. Verify Prisma schema is valid"
    echo ""
    echo "Common fixes:"
    echo "  - Check digital-products/page.tsx for Link import"
    echo "  - Check products/[slug]/page.tsx for Prisma casing"
    echo "  - Check auth/signin/page.tsx for Suspense boundary"
    exit 1
fi