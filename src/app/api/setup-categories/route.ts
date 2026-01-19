import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    
    // If no categories exist, create some test ones
    if (categories.length === 0) {
      const testCategories = [
        { name: 'Blender 3D Models', slug: 'blender-3d-models', description: 'High-quality 3D models for Blender' },
        { name: 'Digital Products', slug: 'digital-products', description: 'Various digital products and assets' },
        { name: 'Software', slug: 'software', description: 'Software solutions and tools' },
        { name: 'Templates', slug: 'templates', description: 'Professional templates for various uses' }
      ];
      
      for (const cat of testCategories) {
        await prisma.category.create({ data: cat });
      }
      
      const newCategories = await prisma.category.findMany();
      return NextResponse.json({ 
        categories: newCategories,
        message: 'Test categories created successfully!'
      });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}