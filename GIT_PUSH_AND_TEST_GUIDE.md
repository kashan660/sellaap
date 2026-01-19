# Git Push and Page Testing Instructions

## Git Push Commands

To push your code to Git, run these commands in order:

1. **Check status:**
   ```bash
   git status
   ```

2. **Add all changes:**
   ```bash
   git add .
   ```

3. **Commit changes:**
   ```bash
   git commit -m "Fix: Add generateCategoryMeta import to products/[slug]/page.tsx for category page functionality"
   ```

4. **Push to remote:**
   ```bash
   git push origin main
   ```

## Curl Testing Commands

To test all pages, run these curl commands:

### Main Pages
```bash
curl -s -o /dev/null -w "Home: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/"
curl -s -o /dev/null -w "Products: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/products"
curl -s -o /dev/null -w "Blog: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/blog"
curl -s -o /dev/null -w "Contact: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/contact"
```

### Category Pages
```bash
curl -s -o /dev/null -w "Blender 3D Models: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/products/blender-3d-models"
curl -s -o /dev/null -w "Digital Products: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/products/digital-products"
curl -s -o /dev/null -w "Software: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/products/software"
curl -s -o /dev/null -w "Templates: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/products/templates"
```

### Regional Pages
```bash
curl -s -o /dev/null -w "Europe: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/europe"
curl -s -o /dev/null -w "UK: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/uk"
curl -s -o /dev/null -w "US: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/us"
curl -s -o /dev/null -w "Canada: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/canada"
curl -s -o /dev/null -w "Australia: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/australia"
```

### Auth Pages
```bash
curl -s -o /dev/null -w "Sign In: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/auth/signin"
curl -s -o /dev/null -w "Sign Up: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/auth/signup"
```

### API Endpoints
```bash
curl -s -o /dev/null -w "Categories API: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/api/categories"
curl -s -o /dev/null -w "Products API: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/api/products"
```

### Blog Posts
```bash
curl -s -o /dev/null -w "Firestick Provider Blog: HTTP %{http_code} - %{time_total}s\n" "http://localhost:3000/blog/best-cheap-firestick-provider-europe-uk-us"
```

## Quick Scripts

I've created these batch files for you:
- `git-commit-push.bat` - Complete git push process
- `curl-test-pages.bat` - Test all pages with curl
- `curl-test-pages.ps1` - PowerShell version for better formatting

## Expected Results

All pages should return:
- **HTTP 200** for successful page loads
- **Response time** under 2 seconds for optimal performance
- **HTTP 404** for any broken links (indicates issues to fix)

## Recent Changes Summary

✅ **Fixed:** Added `generateCategoryMeta` import to [products/[slug]/page.tsx](d:\sellaap\src\app\products\[slug]\page.tsx#L4) to resolve category page build errors
✅ **Ready:** All scripts prepared for git push and page testing
✅ **Status:** Code ready for deployment after git push