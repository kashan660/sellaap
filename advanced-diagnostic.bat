@echo off
echo 🔍 ADVANCED BUILD DIAGNOSTICS
echo ==============================
echo.

echo 📁 Checking digital-products file integrity...
echo.
type d:\sellaap\src\app\digital-products\page.tsx | findstr /n "import"
echo.

echo 🔍 Counting Link imports in digital-products file...
set count=0
for /f "tokens=*" %%i in ('type d:\sellaap\src\app\digital-products\page.tsx ^| findstr /c:"import Link"') do set /a count+=1
echo Link import count: %count%
echo.

echo 🔍 Checking for hidden characters or encoding issues...
echo First 5 lines with hex dump:
type d:\sellaap\src\app\digital-products\page.tsx | head -5 | hexdump -C 2>nul || echo Hex dump not available, checking raw content:
type d:\sellaap\src\app\digital-products\page.tsx | head -5
echo.

echo 🧹 Clearing cache with force...
echo.
if exist .next (
    rmdir /s /q .next
    echo ✅ .next cleared
)
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules/.cache cleared
)
if exist tsconfig.tsbuildinfo (
    del tsconfig.tsbuildinfo
    echo ✅ tsconfig.tsbuildinfo removed
)

REM Kill any running Node processes
echo 🛑 Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM next.exe 2>nul

echo.
echo 🔄 Regenerating Prisma client...
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma generate failed
    pause
    exit /b 1
)

echo.
echo 🔨 Running build with verbose output...
echo.
npm run build 2>&1 | findstr /n /i "error\|warning\|digital-products\|link"

echo.
echo Build completed. Check output above for specific errors.
pause