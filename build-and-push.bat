@echo off
echo 🧹 Clearing build cache...
echo ======================================

REM Clear Next.js cache
if exist .next (
    echo Removing .next directory...
    rmdir /s /q .next
    echo ✅ .next directory cleared
) else (
    echo ℹ️  .next directory not found
)

REM Clear node_modules cache
if exist node_modules\.cache (
    echo Removing node_modules\.cache directory...
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules\.cache cleared
) else (
    echo ℹ️  node_modules\.cache directory not found
)

REM Clear TypeScript cache
if exist tsconfig.tsbuildinfo (
    echo Removing tsconfig.tsbuildinfo...
    del tsconfig.tsbuildinfo
    echo ✅ tsconfig.tsbuildinfo cleared
) else (
    echo ℹ️  tsconfig.tsbuildinfo not found
)

echo.
echo 🚀 Running build...
echo ======================================

REM Run the build
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build completed successfully!
    echo.
    echo 🎉 Ready for git push!
    echo Commands to run:
    echo   git add .
    echo   git commit -m "feat: Add auto-add-to-cart functionality for new products"
    echo   git push
) else (
    echo.
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)