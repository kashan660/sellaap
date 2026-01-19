// prisma/seed-regional.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌍 Seeding regional availability data...')

  // Get all existing products
  const products = await prisma.product.findMany()
  
  console.log(`Found ${products.length} products to update`)

  // Define target regions
  const regions = ['uk', 'us', 'canada', 'europe', 'australia']
  
  for (const product of products) {
    console.log(`Processing product: ${product.name}`)
    
    // Create regional availability for each region
    for (const region of regions) {
      await prisma.productRegion.upsert({
        where: {
          productId_region: {
            productId: product.id,
            region: region
          }
        },
        update: {
          available: true,
          currency: getRegionalCurrency(region),
          price: product.price // Keep same price for now, can be customized later
        },
        create: {
          productId: product.id,
          region: region,
          available: true,
          currency: getRegionalCurrency(region),
          price: product.price
        }
      })
    }
  }

  console.log('✅ Regional availability seeding completed!')
}

function getRegionalCurrency(region: string): string {
  switch (region) {
    case 'uk':
      return 'GBP'
    case 'us':
      return 'USD'
    case 'canada':
      return 'CAD'
    case 'europe':
      return 'EUR'
    case 'australia':
      return 'AUD'
    default:
      return 'USD'
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding regional data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })