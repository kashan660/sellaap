@echo off
echo 🚀 Deploying SEO-Optimized Sellaap Website...
echo.

REM Step 1: Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Step 2: Generate Prisma client
echo 🔧 Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

REM Step 3: Build the Next.js application
echo 🏗️  Building Next.js application...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

REM Step 4: Deploy to Vercel
echo 🌐 Deploying to Vercel...
call npx vercel --prod --yes
if errorlevel 1 (
    echo ❌ Vercel deployment failed
    pause
    exit /b 1
)

echo.
echo ✅ SEO-Optimized Website Deployed Successfully!
echo 🌐 Your international Firestick setup service is now live!
echo.
echo 📍 Location-specific pages created:
echo   - /uk (United Kingdom)
echo   - /us (United States) 
echo   - /canada (Canada)
echo   - /europe (Europe)
echo   - /australia (Australia)
echo.
echo 🔍 SEO Features Implemented:
echo   - 500+ targeted keywords across 5 markets
echo   - Dynamic meta tags and structured data
echo   - Automatic sitemap generation
echo   - International hreflang tags
echo   - Optimized blog content
echo   - Technical SEO (robots.txt, schema markup)
echo.
pause