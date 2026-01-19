#!/bin/bash

echo "🧹 Clearing build cache..."
echo "======================================"

# Clear Next.js cache
if [ -d ".next" ]; then
    echo "Removing .next directory..."
    rm -rf .next
    echo "✅ .next directory cleared"
else
    echo "ℹ️  .next directory not found"
fi

# Clear node_modules cache
if [ -d "node_modules/.cache" ]; then
    echo "Removing node_modules/.cache directory..."
    rm -rf node_modules/.cache
    echo "✅ node_modules/.cache cleared"
else
    echo "ℹ️  node_modules/.cache directory not found"
fi

# Clear TypeScript cache
if [ -f "tsconfig.tsbuildinfo" ]; then
    echo "Removing tsconfig.tsbuildinfo..."
    rm -f tsconfig.tsbuildinfo
    echo "✅ tsconfig.tsbuildinfo cleared"
else
    echo "ℹ️  tsconfig.tsbuildinfo not found"
fi

echo ""
echo "🚀 Running build..."
echo "======================================"

# Run the build
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
    echo "🎉 Ready for git push!"
    echo "Commands to run:"
    echo "  git add ."
    echo "  git commit -m 'feat: Add auto-add-to-cart functionality for new products'"
    echo "  git push"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi