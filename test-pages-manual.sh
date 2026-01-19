# Sellaap Website Page Testing Commands
# =====================================

# Copy and paste these commands one by one to test your website pages

# 🔧 LOCAL DEVELOPMENT TESTS (localhost:3000)
# ===========================================

# Main Pages
curl -I http://localhost:3000                    # Homepage
curl -I http://localhost:3000/products          # Products Listing
curl -I http://localhost:3000/blog              # Blog Page
curl -I http://localhost:3000/contact           # Contact Page
curl -I http://localhost:3000/digital-products  # Digital Products
curl -I http://localhost:3000/admin             # Admin Dashboard

# Market-Specific Pages
curl -I http://localhost:3000/uk                # UK Market
curl -I http://localhost:3000/us                # US Market  
curl -I http://localhost:3000/canada            # Canada Market
curl -I http://localhost:3000/europe            # Europe Market
curl -I http://localhost:3000/australia         # Australia Market

# API Endpoints
curl -I http://localhost:3000/api/categories    # Categories API
curl -I http://localhost:3000/api/products      # Products API
curl -I http://localhost:3000/api/auth/session  # Auth Session API

# 🌐 PRODUCTION SITE TESTS (sellaap.vercel.app)
# ===============================================

curl -I https://sellaap.vercel.app              # Production Homepage
curl -I https://sellaap.vercel.app/products     # Production Products
curl -I https://sellaap.vercel.app/blog         # Production Blog

# 📋 SPECIFIC PAGE TESTS
# ======================

# Test specific products (replace with actual product slugs)
curl -I http://localhost:3000/products/firestick-setup-uk
curl -I http://localhost:3000/products/4k-firestick-max

# Test specific categories (replace with actual category slugs)
curl -I http://localhost:3000/Products/blender-3d-models
curl -I http://localhost:3000/Products/firestick-setups
curl -I http://localhost:3000/Products/digital-goods

# Test blog posts
curl -I http://localhost:3000/blog/affordable-firestick-services-europe-uk-us
curl -I http://localhost:3000/blog/firestick-setup-uk-complete-guide

# 🔍 FULL PAGE CONTENT TESTS
# ==========================

# To see the full HTML content (remove -I flag)
curl http://localhost:3000/products | head -20    # First 20 lines of products page
curl http://localhost:3000/api/categories         # API response content

# 📝 INTERPRETING RESULTS
# ======================
# ✅ 200 = Page loads successfully
# ❌ 404 = Page not found (check if route exists)
# 🔥 500 = Server error (check logs)
# ⚠️  Other codes = Various issues

# 🚀 QUICK TEST ALL AT ONCE
# ==========================

# Run this to test all main pages quickly:
echo "Testing all main pages..." && \
curl -I http://localhost:3000 && \
curl -I http://localhost:3000/products && \
curl -I http://localhost:3000/blog && \
curl -I http://localhost:3000/contact && \
curl -I http://localhost:3000/digital-products && \
echo "All tests completed!"