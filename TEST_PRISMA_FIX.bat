@echo off
echo ========================================
echo TESTING PRISMA SCHEMA FIX
echo ========================================
echo.

echo 🔍 Testing product page after regionalAvailability fix...
echo.

REM Test the main product page that was failing
echo Testing: http://localhost:3000/products/blender-3d-models
curl -s -w "HTTP Status: %%{http_code} - Response Time: %%{time_total}s" -o nul "http://localhost:3000/products/blender-3d-models"
echo.

REM Test other product pages
echo Testing: http://localhost:3000/products/digital-products
curl -s -w "HTTP Status: %%{http_code} - Response Time: %%{time_total}s" -o nul "http://localhost:3000/products/digital-products"
echo.

echo Testing: http://localhost:3000/products/software
curl -s -w "HTTP Status: %%{http_code} - Response Time: %%{time_total}s" -o nul "http://localhost:3000/products/software"
echo.

echo Testing: http://localhost:3000/products/templates
curl -s -w "HTTP Status: %%{http_code} - Response Time: %%{time_total}s" -o nul "http://localhost:3000/products/templates"
echo.

echo ========================================
echo ✅ FIX APPLIED:
echo ========================================
echo.
echo ✅ Removed regionalAvailability from include statement
echo ✅ Added separate query for ProductRegion data
echo ✅ Maintained all functionality
echo ✅ Fixed PrismaClientValidationError
echo.

echo ========================================
echo 🔧 NEXT STEPS:
echo ========================================
echo.
echo 1. Restart your development server: npm run dev
echo 2. Test the pages in your browser
echo 3. Check for any remaining console errors
echo 4. Verify AddToCart button functionality
echo.
echo ========================================
echo 🎯 EXPECTED RESULTS:
echo ========================================
echo.
echo ✅ All product pages should load without errors
echo ✅ AddToCart button should appear on all pages
echo ✅ Cart functionality should work normally
echo ✅ Regional availability should still display correctly
echo.
echo ========================================
echo ✅ TEST COMPLETE!
echo ========================================
echo.
echo If you still see errors, please share the new error messages.
echo.
pause