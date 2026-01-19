#!/bin/bash

echo "🧹 CLEARING CACHE AND RUNNING FRESH BUILD"
echo "=========================================="
echo ""

echo "🔄 Step 1: Clearing all caches..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ .next directory cleared"
fi
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ node_modules/.cache cleared"
fi
if [ -f "tsconfig.tsbuildinfo" ]; then
    rm tsconfig.tsbuildinfo
    echo "✅ tsconfig.tsbuildinfo removed"
fi
if [ -d "dist" ]; then
    rm -rf dist
    echo "✅ dist cleared"
fi

echo "🔍 Step 2: Checking the digital-products file..."
echo "Current imports in digital-products/page.tsx:"
grep -n "import" d:/sellaap/src/app/digital-products/page.tsx

echo ""
echo "🔄 Step 3: Regenerating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Prisma generate failed"
    exit 1
fi

echo ""
echo "🔨 Step 4: Running build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 BUILD SUCCESSFUL! 🎉"
    echo ""
    echo "📦 Ready for git push!"
    echo "  git add ."
    echo "  git commit -m \"feat: Add auto-add-to-cart functionality for new products\""
    echo "  git push"
else
    echo ""
    echo "❌ Build failed. Check the error above."
    echo "The duplicate Link import should be resolved now."
fi