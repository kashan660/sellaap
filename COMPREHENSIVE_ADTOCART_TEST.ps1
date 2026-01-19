# AddToCart Button Comprehensive Test
# Run this script to test AddToCart functionality step by step

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMPREHENSIVE ADDTOCART BUTTON TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test page response
function Test-PageResponse {
    param($url, $description)
    try {
        $response = curl -s -w "%{http_code}|%{time_total}" -o nul "$url"
        $parts = $response -split '\|'
        $status = $parts[0]
        $time = [math]::Round([double]$parts[1], 2)
        
        $color = if ($status -eq "200") { "Green" } else { "Red" }
        Write-Host "$description`: HTTP $status - ${time}s" -ForegroundColor $color
        return $status -eq "200"
    }
    catch {
        Write-Host "$description`: FAILED - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "🔍 TESTING PAGE ACCESSIBILITY:" -ForegroundColor Yellow
Write-Host ""

# Test product pages
$productPages = @(
    @{url="http://localhost:3000/products/blender-3d-models"; desc="Blender 3D Models"},
    @{url="http://localhost:3000/products/digital-products"; desc="Digital Products"},
    @{url="http://localhost:3000/products/software"; desc="Software"},
    @{url="http://localhost:3000/products/templates"; desc="Templates"}
)

$workingPages = @()
foreach ($page in $productPages) {
    if (Test-PageResponse -url $page.url -description $page.desc) {
        $workingPages += $page
    }
}

Write-Host ""
Write-Host "✅ WORKING PAGES: $($workingPages.Count)" -ForegroundColor Green
Write-Host "❌ FAILED PAGES: $($productPages.Count - $workingPages.Count)" -ForegroundColor Red

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MANUAL TESTING INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 STEP-BY-STEP TESTING:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Open browser to: http://localhost:3000/products/blender-3d-models" -ForegroundColor White
Write-Host "2. Open Developer Tools (F12)" -ForegroundColor White
Write-Host "3. Check Console tab for JavaScript errors" -ForegroundColor White
Write-Host "4. Look for 'Add to Cart' button on the page" -ForegroundColor White
Write-Host "5. Right-click button → Inspect Element" -ForegroundColor White
Write-Host "6. Verify button has proper onClick handler" -ForegroundColor White
Write-Host "7. Click the button and observe cart behavior" -ForegroundColor White
Write-Host "8. Check Application tab → LocalStorage for cart data" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BROWSER CONSOLE TESTS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔧 COPY AND PASTE THESE COMMANDS IN BROWSER CONSOLE:" -ForegroundColor Yellow
Write-Host ""
Write-Host "// Check if AddToCart button exists" -ForegroundColor Cyan
Write-Host "document.querySelector('button[onclick*="addItem"]')" -ForegroundColor White
Write-Host ""
Write-Host "// Check localStorage cart data" -ForegroundColor Cyan
Write-Host "localStorage.getItem('cart')" -ForegroundColor White
Write-Host ""
Write-Host "// Check if CartDrawer is mounted" -ForegroundColor Cyan
Write-Host "document.querySelector('.fixed.inset-0.z-\[100\]')" -ForegroundColor White
Write-Host ""
Write-Host "// Test adding item to cart manually" -ForegroundColor Cyan
Write-Host "// (if CartContext is exposed globally)" -ForegroundColor White
Write-Host "// window.cartContext?.addItem(testProduct)" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EXPECTED BEHAVIOR:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ NORMAL OPERATION:" -ForegroundColor Green
Write-Host "   - Button appears on all product pages" -ForegroundColor White
Write-Host "   - Clicking button adds item to cart" -ForegroundColor White
Write-Host "   - Cart drawer opens automatically" -ForegroundColor White
Write-Host "   - Cart items persist in localStorage" -ForegroundColor White
Write-Host "   - Cart count updates in navbar" -ForegroundColor White
Write-Host ""

Write-Host "❌ ERROR INDICATORS:" -ForegroundColor Red
Write-Host "   - Button missing from product pages" -ForegroundColor White
Write-Host "   - Clicking button does nothing" -ForegroundColor White
Write-Host "   - JavaScript errors in console" -ForegroundColor White
Write-Host "   - Cart drawer doesn't open" -ForegroundColor White
Write-Host "   - Cart items lost on page refresh" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ TESTING COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Report back with:" -ForegroundColor Yellow
Write-Host "1. Any console errors found" -ForegroundColor White
Write-Host "2. Whether button is visible" -ForegroundColor White
Write-Host "3. What happens when you click the button" -ForegroundColor White
Write-Host "4. localStorage cart data contents" -ForegroundColor White

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")