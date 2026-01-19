@echo off
echo 🚀 Final Build - AddToCart Auto-Integration Complete!
echo ======================================================
echo.

echo 🧹 Clearing build cache...
REM Clear all caches
if exist .next (
    echo Removing .next directory...
    rmdir /s /q .next
    echo ✅ .next directory cleared
)

if exist node_modules\.cache (
    echo Removing node_modules\.cache directory...
    rmdir /s /q node_modules\.cache
)

if exist tsconfig.tsbuildinfo (
    echo Removing tsconfig.tsbuildinfo...
    del tsconfig.tsbuildinfo
)

echo 🔄 Regenerating Prisma client...
npx prisma generate

echo.
echo 🔨 Running build...
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ BUILD SUCCESSFUL! 🎉
    echo.
    echo 📦 Ready for git push!
    echo Commands to run:
    echo   git add .
    echo   git commit -m "feat: Add auto-add-to-cart functionality for new products"
    echo   git push
    echo.
    echo 🎯 Features implemented:
    echo   ✓ Auto-add-to-cart for new products
    echo   ✓ Required field validation
    echo   ✓ Admin workflow integration
    echo   ✓ Product page revalidation
    echo   ✓ TypeScript type safety
    echo   ✓ Build error fixes
) else (
    echo.
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)