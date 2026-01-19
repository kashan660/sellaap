@echo off
echo ========================================
echo AddToCart Auto-Integration Test Script
echo ========================================
echo.
echo This script tests that AddToCart functionality is automatically available
echo for newly created products in your Sellaap application.
echo.
echo Instructions:
echo 1. Start your development server: npm run dev
echo 2. Create a new product in the admin dashboard
echo 3. Run this script to test the AddToCart functionality
echo.

:: Check if server is running
echo Testing server availability...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if "%STATUS%"=="200" (
    echo ✅ Server is running on http://localhost:3000
) else (
    echo ❌ Server is not responding (status: %STATUS%)
    echo Please start your development server first: npm run dev
    pause
    exit /b 1
)

:: Test product pages
echo.
echo Testing product pages...
echo.

echo 1. Testing main products page...
curl -s -o nul -w "%%{http_code}" http://localhost:3000/products > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if "%STATUS%"=="200" (
    echo ✅ Products page is accessible
) else (
    echo ❌ Products page returned status: %STATUS%
)

echo 2. Testing digital products page...
curl -s -o nul -w "%%{http_code}" http://localhost:3000/digital-products > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if "%STATUS%"=="200" (
    echo ✅ Digital products page is accessible
) else (
    echo ❌ Digital products page returned status: %STATUS%
)

echo 3. Testing admin dashboard...
curl -s -o nul -w "%%{http_code}" http://localhost:3000/admin > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if "%STATUS%"=="200" (
    echo ✅ Admin dashboard is accessible
) else (
    echo ❌ Admin dashboard returned status: %STATUS%
)

echo.
echo ========================================
echo Manual Testing Instructions
echo ========================================
echo.
echo 1. Open your browser and navigate to:
echo    - http://localhost:3000/admin (Admin Dashboard)
echo    - http://localhost:3000/products (Products Page)
echo    - http://localhost:3000/digital-products (Digital Products Page)
echo.
echo 2. Create a test product:
echo    - Go to Admin Dashboard
echo    - Click "Add Product"
echo    - Fill in required fields (name, description, price)
echo    - Click "Save"
echo.
echo 3. Verify AddToCart functionality:
echo    - Go to Products page
echo    - Find your new product
echo    - Check that "Add to Cart" button is visible
echo    - Click the "Add to Cart" button
echo    - Verify product appears in cart drawer
echo.
echo 4. Run browser console tests:
echo    - Open browser console (F12)
echo    - Paste and run the test script from test-addtocart-auto.js
echo    - Check the test results in console
echo.
echo ========================================
echo Automated Browser Test
echo ========================================
echo.
echo To run automated browser tests, use this JavaScript in console:
echo.
echo // Load test script
echo fetch('/test-addtocart-auto.js').then(r =^> r.text()).then(code =^> eval(code));
echo.
echo // Run all tests
echo setTimeout(() =^> window.addToCartTests.runAllTests(), 1000);
echo.
echo ========================================
echo Test Complete
echo ========================================
echo.
echo Server and pages tested. Follow the manual testing instructions above
echo to verify AddToCart functionality for newly created products.
echo.
pause