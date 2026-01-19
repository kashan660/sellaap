@echo off
echo Testing Sellaap Website Pages...
echo ========================================
echo.

REM Test main pages
echo 1. Testing Homepage...
curl -I http://localhost:3000
echo.

echo 2. Testing Products Page...
curl -I http://localhost:3000/products
echo.

echo 3. Testing Blog Page...
curl -I http://localhost:3000/blog
echo.

echo 4. Testing Contact Page...
curl -I http://localhost:3000/contact
echo.

echo 5. Testing Digital Products Page...
curl -I http://localhost:3000/digital-products
echo.

REM Test market-specific pages
echo 6. Testing UK Market Page...
curl -I http://localhost:3000/uk
echo.

echo 7. Testing US Market Page...
curl -I http://localhost:3000/us
echo.

echo 8. Testing Canada Market Page...
curl -I http://localhost:3000/canada
echo.

echo 9. Testing Europe Market Page...
curl -I http://localhost:3000/europe
echo.

echo 10. Testing Australia Market Page...
curl -I http://localhost:3000/australia
echo.

REM Test API endpoints
echo 11. Testing Categories API...
curl -I http://localhost:3000/api/categories
echo.

echo 12. Testing Products API...
curl -I http://localhost:3000/api/products
echo.

echo 13. Testing Auth API...
curl -I http://localhost:3000/api/auth/session
echo.

echo ========================================
echo Testing completed!
echo.
echo To test specific product/category pages, run:
echo curl -I http://localhost:3000/products/[product-slug]
echo curl -I http://localhost:3000/Products/[category-slug]
echo.
pause