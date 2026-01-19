@echo off
echo 🧹 Clearing Next.js build cache and dependencies...
echo.

REM Stop any running Node processes
echo Stopping Node processes...
taskkill /F /IM node.exe 2>nul || echo No Node processes found

REM Clear Next.js cache
echo.
echo Deleting .next folder...
if exist .next (
    rmdir /s /q .next
    echo ✅ .next folder deleted
) else (
    echo ℹ️  .next folder not found
)

REM Clear node_modules cache
echo.
echo Deleting node_modules/.cache folder...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules/.cache folder deleted
) else (
    echo ℹ️  node_modules/.cache folder not found
)

REM Clear Turbopack cache
echo.
echo Deleting .turbo folder...
if exist .turbo (
    rmdir /s /q .turbo
    echo ✅ .turbo folder deleted
) else (
    echo ℹ️  .turbo folder not found
)

REM Clear Prisma cache
echo.
echo Deleting prisma cache...
if exist node_modules\.prisma (
    rmdir /s /q node_modules\.prisma
    echo ✅ Prisma cache deleted
) else (
    echo ℹ️  Prisma cache not found
)

REM Regenerate Prisma client
echo.
echo Regenerating Prisma client...
npx prisma generate
if %errorlevel% equ 0 (
    echo ✅ Prisma client regenerated successfully
) else (
    echo ❌ Failed to regenerate Prisma client
)

REM Reinstall dependencies
echo.
echo Reinstalling dependencies...
if exist package-lock.json (
    del package-lock.json
    echo ✅ package-lock.json deleted
)

if exist node_modules (
    rmdir /s /q node_modules
    echo ✅ node_modules deleted
)

echo.
echo Installing fresh dependencies...
npm install
if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Failed to install dependencies
)

REM Test the build
echo.
echo Testing build...
npm run build
if %errorlevel% equ 0 (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed - checking for specific errors...
)

echo.
echo 🎉 Cache clearing complete!
echo.
echo You can now try running your development server with:
echo   npm run dev
echo.
pause