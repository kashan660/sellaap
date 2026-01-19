@echo off
echo ========================================
echo Testing All Sellaap Pages with Curl
echo ========================================
echo.

set BASE_URL=http://localhost:3000

echo 📋 MAIN PAGES:
echo Home Page: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/"
echo Products Page: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/products"
echo Blog Page: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/blog"
echo Contact Page: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/contact"

echo.
echo 📁 CATEGORY PAGES:
echo Blender 3D Models: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/products/blender-3d-models"
echo Digital Products: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/products/digital-products"
echo Software: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/products/software"
echo Templates: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/products/templates"

echo.
echo 🌍 REGIONAL PAGES:
echo Europe: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/europe"
echo UK: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/uk"
echo US: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/us"
echo Canada: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/canada"
echo Australia: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/australia"

echo.
echo 🔐 AUTH PAGES:
echo Sign In: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/auth/signin"
echo Sign Up: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/auth/signup"

echo.
echo 🔌 API ENDPOINTS:
echo Categories API: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/api/categories"
echo Products API: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/api/products"

echo.
echo 📝 BLOG POSTS:
echo Firestick Provider Blog: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/blog/best-cheap-firestick-provider-europe-uk-us"

echo.
echo ========================================
echo ✅ All page tests completed!
echo ========================================
echo.
pause