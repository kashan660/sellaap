@echo off
echo 🎯 FINAL BUILD DIAGNOSTICS
echo ============================
echo.

echo 📋 Step 1: Verifying file recreation...
echo.
echo Digital products file content (first 10 lines):
type d:\sellaap\src\app\digital-products\page.tsx | head -10
echo.

echo 🔍 Step 2: Exact import analysis...
echo.
echo Line-by-line import check:
type d:\sellaap\src\app\digital-products\page.tsx | findstr /n "^import"
echo.

echo 📊 Step 3: Counting imports...
echo.
set total_lines=0
set import_lines=0
for /f "tokens=*" %%i in ('type d:\sellaap\src\app\digital-products\page.tsx ^| findstr /n "^"') do set /a total_lines+=1
for /f "tokens=*" %%i in ('type d:\sellaap\src\app\digital-products\page.tsx ^| findstr /n "^import"') do set /a import_lines+=1
echo Total lines: %total_lines%
echo Import lines: %import_lines%
echo.

echo 🔍 Step 4: Checking for duplicate Link specifically...
echo.
type d:\sellaap\src\app\digital-products\page.tsx | findstr /n "import Link"
set link_count=0
for /f "tokens=*" %%i in ('type d:\sellaap\src\app\digital-products\page.tsx ^| findstr /c:"import Link"') do set /a link_count+=1
echo Link import count: %link_count%
echo.

echo 🧹 Step 5: Ultra cache clear...
echo.
echo Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM next.exe 2>nul
timeout /t 2 /nobreak >nul

echo Removing all cache directories...
if exist .next (
    rmdir /s /q .next
    echo ✅ .next removed
)
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules/.cache removed
)
if exist tsconfig.tsbuildinfo (
    del tsconfig.tsbuildinfo
    echo ✅ tsconfig.tsbuildinfo removed
)
if exist dist (
    rmdir /s /q dist
    echo ✅ dist removed
)
if exist .turbo (
    rmdir /s /q .turbo
    echo ✅ .turbo removed
)

echo Clearing npm cache...
npm cache clean --force

echo.
echo 🔄 Step 6: Fresh Prisma generation...
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma generate failed
    pause
    exit /b 1
)

echo.
echo 🔨 Step 7: Build attempt...
echo.
npm run build

echo.
echo 🎯 Diagnostics complete. Check build output above.
pause