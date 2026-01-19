@echo off
echo ========================================
echo TESTING ADDTOCART BUTTON ACCESSIBILITY
echo ========================================
echo.

echo 🔍 Testing product page access...
echo.

REM Test the correct URL with proper syntax
echo Testing: http://localhost:3000/products/blender-3d-models
curl -s -w "HTTP Status: %%{http_code} - Response Time: %%{time_total}s" -o nul "http://localhost:3000/products/blender-3d-models"
echo.

echo 🔍 Testing other product pages...
echo.

echo Testing: http://localhost:3000/products/digital-products
curl -s -w "HTTP Status: %%{http_code} - Response Time: %%{time_total}s" -o nul "http://localhost:3000/products/digital-products"
echo.

echo Testing: http://localhost:3000/products/software
curl -s -w "HTTP Status: %%{http_code} - Response Time: %%{time_total}s" -o nul "http://localhost:3000/products/software"
echo.

echo ========================================
echo MANUAL VERIFICATION STEPS:
echo ========================================
echo.
echo 1. Open browser to: http://localhost:3000/products/blender-3d-models
echo 2. Press F12 to open Developer Tools
echo 3. Check Console tab for any JavaScript errors
echo 4. Look for 'Add to Cart' button on the page
echo 5. Right-click button -^> Inspect Element
echo 6. Verify button has proper onClick handler
echo 7. Click the button and observe cart behavior
echo.
echo ========================================
echo BROWSER CONSOLE TESTS:
echo ========================================
echo.
echo Copy and paste these commands in browser console:
echo.
echo // Check if AddToCart button exists
echo document.querySelector('button[onclick*="addItem"]')
echo.
echo // Check localStorage cart data
echo localStorage.getItem('cart')
echo.
echo // Check if CartDrawer is mounted
echo document.querySelector('.fixed.inset-0.z-\[100\]')
echo.
echo ========================================
echo ✅ TESTING COMPLETE!
echo ========================================
echo.
pause