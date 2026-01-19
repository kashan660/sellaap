@echo off
echo 🔄 Quick Prisma Regeneration...
echo ======================================

echo Regenerating Prisma client...
npx prisma generate --force

if %errorlevel% neq 0 (
    echo ❌ Prisma generate failed
    echo Trying with npm install...
    npm install
    npx prisma generate
) else (
    echo ✅ Prisma client regenerated successfully
)

echo.
echo 🧪 Testing if build error is resolved...
echo Running quick build test...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build still failing
    echo Run clear-cache-and-rebuild.bat for full cache clear
) else (
    echo ✅ Build successful!
)

echo.
pause