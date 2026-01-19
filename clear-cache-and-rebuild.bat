@echo off
echo 🧹 Clearing Next.js Build Cache...
echo ======================================

REM Stop any running dev server
echo Stopping any running processes...
taskkill /F /IM node.exe 2>nul

REM Remove Next.js cache directories
echo Removing Next.js cache...
if exist .next (
    echo Deleting .next folder...
    rmdir /s /q .next
    echo ✅ .next folder deleted
) else (
    echo .next folder not found
)

if exist node_modules\.cache (
    echo Deleting node_modules\.cache...
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules\.cache deleted
) else (
    echo node_modules\.cache not found
)

if exist node_modules\.next (
    echo Deleting node_modules\.next...
    rmdir /s /q node_modules\.next
    echo ✅ node_modules\.next deleted
) else (
    echo node_modules\.next not found
)

REM Remove Prisma cache
echo Removing Prisma cache...
if exist node_modules\.prisma (
    echo Deleting node_modules\.prisma...
    rmdir /s /q node_modules\.prisma
    echo ✅ node_modules\.prisma deleted
) else (
    echo node_modules\.prisma not found
)

if exist node_modules\@prisma\client (
    echo Deleting node_modules\@prisma\client...
    rmdir /s /q node_modules\@prisma\client
    echo ✅ node_modules\@prisma\client deleted
) else (
    echo node_modules\@prisma\client not found
)

REM Remove Turbopack cache
echo Removing Turbopack cache...
if exist .turbo (
    echo Deleting .turbo folder...
    rmdir /s /q .turbo
    echo ✅ .turbo folder deleted
) else (
    echo .turbo folder not found
)

if exist node_modules\.turbo (
    echo Deleting node_modules\.turbo...
    rmdir /s /q node_modules\.turbo
    echo ✅ node_modules\.turbo deleted
) else (
    echo node_modules\.turbo not found
)

echo.
echo 🔄 Regenerating Prisma Client...
echo ======================================
npx prisma generate --force

if %errorlevel% neq 0 (
    echo ❌ Prisma generate failed
    echo Trying alternative approach...
    npm install
    npx prisma generate
) else (
    echo ✅ Prisma client regenerated successfully
)

echo.
echo 🧪 Testing Build...
echo ======================================
echo Running build test...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed - checking for remaining issues
    echo.
    echo 🔍 Checking for missing files...
    if not exist src\lib\auth.ts (
        echo ❌ src/lib/auth.ts is missing!
    ) else (
        echo ✅ src/lib/auth.ts exists
    )
    
    if not exist src\lib\prisma.ts (
        echo ❌ src/lib/prisma.ts is missing!
    ) else (
        echo ✅ src/lib/prisma.ts exists
    )
) else (
    echo ✅ Build successful!
)

echo.
echo 🎉 Cache clearing complete!
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Test the dropdown functionality
echo 3. Check if the build error is resolved
echo.
pause