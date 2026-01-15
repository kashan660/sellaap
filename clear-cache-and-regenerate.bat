@echo off
echo 🧹 Clearing Next.js and Prisma Cache...
echo.

REM Stop any running dev server (you'll need to do this manually first)
echo ⚠️  Make sure to stop your dev server with Ctrl+C before continuing!
echo.

REM Clear Next.js cache
echo Clearing Next.js cache...
if exist .next (
    rmdir /s /q .next
    echo ✅ .next directory cleared
) else (
    echo ℹ️  .next directory not found
)

REM Clear node_modules cache
echo.
echo Clearing node_modules cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo ✅ node_modules\.cache cleared
) else (
    echo ℹ️  node_modules\.cache not found
)

REM Clear Prisma cache
echo.
echo Clearing Prisma cache...
if exist "node_modules\.prisma" (
    rmdir /s /q "node_modules\.prisma"
    echo ✅ node_modules\.prisma cleared
) else (
    echo ℹ️  node_modules\.prisma not found
)

REM Clear Turbopack cache
echo.
echo Clearing Turbopack cache...
if exist ".turbo" (
    rmdir /s /q ".turbo"
    echo ✅ .turbo directory cleared
) else (
    echo ℹ️  .turbo directory not found
)

echo.
echo 🔄 Regenerating Prisma client...
npx prisma generate --force

echo.
echo 🧪 Testing Prisma connection...
npx prisma db pull >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Prisma connection successful
) else (
    echo ⚠️  Prisma connection test failed - check your environment variables
)

echo.
echo 🎉 Cache clearing complete!
echo.
echo 🚀 Next steps:
echo 1. Run: npm run dev
echo 2. Test your site at: http://localhost:3000
echo 3. Deploy to Vercel when ready
echo.
echo 📋 Your international SEO features are ready:
echo - UK market: http://localhost:3000/uk
echo - US market: http://localhost:3000/us  
echo - Canada market: http://localhost:3000/canada
echo - Europe market: http://localhost:3000/europe
echo - Australia market: http://localhost:3000/australia
echo.
pause