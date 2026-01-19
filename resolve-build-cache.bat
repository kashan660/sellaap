@echo off
echo 🧹 BUILD CACHE FIX - Following BUILD_CACHE_FIX.md Instructions
echo ==========================================================
echo.

echo 🔄 Step 1: Clearing all caches...
echo.

REM Remove Next.js build cache
if exist .next (
    rmdir /s /q .next
    echo ✅ .next directory cleared
) else (
    echo ℹ️  .next directory not found
)

REM Remove node_modules cache
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules/.cache cleared
) else (
    echo ℹ️  node_modules/.cache not found
)

REM Remove TypeScript cache
if exist tsconfig.tsbuildinfo (
    del tsconfig.tsbuildinfo
    echo ✅ tsconfig.tsbuildinfo removed
) else (
    echo ℹ️  tsconfig.tsbuildinfo not found
)

REM Clear npm cache
echo 🧹 Clearing npm cache...
npm cache clean --force
if %errorlevel% equ 0 (
    echo ✅ npm cache cleared
) else (
    echo ⚠️  npm cache clear had issues, continuing...
)

echo.
echo 🔄 Step 2: Regenerating Prisma Client...
echo.
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma generate failed
    pause
    exit /b 1
)
echo ✅ Prisma client regenerated successfully

echo.
echo 🔍 Step 3: Verifying current file state...
echo.
echo Current imports in digital-products/page.tsx:
type d:\sellaap\src\app\digital-products\page.tsx | findstr /n "import.*Link"
echo.
echo 🔍 Checking for any duplicate imports...
type d:\sellaap\src\app\digital-products\page.tsx | findstr /c:"import Link" | findstr /n .
set link_count=0
for /f "tokens=*" %%i in ('type d:\sellaap\src\app\digital-products\page.tsx ^| findstr /c:"import Link"') do set /a link_count+=1
echo Link import count: %link_count%

echo.
echo 🔨 Step 4: Running build...
echo.
npm run build

if %errorlevel% equ 0 (
    echo.
    echo 🎉 BUILD SUCCESSFUL! 🎉
    echo.
    echo 📦 Ready for git push!
    echo   git add .
    echo   git commit -m "feat: Add auto-add-to-cart functionality for new products"
    echo   git push
    echo.
    echo 🎯 All issues resolved:
    echo   ✅ Link import error fixed
    echo   ✅ Prisma casing error fixed  
    echo   ✅ TypeScript compilation successful
    echo   ✅ Build cache cleared
) else (
    echo.
    echo ❌ Build failed. The cache has been cleared, so this should be a fresh error.
    echo Please check the error message above.
)

echo.
pause