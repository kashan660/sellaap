# Database Setup & Migration Guide

## Issue: DATABASE_URL Environment Variable Missing

The error shows that your Prisma schema expects a `DATABASE_URL` environment variable, but it was missing from your `.env` file. I've added it, but we need to verify the connection.

## Current Status

✅ **Fixed**: Added `DATABASE_URL` to `.env` file
✅ **Schema Updated**: ProductRegion model added to track regional availability
✅ **Code Updated**: Product pages now include regional availability display

## Next Steps to Complete Migration

### Step 1: Verify Database Connection
Run this command to test the database connection:
```bash
npx prisma db push --dry-run
```

### Step 2: Apply Schema Changes
If the dry-run succeeds, apply the changes:
```bash
npx prisma db push
```

### Step 3: Generate Prisma Client
Update the Prisma client with the new schema:
```bash
npx prisma generate
```

### Step 4: Seed Regional Data (Optional)
If you want to add default regional availability for existing products:
```bash
npx tsx prisma/seed-regional.ts
```

## Database Connection Details

Your current database configuration:
- **Provider**: PostgreSQL (via Prisma Accelerate)
- **URL**: Using Prisma Accelerate connection string
- **Direct URL**: Direct PostgreSQL connection for migrations

## Troubleshooting Connection Issues

If you still encounter connection issues:

1. **Check Network Access**: Ensure your IP is whitelisted in Prisma Console
2. **Verify API Key**: Confirm the Prisma Accelerate API key is valid
3. **Test Direct Connection**: Try connecting directly to PostgreSQL:
   ```bash
   npx prisma db pull --url="postgres://96028c2c6fec8748e712d742b7030ed4e1613722f83bc163c470457003ce7960:sk_RTU_Pch_XNbkJ7zZbYml-@db.prisma.io:5432/postgres?sslmode=require"
   ```

## Alternative: Local Development Setup

If you prefer local development, you can set up a local PostgreSQL database:

1. **Install PostgreSQL locally**
2. **Create a local database**
3. **Update .env with local connection string**:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/sellaap_db"
   DIRECT_URL="postgresql://username:password@localhost:5432/sellaap_db"
   ```

## What This Migration Provides

### Regional Product Features
- ✅ Products can be marked available/unavailable per region
- ✅ Visual indicators on product pages
- ✅ SEO optimization for international markets
- ✅ Support for UK, US, Canada, Europe, Australia

### Database Schema Changes
- ✅ ProductRegion model added
- ✅ Regional availability tracking
- ✅ Currency and pricing per region
- ✅ Backward compatibility maintained

## Verification Steps

After successful migration, verify:

1. **Database Schema**: Check that ProductRegion table exists
2. **Product Pages**: Regional availability badges appear
3. **Product Listings**: Regional indicators show on cards
4. **SEO**: Check source code for structured data and hreflang tags

## Rollback Plan

If you need to rollback:

1. **Remove ProductRegion model** from schema.prisma
2. **Remove regionalAvailability** relation from Product model
3. **Run**: `npx prisma db push`
4. **Delete ProductRegion table** manually if needed

The migration is designed to be safe and won't break existing functionality.