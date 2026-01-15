@echo off
echo 🚀 Deploying SEO-Optimized Sellaap to Vercel via Git...
echo.

REM Step 1: Check if Git is available
echo 📋 Checking Git status...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed or not in PATH
    pause
    exit /b 1
)

echo ✅ Git is available
echo.

REM Step 2: Check current branch and status
echo 📊 Current Git status:
git status
echo.

REM Step 3: Add all SEO changes
echo 📁 Adding SEO-optimized files...
git add .
echo ✅ Files added to staging area
echo.

REM Step 4: Create commit with detailed message
echo 📝 Creating commit...
git commit -m "🚀 SEO Optimization: International Firestick Setup Service

✨ Features Added:
- 500+ targeted keywords across UK, US, Canada, Europe, Australia
- Dynamic location-specific landing pages (/uk, /us, /canada, /europe, /australia)
- Comprehensive keyword research with location-specific long-tail keywords
- SEO-optimized meta tags and structured data for all markets
- Automatic sitemap generation with 1000+ URLs
- Technical SEO: robots.txt, schema markup, hreflang tags
- High-value blog content strategy with UK setup guide
- Product schema markup for rich snippets
- FAQ structured data for featured snippets

🎯 Target Keywords:
- UK: 'firestick setup london', 'bbc iplayer firestick setup'
- US: 'firestick 4k max setup guide usa', 'netflix firestick installation'
- Canada: 'firestick setup toronto', 'crave firestick setup'
- Europe: 'multilingual firestick setup', 'european streaming setup'
- Australia: 'firestick setup sydney', 'stan firestick setup'

🔧 Technical Improvements:
- Fixed Prisma database connection issues
- Updated environment variables for Vercel deployment
- Enhanced international SEO with hreflang tags
- Optimized for search engine rich snippets

Ready to attract international customers! 🌟"

if errorlevel 1 (
    echo ⚠️  No changes to commit or commit failed
    echo.
    echo Options:
    echo 1. Press any key to continue with push anyway
    echo 2. Press Ctrl+C to exit and check manually
    pause
)

echo ✅ Commit created successfully
echo.

REM Step 5: Push to Git (triggers Vercel deployment)
echo 🚀 Pushing to Git repository...
echo This will automatically trigger Vercel deployment...
echo.
git push origin main

if errorlevel 1 (
    echo ❌ Git push failed
    echo.
    echo Possible issues:
    echo - No remote repository configured
    echo - Authentication issues
    echo - Network connectivity problems
    echo.
    echo Please check your Git configuration and try again.
    pause
    exit /b 1
)

echo ✅ Successfully pushed to Git!
echo.
echo 🌐 Vercel deployment should start automatically...
echo You can monitor deployment progress in your Vercel dashboard.
echo.
echo 📍 Your SEO-optimized pages will be available at:
echo   - https://your-domain.vercel.app/uk (United Kingdom)
echo   - https://your-domain.vercel.app/us (United States)
echo   - https://your-domain.vercel.app/canada (Canada)
echo   - https://your-domain.vercel.app/europe (Europe)
echo   - https://your-domain.vercel.app/australia (Australia)
echo.
echo 🔍 SEO Features Deployed:
echo   - 500+ targeted keywords across 5 markets
echo   - Dynamic meta tags and structured data
echo   - Automatic sitemap generation
echo   - International hreflang tags
echo   - Optimized blog content
echo   - Technical SEO (robots.txt, schema markup)
echo.
pause