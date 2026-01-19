@echo off
echo 🔍 Testing all Sellaap pages with curl...
echo ==================================

REM Base URL - adjust as needed for your environment
set BASE_URL=http://localhost:3000

echo 📋 Testing Main Pages:
echo -------------------

curl -s -o nul -w "Home Page: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/"
curl -s -o nul -w "Products Page: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/products"
curl -s -o nul -w "Blog Page: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/blog"
curl -s -o nul -w "Contact Page: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/contact"

echo.
echo 📁 Testing Category Pages:
echo ------------------------

curl -s -o nul -w "Blender 3D Models: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/Products/blender-3d-models"
curl -s -o nul -w "Digital Products: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/Products/digital-products"
curl -s -o nul -w "Software: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/Products/software"
curl -s -o nul -w "Templates: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/Products/templates"

echo.
echo 🌍 Testing Regional Pages:
echo -------------------------

curl -s -o nul -w "Europe: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/europe"
curl -s -o nul -w "UK: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/uk"
curl -s -o nul -w "US: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/us"
curl -s -o nul -w "Canada: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/canada"
curl -s -o nul -w "Australia: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/australia"

echo.
echo 🔐 Testing Auth Pages:
echo -------------------

curl -s -o nul -w "Sign In: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/auth/signin"
curl -s -o nul -w "Sign Up: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/auth/signup"

echo.
echo 🔌 Testing API Endpoints:
echo ---------------------

curl -s -o nul -w "Categories API: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/api/categories"
curl -s -o nul -w "Products API: %%{http_code} - %%{time_total}s\n" "%BASE_URL%/api/products"

echo.
echo ✅ Curl testing complete!
echo Check the results above for any 404 or 500 errors.
pause