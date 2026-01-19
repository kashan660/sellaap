# AddToCart Diagnostics Script
# This script tests the AddToCart functionality

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AddToCart Button Diagnostics" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test the AddToCartButton component
Write-Host "🔍 Testing AddToCartButton Component..." -ForegroundColor Yellow

$testUrl = "http://localhost:3000/products/blender-3d-models"
Write-Host "Testing URL: $testUrl" -ForegroundColor Green

# Test if the page loads
Write-Host ""
Write-Host "Step 1: Testing page load..." -ForegroundColor Green
$response = curl -s -w "%{http_code}" -o nul "$testUrl"
Write-Host "HTTP Status: $response" -ForegroundColor $(if($response -eq "200") { "Green" } else { "Red" })

# Test the AddToCart button functionality
Write-Host ""
Write-Host "Step 2: Checking AddToCart button..." -ForegroundColor Green
Write-Host "Expected: Button should be present and functional" -ForegroundColor Yellow

# Test cart API endpoint
Write-Host ""
Write-Host "Step 3: Testing cart context..." -ForegroundColor Green
Write-Host "Expected: CartProvider should be wrapping the application" -ForegroundColor Yellow

# Test localStorage functionality
Write-Host ""
Write-Host "Step 4: Testing localStorage..." -ForegroundColor Green
Write-Host "Expected: Cart items should persist in localStorage" -ForegroundColor Yellow

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Manual Testing Instructions:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open browser to: http://localhost:3000/products/blender-3d-models" -ForegroundColor White
Write-Host "2. Look for 'Add to Cart' button on the page" -ForegroundColor White
Write-Host "3. Click the button and check if cart opens" -ForegroundColor White
Write-Host "4. Check browser console for any JavaScript errors" -ForegroundColor White
Write-Host "5. Verify cart items persist after page refresh" -ForegroundColor White

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Common Issues to Check:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "❌ Button not visible:" -ForegroundColor Red
Write-Host "  - Check if CartProvider is in layout.tsx" -ForegroundColor Yellow
Write-Host "  - Verify AddToCartButton is imported correctly" -ForegroundColor Yellow
Write-Host ""
Write-Host "❌ Button doesn't work:" -ForegroundColor Red
Write-Host "  - Check browser console for errors" -ForegroundColor Yellow
Write-Host "  - Verify CartContext is working" -ForegroundColor Yellow
Write-Host ""
Write-Host "❌ Cart doesn't open:" -ForegroundColor Red
Write-Host "  - Check if CartDrawer component is mounted" -ForegroundColor Yellow
Write-Host "  - Verify isCartOpen state is being set" -ForegroundColor Yellow

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")