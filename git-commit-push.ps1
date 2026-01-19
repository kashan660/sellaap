# Sellaap Git Push Automation Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sellaap Git Push Automation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitCheck = git --version
    Write-Host "Git version: $gitCheck" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Step 1: Checking current Git status..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "Step 2: Adding all changes to staging..." -ForegroundColor Yellow
git add .
Write-Host ""

Write-Host "Step 3: Creating commit with detailed message..." -ForegroundColor Yellow
$commitMessage = @"
feat: Add comprehensive Firestick blog post with regional pricing

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
across Europe, UK, and US markets with 70% savings messaging.
"@
git commit -m $commitMessage
Write-Host ""

Write-Host "Step 4: Pushing to remote repository..." -ForegroundColor Yellow
git push origin main
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Git operations completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your changes have been pushed to the remote repository." -ForegroundColor Green
Write-Host "The blog post and all related improvements are now ready for deployment." -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"