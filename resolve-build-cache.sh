#!/bin/bash

echo "🧹 BUILD CACHE FIX - Following BUILD_CACHE_FIX.md Instructions"
echo "=========================================================="
echo ""

echo "🔄 Step 1: Clearing all caches..."
echo ""

# Remove Next.js build cache
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ .next directory cleared"
else
    echo "ℹ️  .next directory not found"
fi

# Remove node_modules cache
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ node_modules/.cache cleared"
else
    echo "ℹ️  node_modules/.cache not found"
fi

# Remove TypeScript cache
if [ -f "tsconfig.tsbuildinfo" ]; then
    rm tsconfig.tsbuildinfo
    echo "✅ tsconfig.tsbuildinfo removed"
else
    echo "ℹ️  tsconfig.tsbuildinfo not found"
fi

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force
if [ $? -eq 0 ]; then
    echo "✅ npm cache cleared"
else
    echo "⚠️  npm cache clear had issues, continuing..."
fi

echo ""
echo "🔄 Step 2: Regenerating Prisma Client..."
echo ""
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Prisma generate failed"
    exit 1
fi
echo "✅ Prisma client regenerated successfully"

echo ""
echo "🔍 Step 3: Verifying current file state..."
echo ""
echo "Current imports in digital-products/page.tsx:"
grep -n "import.*Link" d:/sellaap/src/app/digital-products/page.tsx
echo ""
echo "🔍 Checking for any duplicate imports..."
link_count=$(grep -c "import Link" d:/sellaap/src/app/digital-products/page.tsx)
echo "Link import count: $link_count"

echo ""
echo "🔨 Step 4: Running build..."
echo ""
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 BUILD SUCCESSFUL! 🎉"
    echo ""
    echo "📦 Ready for git push!"
    echo "  git add ."
    echo "  git commit -m \"feat: Add auto-add-to-cart functionality for new products\""
    echo "  git push"
    echo ""
    echo "🎯 All issues resolved:"
    echo "   ✅ Link import error fixed"
    echo "   ✅ Prisma casing error fixed  "
    echo "   ✅ TypeScript compilation successful"
    echo "   ✅ Build cache cleared"
else
    echo ""
    echo "❌ Build failed. The cache has been cleared, so this should be a fresh error."
    echo "Please check the error message above."
fi