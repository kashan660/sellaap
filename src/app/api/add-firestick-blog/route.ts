import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check if the post already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug: 'affordable-firestick-services-europe-uk-us' }
    });

    if (existingPost) {
      return NextResponse.json({ 
        success: true, 
        message: 'Firestick blog post already exists',
        post: existingPost 
      });
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

    return NextResponse.json({ 
      success: true, 
      message: 'Firestick blog post created successfully',
      post: newPost 
    });
    
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create blog post' 
    }, { status: 500 });
  }
}

// Also add a GET endpoint to check existing posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { date: 'desc' }
    });
    
    return NextResponse.json({ 
      success: true, 
      posts,
      count: posts.length 
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch posts' 
    }, { status: 500 });
  }
}