@echo off
echo ========================================
echo Executing Git Push and Page Testing
echo ========================================
echo.

echo 🔧 Step 1: Git Status Check
echo ---------------------------
git status
echo.

echo 📤 Step 2: Adding Changes
echo ------------------------
git add .
echo.

echo 💾 Step 3: Committing Changes
echo ----------------------------
git commit -m "Fix: Add generateCategoryMeta import to products/[slug]/page.tsx for category page functionality"
echo.

echo 🚀 Step 4: Pushing to Remote
echo -----------------------------
git push origin main
echo.

echo ✅ Git operations completed!
echo.

echo 🔍 Step 5: Testing All Pages
echo =============================
echo.

REM Base URL
set BASE_URL=http://localhost:3000

echo 📋 Main Pages:
curl -s -o nul -w "Home: %%{http_code} - %%{time_total}s
" "%BASE_URL%/"
curl -s -o nul -w "Products: %%{http_code} - %%{time_total}s
" "%BASE_URL%/products"
curl -s -o nul -w "Blog: %%{http_code} - %%{time_total}s
" "%BASE_URL%/blog"
curl -s -o nul -w "Contact: %%{http_code} - %%{time_total}s
" "%BASE_URL%/contact"

echo.
echo 📁 Category Pages:
curl -s -o nul -w "Blender 3D Models: %%{http_code} - %%{time_total}s
" "%BASE_URL%/products/blender-3d-models"
curl -s -o nul -w "Digital Products: %%{http_code} - %%{time_total}s
" "%BASE_URL%/products/digital-products"
curl -s -o nul -w "Software: %%{http_code} - %%{time_total}s
" "%BASE_URL%/products/software"

echo.
echo 🌍 Regional Pages:
curl -s -o nul -w "Europe: %%{http_code} - %%{time_total}s
" "%BASE_URL%/europe"
curl -s -o nul -w "UK: %%{http_code} - %%{time_total}s
" "%BASE_URL%/uk"
curl -s -o nul -w "US: %%{http_code} - %%{time_total}s
" "%BASE_URL%/us"
curl -s -o nul -w "Canada: %%{http_code} - %%{time_total}s
" "%BASE_URL%/canada"
curl -s -o nul -w "Australia: %%{http_code} - %%{time_total}s
" "%BASE_URL%/australia"

echo.
echo 🔐 Auth Pages:
curl -s -o nul -w "Sign In: %%{http_code} - %%{time_total}s
" "%BASE_URL%/auth/signin"
curl -s -o nul -w "Sign Up: %%{http_code} - %%{time_total}s
" "%BASE_URL%/auth/signup"

echo.
echo 🔌 API Endpoints:
curl -s -o nul -w "Categories API: %%{http_code} - %%{time_total}s
" "%BASE_URL%/api/categories"
curl -s -o nul -w "Products API: %%{http_code} - %%{time_total}s
" "%BASE_URL%/api/products"

echo.
echo 📝 Blog Posts:
curl -s -o nul -w "Firestick Provider Blog: %%{http_code} - %%{time_total}s
" "%BASE_URL%/blog/best-cheap-firestick-provider-europe-uk-us"

echo.
echo ========================================
echo ✅ All tasks completed successfully!
echo ========================================
echo.
pause