#!/bin/bash

echo "🔍 Testing all Sellaap pages with curl..."
echo "=================================="

# Base URL - adjust as needed for your environment
BASE_URL="http://localhost:3000"

# Test main pages
echo "📋 Testing Main Pages:"
echo "-------------------"

curl -s -o /dev/null -w "Home Page: %{http_code} - %{time_total}s\n" "$BASE_URL/"
curl -s -o /dev/null -w "Products Page: %{http_code} - %{time_total}s\n" "$BASE_URL/products"
curl -s -o /dev/null -w "Blog Page: %{http_code} - %{time_total}s\n" "$BASE_URL/blog"
curl -s -o /dev/null -w "Contact Page: %{http_code} - %{time_total}s\n" "$BASE_URL/contact"

# Test category pages
echo ""
echo "📁 Testing Category Pages:"
echo "------------------------"

curl -s -o /dev/null -w "Blender 3D Models: %{http_code} - %{time_total}s\n" "$BASE_URL/Products/blender-3d-models"
curl -s -o /dev/null -w "Digital Products: %{http_code} - %{time_total}s\n" "$BASE_URL/Products/digital-products"
curl -s -o /dev/null -w "Software: %{http_code} - %{time_total}s\n" "$BASE_URL/Products/software"
curl -s -o /dev/null -w "Templates: %{http_code} - %{time_total}s\n" "$BASE_URL/Products/templates"

# Test regional pages
echo ""
echo "🌍 Testing Regional Pages:"
echo "-------------------------"

curl -s -o /dev/null -w "Europe: %{http_code} - %{time_total}s\n" "$BASE_URL/europe"
curl -s -o /dev/null -w "UK: %{http_code} - %{time_total}s\n" "$BASE_URL/uk"
curl -s -o /dev/null -w "US: %{http_code} - %{time_total}s\n" "$BASE_URL/us"
curl -s -o /dev/null -w "Canada: %{http_code} - %{time_total}s\n" "$BASE_URL/canada"
curl -s -o /dev/null -w "Australia: %{http_code} - %{time_total}s\n" "$BASE_URL/australia"

# Test auth pages
echo ""
echo "🔐 Testing Auth Pages:"
echo "-------------------"

curl -s -o /dev/null -w "Sign In: %{http_code} - %{time_total}s\n" "$BASE_URL/auth/signin"
curl -s -o /dev/null -w "Sign Up: %{http_code} - %{time_total}s\n" "$BASE_URL/auth/signup"

# Test API endpoints
echo ""
echo "🔌 Testing API Endpoints:"
echo "---------------------"

curl -s -o /dev/null -w "Categories API: %{http_code} - %{time_total}s\n" "$BASE_URL/api/categories"
curl -s -o /dev/null -w "Products API: %{http_code} - %{time_total}s\n" "$BASE_URL/api/products"

echo ""
echo "✅ Curl testing complete!"
echo "Check the results above for any 404 or 500 errors."