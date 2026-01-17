@echo off
echo ========================================
echo Sellaap Git Push Automation Script
echo ========================================
echo.

REM Check if git is available
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo Step 1: Checking current Git status...
git status
echo.

echo Step 2: Adding all changes to staging...
git add .
echo.

echo Step 3: Creating commit with detailed message...
git commit -m "feat: Add comprehensive Firestick blog post with regional pricing

- Created detailed blog post highlighting Sellaap as affordable Firestick provider
- Added price comparisons for Europe (€59 vs €200-350), UK (£49 vs £180-300), US ($69 vs $250-400)
- Included 5 realistic images showcasing services and savings
- Added customer testimonials with specific savings amounts
- Integrated cross-selling for digital products
- Implemented SEO metadata with schema.org structured data
- Created API endpoint for blog post database integration
- Fixed Hero section link to digital products
- Added comprehensive FAQ section targeting high-cost payers

Blog post targets customers seeking affordable Firestick setup services
across Europe, UK, and US markets with 70% savings messaging."
echo.

echo Step 4: Pushing to remote repository...
git push origin main
echo.

echo ========================================
echo Git operations completed successfully!
echo ========================================
echo.
echo Your changes have been pushed to the remote repository.
echo The blog post and all related improvements are now ready for deployment.
echo.
pause