# Sellaap Page Testing Script
# Tests all pages with curl commands

$BASE_URL = "http://localhost:3000"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing All Sellaap Pages with Curl" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

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
Write-Host "Templates: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/products/templates"

Write-Host ""
Write-Host "🌍 REGIONAL PAGES:" -ForegroundColor Yellow
Write-Host "Europe: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/europe"
Write-Host "UK: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/uk"
Write-Host "US: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/us"
Write-Host "Canada: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/canada"
Write-Host "Australia: " -NoNewline; curl -s -o $null -w "HTTP %{http_code} - Response Time: %{time_total}s" "$BASE_URL/australia"

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
Write-Host "✅ All page tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")