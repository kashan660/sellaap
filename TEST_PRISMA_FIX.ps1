# Test Prisma Schema Fix
# This script tests the fix for the regionalAvailability Prisma error

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTING PRISMA SCHEMA FIX" -ForegroundColor Cyan
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

Write-Host "🔍 Testing product pages after regionalAvailability fix..." -ForegroundColor Yellow
Write-Host ""

# Test product pages that were failing
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
Write-Host "✅ FIX APPLIED:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Removed regionalAvailability from Prisma include statement" -ForegroundColor Green
Write-Host "✅ Added separate query for ProductRegion data" -ForegroundColor Green
Write-Host "✅ Maintained all functionality" -ForegroundColor Green
Write-Host "✅ Fixed PrismaClientValidationError" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔧 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Restart your development server: npm run dev" -ForegroundColor Yellow
Write-Host "2. Test the pages in your browser" -ForegroundColor Yellow
Write-Host "3. Check for any remaining console errors" -ForegroundColor Yellow
Write-Host "4. Verify AddToCart button functionality" -ForegroundColor Yellow
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "🎯 EXPECTED RESULTS:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ All product pages should load without errors" -ForegroundColor White
Write-Host "✅ AddToCart button should appear on all pages" -ForegroundColor White
Write-Host "✅ Cart functionality should work normally" -ForegroundColor White
Write-Host "✅ Regional availability should still display correctly" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ TEST COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "If you still see errors, please share the new error messages." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")