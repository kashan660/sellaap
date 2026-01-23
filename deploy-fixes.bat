@echo off
echo ========================================
echo Pushing Fixes and New Brand Logo
echo ========================================

echo 1. Adding changed files...
git add src/context/CurrencyContext.tsx
git add src/app/api/geo/route.ts
git add src/lib/auth.ts
git add public/logo.svg
git add src/components/BrandLogo.tsx
git add src/components/Navbar.tsx
git add src/components/Footer.tsx

echo.
echo 2. Committing changes...
git commit -m "Feat: Add new premium brand logo and fix CORS/Auth issues"

echo.
echo 3. Pushing to remote...
git push

echo.
echo ========================================
echo Deployment triggered! 
echo Please check Vercel dashboard for build status.
echo After deployment completes (approx 2 mins), test the live site.
echo ========================================
pause
