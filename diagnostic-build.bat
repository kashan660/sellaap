@echo off
echo 🔍 DIAGNOSTIC BUILD CHECK - Identifying Errors
echo ==============================================
echo.

echo 🧪 Step 1: Check for TypeScript errors...
npx tsc --noEmit --pretty 2>&1
if %errorlevel% neq 0 (
    echo ❌ TypeScript errors found above!
    echo.
) else (
    echo ✅ No TypeScript errors detected
)

echo.
echo 🔍 Step 2: Check Next.js build specifically...
echo Running Next.js build with verbose output...
npm run build 2>&1 | findstr /i "error\|failed\|cannot\|missing"

echo.
echo 🎯 Step 3: Check key files for common issues...
echo Checking imports in digital-products/page.tsx...
grep -n "import.*Link" d:\sellaap\src\app\digital-products\page.tsx 2>nul || echo ⚠️  Link import check failed

echo.
echo Checking Prisma usage in products/[slug]/page.tsx...
grep -n "prisma\.productRegion" d:\sellaap\src\app\products\[slug]\page.tsx 2>nul || echo ⚠️  Prisma casing check failed

echo.
echo Checking Suspense in auth/signin/page.tsx...
grep -n "Suspense" d:\sellaap\src\app\auth\signin\page.tsx 2>nul || echo ⚠️  Suspense import check failed

echo.
echo 📋 Step 4: Checking for missing dependencies...
npm list next react typescript @types/react 2>nul || echo ⚠️  Dependency check failed

echo.
echo 🔧 RECOMMENDATION:
echo Based on the diagnostic, run this command to see the full error:
echo   npm run build 2>&1 ^| more
echo.
echo Or use the comprehensive fix script:
echo   resolve-build-errors.bat
pause