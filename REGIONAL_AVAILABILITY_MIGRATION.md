# Regional Availability Migration Guide

This guide will help you migrate your database to support regional product availability for Europe, UK, US, Canada, and Australia.

## Step 1: Update Prisma Schema
✅ **Already completed** - Added ProductRegion model to schema.prisma

## Step 2: Generate Prisma Client
Run this command to generate the updated Prisma client:
```bash
npx prisma generate
```

## Step 3: Push Schema Changes
Run this command to apply the schema changes to your database:
```bash
npx prisma db push
```

## Step 4: Seed Regional Data
Run this command to add regional availability for all existing products:
```bash
npx tsx prisma/seed.ts
```

## Step 5: Verify Migration
After running the above commands, verify that the migration was successful:

1. Check your database to see the new ProductRegion table
2. Verify that all products have regional availability entries
3. Test the product pages to ensure regional information is displayed

## What This Migration Provides

### 1. Regional Product Availability
- Products can now be marked as available/unavailable in specific regions
- Supports UK, US, Canada, Europe, and Australia
- Each region can have different pricing and currency

### 2. Enhanced Product Pages
- Product detail pages show regional availability badges
- Product listing pages show regional availability indicators
- SEO-optimized metadata for each region

### 3. Database Structure
- ProductRegion model tracks availability per region
- Supports regional pricing and currency overrides
- Maintains referential integrity with Product model

### 4. SEO Benefits
- Market-specific keywords for each region
- Hreflang tags for international SEO
- Structured data for search engines
- Canonical URLs for each regional version

## Next Steps

After completing this migration, you can:

1. **Update Admin Dashboard**: Add UI to manage regional availability
2. **Add Regional Pricing**: Set different prices for different regions
3. **Regional Content**: Create region-specific product descriptions
4. **Currency Conversion**: Implement automatic currency conversion
5. **Regional Shipping**: Add region-specific shipping information

## Troubleshooting

If you encounter any issues:

1. **Database Connection**: Ensure your database is running and accessible
2. **Prisma Client**: Make sure Prisma client is properly generated
3. **Schema Conflicts**: Check for any conflicting schema changes
4. **Seed Data**: Verify that the seed script runs without errors

## Rollback Plan

If you need to rollback this migration:

1. Remove the ProductRegion model from schema.prisma
2. Remove the regionalAvailability relation from Product model
3. Run `npx prisma db push` to apply the rollback
4. Manually delete the ProductRegion table from your database

This migration is designed to be backward compatible and won't break existing functionality.