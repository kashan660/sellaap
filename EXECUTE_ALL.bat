@echo off
echo ========================================
echo Sellaap Git Push and Page Testing
echo ========================================
echo.

echo 🔧 Git Operations:
echo.
echo Step 1: Checking git status...
git status
echo.

echo Step 2: Adding all changes...
git add .
echo.

echo Step 3: Committing changes...
git commit -m "Fix: Add generateCategoryMeta import to products/[slug]/page.tsx for category page functionality"
echo.

echo Step 4: Pushing to remote...
git push origin main
echo.

echo ✅ Git operations completed!
echo.

echo ========================================
echo Page Testing Results:
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

echo.
echo 🌍 REGIONAL PAGES:
echo Europe: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/europe"
echo UK: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/uk"
echo US: & curl -s -o nul -w "HTTP %%{http_code} - Response Time: %%{time_total}s" "%BASE_URL%/us"

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
echo ✅ All operations completed!
echo ========================================
echo.
echo Summary:
echo - HTTP 200: Pages loading successfully
echo - Response time ^< 2s: Good performance
echo - HTTP 404: Broken links need fixing
echo.
pause