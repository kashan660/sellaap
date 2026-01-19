# Sellaap Website Page Testing Results
# =====================================

## 🏠 MAIN PAGES TEST RESULTS
# ===========================

# Homepage
curl -I http://localhost:3000
# Expected: 200 OK

# Products Listing
curl -I http://localhost:3000/products  
# Expected: 200 OK

# Blog Page
curl -I http://localhost:3000/blog
# Expected: 200 OK

# Contact Page  
curl -I http://localhost:3000/contact
# Expected: 200 OK

# Digital Products
curl -I http://localhost:3000/digital-products
# Expected: 200 OK (may show "No Digital Products Available")

# Admin Dashboard
curl -I http://localhost:3000/admin
# Expected: 200 OK (requires admin login)

## 🌍 MARKET-SPECIFIC PAGES
# ==========================

# UK Market
curl -I http://localhost:3000/uk
# Expected: 200 OK

# US Market  
curl -I http://localhost:3000/us
# Expected: 200 OK

# Canada Market
curl -I http://localhost:3000/canada
# Expected: 200 OK

# Europe Market
curl -I http://localhost:3000/europe  
# Expected: 200 OK

# Australia Market
curl -I http://localhost:3000/australia
# Expected: 200 OK

## 🔌 API ENDPOINTS
# ==================

# Categories API
curl -I http://localhost:3000/api/categories
# Expected: 200 OK (returns JSON with categories)

# Products API
curl -I http://localhost:3000/api/products  
# Expected: 200 OK (returns JSON with products)

# Auth Session API
curl -I http://localhost:3000/api/auth/session
# Expected: 200 OK (returns session data or empty)

## 📱 PRODUCTION SITE TESTS
# ==========================

# Production Homepage
curl -I https://sellaap.vercel.app
# Expected: 200 OK

# Production Products
curl -I https://sellaap.vercel.app/products
# Expected: 200 OK

# Production Blog
curl -I https://sellaap.vercel.app/blog
# Expected: 200 OK

## 🎯 DYNAMIC PAGES TO TEST
# ==========================

# IMPORTANT: Replace these with actual slugs from your database
# You can find actual slugs by running:
# curl http://localhost:3000/api/categories | jq '.categories[].slug'
# curl http://localhost:3000/api/products | jq '.products[].slug'

# Test Categories (these should exist based on your setup)
curl -I http://localhost:3000/Products/blender-3d-models
curl -I http://localhost:3000/Products/firestick-setups  
curl -I http://localhost:3000/Products/digital-goods

# Test Individual Products
curl -I http://localhost:3000/products/firestick-setup-uk
curl -I http://localhost:3000/products/4k-firestick-max

# Test Blog Posts  
curl -I http://localhost:3000/blog/affordable-firestick-services-europe-uk-us
curl -I http://localhost:3000/blog/firestick-setup-uk-complete-guide

## 🚨 COMMON ISSUES TO CHECK
# ===========================

# 404 Errors - Usually mean:
# - Page doesn't exist
# - Wrong URL structure
# - Missing file in app directory

# 500 Errors - Usually mean:
# - Database connection issues
# - Code errors in page.tsx files
# - Missing dependencies

# Connection Refused - Usually mean:
# - Development server not running
# - Wrong port (should be 3000)
# - Server crashed

## 🔍 DETAILED CONTENT TESTING
# =============================

# To see actual page content (not just headers):
curl http://localhost:3000/products | head -20
curl http://localhost:3000/api/categories

# To test with different user agents:
curl -A "Mozilla/5.0" -I http://localhost:3000

# To test from different locations (using your location detection):
curl -H "CF-IPCountry: GB" -I http://localhost:3000  # UK
curl -H "CF-IPCountry: US" -I http://localhost:3000  # US

## 📊 INTERPRETING RESULTS
# =======================

# ✅ 200 OK - Page loads successfully
# ❌ 404 Not Found - Page doesn't exist  
# 🔥 500 Server Error - Code/Database issue
# 🔒 401 Unauthorized - Login required
# 🚫 403 Forbidden - Access denied
# ↗️ 301/302 - Redirect (check Location header)

# Quick status check for all main pages:
echo "Testing all main pages..." && \
echo "Homepage:" && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && \
echo && echo "Products:" && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/products && \
echo && echo "Blog:" && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/blog