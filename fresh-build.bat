@echo off
echo 🧹 CLEARING CACHE AND RUNNING FRESH BUILD
echo ==========================================
echo.

echo 🔄 Step 1: Killing any running Next.js processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM next.exe 2>nul

echo 🧹 Step 2: Clearing all caches...
if exist .next (
    rmdir /s /q .next
    echo ✅ .next directory cleared
)
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules\.cache cleared
)
if exist tsconfig.tsbuildinfo (
    del tsconfig.tsbuildinfo
    echo ✅ tsconfig.tsbuildinfo removed
)
if exist dist (
    rmdir /s /q dist
    echo ✅ dist cleared
)

echo 🔄 Step 3: Regenerating Prisma client...
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma generate failed
    pause
    exit /b 1
)

echo 🔍 Step 4: Checking the digital-products file...
echo Current imports in digital-products/page.tsx:
type d:\sellaap\src\app\digital-products\page.tsx | findstr /n "import"

echo.
echo 🔨 Step 5: Running build...
npm run build

if %errorlevel% equ 0 (
    echo.
    echo 🎉 BUILD SUCCESSFUL! 🎉
    echo.
    echo 📦 Ready for git push!
    echo   git add .
    echo   git commit -m "feat: Add auto-add-to-cart functionality for new products"
    echo   git push
) else (
    echo.
    echo ❌ Build failed. Check the error above.
    echo The duplicate Link import should be resolved now.
)

echo.
pause