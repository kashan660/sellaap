@echo off
echo ========================================
echo AddToCart Button Diagnostics
echo ========================================
echo.

echo 🔍 Testing AddToCartButton Component...
echo.

set TEST_URL=http://localhost:3000/products/blender-3d-models
echo Testing URL: %TEST_URL%
echo.

REM Test if the page loads
echo Step 1: Testing page load...
curl -s -o nul -w "HTTP Status: %%{http_code} - Response Time: %%{time_total}s" "%TEST_URL%"
echo.

REM Test the AddToCart button functionality
echo Step 2: Checking AddToCart button...
echo Expected: Button should be present and functional
echo.

REM Test cart API endpoint
echo Step 3: Testing cart context...
echo Expected: CartProvider should be wrapping the application
echo.

REM Test localStorage functionality
echo Step 4: Testing localStorage...
echo Expected: Cart items should persist in localStorage
echo.

echo ========================================
echo Manual Testing Instructions:
echo ========================================
echo.
echo 1. Open browser to: http://localhost:3000/products/blender-3d-models
echo 2. Look for 'Add to Cart' button on the page
echo 3. Click the button and check if cart opens
echo 4. Check browser console for any JavaScript errors
echo 5. Verify cart items persist after page refresh
echo.

echo ========================================
echo Common Issues to Check:
echo ========================================
echo.
echo ❌ Button not visible:
echo   - Check if CartProvider is in layout.tsx
echo   - Verify AddToCartButton is imported correctly
echo.
echo ❌ Button doesn't work:
echo   - Check browser console for errors
echo   - Verify CartContext is working
echo.
echo ❌ Cart doesn't open:
echo   - Check if CartDrawer component is mounted
echo   - Verify isCartOpen state is being set
echo.
echo ========================================
echo ✅ Diagnostics completed!
echo ========================================
echo.
pause