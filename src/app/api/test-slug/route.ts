import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ error: 'No slug provided' }, { status: 400 });
    }
    
    console.log('Testing slug:', slug);
    
    // First try to find a product
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true }
    });
    
    if (product) {
      return NextResponse.json({ 
        type: 'product',
        data: product,
        message: `Found product: ${product.name}`
      });
    }
    
    // If not a product, try to find a category
    const category = await prisma.category.findUnique({
      where: { slug }
    });
    
    if (category) {
      const products = await prisma.product.findMany({
        where: { categoryId: category.id },
        orderBy: { createdAt: 'desc' }
      });
      
      return NextResponse.json({ 
        type: 'category',
        data: category,
        products: products,
        message: `Found category: ${category.name} with ${products.length} products`
      });
    }
    
    return NextResponse.json({ 
      type: 'not_found',
      message: `No product or category found for slug: ${slug}`
    });
    
  } catch (error) {
    console.error('Error testing slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}