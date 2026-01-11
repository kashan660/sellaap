import { PrismaClient } from '@prisma/client'
import { blogPosts } from '../src/lib/blogData'
import { rawProducts } from '../src/data/products'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Seed Products
  for (const p of rawProducts) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        currency: p.currency,
        category: p.category,
        fallbackImage: p.fallbackImage,
        image: p.image,
      },
    })
    console.log(`Created product with id: ${product.id}`)
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
