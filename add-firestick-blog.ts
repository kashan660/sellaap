import { prisma } from '@/lib/prisma';

async function addFirestickBlogPost() {
  try {
    // Check if the post already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug: 'affordable-firestick-services-europe-uk-us' }
    });

    if (existingPost) {
      console.log('Firestick blog post already exists:', existingPost.title);
      return;
    }

    // Create the new blog post
    const newPost = await prisma.post.create({
      data: {
        slug: 'affordable-firestick-services-europe-uk-us',
        title: 'Affordable Firestick Services in Europe, UK & US | Save 70% with Sellaap',
        excerpt: 'Stop overpaying for Firestick setup! Sellaap offers professional Firestick services at 70% less cost across Europe, UK, and US. Premium setup, instant delivery, 5-star rated.',
        content: 'Comprehensive blog post about affordable Firestick services with price comparisons, customer testimonials, and service details.',
        category: 'Technology',
        keywords: 'cheap firestick setup europe, affordable firestick services uk, budget firestick us, firestick installation cost, sellaap firestick, professional firestick setup, firestick 4k max setup, streaming device setup',
        imageUrl: '/og-affordable-firestick-europe-uk-us.jpg',
        date: new Date('2024-01-17T00:00:00Z'),
        metaTitle: 'Affordable Firestick Services in Europe, UK & US | Save 70% with Sellaap',
        metaDescription: 'Professional Firestick setup services at unbeatable prices. Save up to 70% compared to local providers across Europe, UK, and US.'
      }
    });

    console.log('Firestick blog post created successfully:', newPost.title);
    console.log('Post ID:', newPost.id);
    
  } catch (error) {
    console.error('Error creating blog post:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
addFirestickBlogPost();