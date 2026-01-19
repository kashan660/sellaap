import { PrismaClient } from '@prisma/client'
import { blogPosts } from '../src/lib/blogData'
import { rawProducts } from '../src/data/products'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Seed Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sellaap.com' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
      name: 'Admin User'
    },
    create: {
      email: 'admin@sellaap.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  });
  console.log(`Created admin user: ${admin.email} (password: admin123)`)

  // Seed Products
  for (const p of rawProducts) {
    let categoryId = null;
    
    if (p.category) {
       const categorySlug = p.category.toLowerCase().replace(/ /g, '-');
       const category = await prisma.category.upsert({
         where: { slug: categorySlug },
         update: {},
         create: {
           slug: categorySlug,
           name: p.category,
           description: `All ${p.category} products`
         }
       });
       categoryId = category.id;
    }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        categoryId: categoryId,
        features: JSON.stringify(["Instant Delivery", "24/7 Support", "High Quality"])
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        currency: p.currency,
        categoryId: categoryId,
        fallbackImage: p.fallbackImage,
        image: p.image,
        features: JSON.stringify(["Instant Delivery", "24/7 Support", "High Quality"])
      },
    })
    console.log(`Created product with id: ${product.id}`)

    // Add regional availability for all target markets
    const regions = ['uk', 'us', 'canada', 'europe', 'australia'];
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
          price: p.price, // Use same price for all regions initially
          currency: p.currency // Use same currency initially
        },
        create: {
          productId: product.id,
          region: region,
          available: true,
          price: p.price,
          currency: p.currency
        }
      });
    }
    console.log(`Added regional availability for product: ${product.name}`)
  }

  // Seed Posts
  for (const post of blogPosts) {
    const p = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        date: new Date(post.date), // Parse date string
        category: post.category,
        keywords: post.keywords.join(','), // Join array to string
        imageUrl: null, // Initial data doesn't have image URL in the interface provided, but maybe I should check?
      },
    })
    console.log(`Created post with id: ${p.id}`)
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
