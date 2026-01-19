# Sellaap Git Push and Page Testing Script
# Execute this script to push code and test all pages

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sellaap Git Push and Page Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Git Operations
Write-Host "🔧 Git Operations:" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Step 1: Checking git status..." -ForegroundColor Green
    git status
    Write-Host ""
    
    Write-Host "Step 2: Adding all changes..." -ForegroundColor Green
    git add .
    Write-Host ""
    
    Write-Host "Step 3: Committing changes..." -ForegroundColor Green
    git commit -m "Fix: Add generateCategoryMeta import to products/[slug]/page.tsx for category page functionality"
    Write-Host ""
    
    Write-Host "Step 4: Pushing to remote..." -ForegroundColor Green
    git push origin main
    Write-Host ""
    
    Write-Host "✅ Git operations completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Git operation failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Page Testing Results:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$BASE_URL = "http://localhost:3000"

# Test Main Pages
Write-Host "📋 MAIN PAGES:" -ForegroundColor Yellow
Write-Host "Home Page: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/"
Write-Host "Products Page: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/products"
Write-Host "Blog Page: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/blog"
Write-Host "Contact Page: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/contact"

Write-Host ""
Write-Host "📁 CATEGORY PAGES:" -ForegroundColor Yellow
Write-Host "Blender 3D Models: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/products/blender-3d-models"
Write-Host "Digital Products: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/products/digital-products"
Write-Host "Software: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/products/software"

Write-Host ""
Write-Host "🌍 REGIONAL PAGES:" -ForegroundColor Yellow
Write-Host "Europe: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/europe"
Write-Host "UK: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/uk"
Write-Host "US: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/us"

Write-Host ""
Write-Host "🔐 AUTH PAGES:" -ForegroundColor Yellow
Write-Host "Sign In: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/auth/signin"
Write-Host "Sign Up: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/auth/signup"

Write-Host ""
Write-Host "🔌 API ENDPOINTS:" -ForegroundColor Yellow
Write-Host "Categories API: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/api/categories"
Write-Host "Products API: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/api/products"

Write-Host ""
Write-Host "📝 BLOG POSTS:" -ForegroundColor Yellow
Write-Host "Firestick Provider Blog: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/blog/best-cheap-firestick-provider-europe-uk-us"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ All operations completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- HTTP 200: Pages loading successfully" -ForegroundColor Green
Write-Host "- Response time < 2s: Good performance" -ForegroundColor Green
Write-Host "- HTTP 404: Broken links need fixing" -ForegroundColor Red
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")