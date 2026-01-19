Write-Host "🧪 Testing Sellaap Website Pages" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host

function Test-Url {
    param(
        [string]$url,
        [string]$description
    )
    
    Write-Host "Testing: $description" -ForegroundColor Yellow
    Write-Host "URL: $url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method HEAD -ErrorAction Stop
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200) {
            Write-Host "✅ Status: $statusCode (OK)" -ForegroundColor Green
        } elseif ($statusCode -eq 404) {
            Write-Host "❌ Status: $statusCode (Not Found)" -ForegroundColor Red
        } elseif ($statusCode -eq 500) {
            Write-Host "🔥 Status: $statusCode (Server Error)" -ForegroundColor Red
        } else {
            Write-Host "⚠️  Status: $statusCode" -ForegroundColor Yellow
        }
    } catch {
        $errorMessage = $_.Exception.Message
        if ($errorMessage -like "*404*") {
            Write-Host "❌ Status: 404 (Not Found)" -ForegroundColor Red
        } elseif ($errorMessage -like "*500*") {
            Write-Host "🔥 Status: 500 (Server Error)" -ForegroundColor Red
        } else {
            Write-Host "❌ Error: $errorMessage" -ForegroundColor Red
        }
    }
    Write-Host
}

# Test Local Development Server
Write-Host "🔧 LOCAL DEVELOPMENT SERVER TESTS" -ForegroundColor Magenta
Write-Host "==================================" -ForegroundColor Magenta
Write-Host

Test-Url "http://localhost:3000" "Homepage"
Test-Url "http://localhost:3000/products" "Products Listing"
Test-Url "http://localhost:3000/blog" "Blog Page"
Test-Url "http://localhost:3000/contact" "Contact Page"
Test-Url "http://localhost:3000/digital-products" "Digital Products"

# Test Market Pages
Write-Host "Testing Market-Specific Pages:" -ForegroundColor Yellow
Test-Url "http://localhost:3000/uk" "UK Market"
Test-Url "http://localhost:3000/us" "US Market"
Test-Url "http://localhost:3000/canada" "Canada Market"
Test-Url "http://localhost:3000/europe" "Europe Market"
Test-Url "http://localhost:3000/australia" "Australia Market"

# Test API Endpoints
Write-Host "Testing API Endpoints:" -ForegroundColor Yellow
Test-Url "http://localhost:3000/api/categories" "Categories API"
Test-Url "http://localhost:3000/api/products" "Products API"
Test-Url "http://localhost:3000/api/auth/session" "Auth Session API"

# Test Production Site
Write-Host "🌐 PRODUCTION SITE TESTS" -ForegroundColor Magenta
Write-Host "=========================" -ForegroundColor Magenta
Write-Host

Test-Url "https://sellaap.vercel.app" "Production Homepage"
Test-Url "https://sellaap.vercel.app/products" "Production Products"
Test-Url "https://sellaap.vercel.app/blog" "Production Blog"

# Test specific product and category pages
Write-Host "Testing Specific Pages:" -ForegroundColor Yellow
Test-Url "http://localhost:3000/products/firestick-setup-uk" "Product: Firestick Setup UK"
Test-Url "http://localhost:3000/Products/blender-3d-models" "Category: Blender 3D Models"

# Test blog posts
Test-Url "http://localhost:3000/blog/affordable-firestick-services-europe-uk-us" "Blog: Affordable Firestick Services"
Test-Url "http://localhost:3000/blog/firestick-setup-uk-complete-guide" "Blog: Firestick Setup Guide"

Write-Host "🎉 Testing Complete!" -ForegroundColor Green
Write-Host
Write-Host "To test more specific pages, use:" -ForegroundColor Cyan
Write-Host "curl -I http://localhost:3000/products/[product-slug]" -ForegroundColor Gray
Write-Host "curl -I http://localhost:3000/Products/[category-slug]" -ForegroundColor Gray
Write-Host "curl -I http://localhost:3000/blog/[blog-slug]" -ForegroundColor Gray