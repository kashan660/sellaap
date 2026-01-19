import { prisma } from "@/lib/prisma";

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    console.log('Found categories:', categories.length);
    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug})`);
    });
    
    if (categories.length === 0) {
      console.log('No categories found. Creating some default ones...');
      
      const defaultCategories = [
        { name: 'Blender 3D Models', slug: 'blender-3d-models', description: 'High-quality Blender 3D models for your projects' },
        { name: 'Digital Products', slug: 'digital-products', description: 'Digital products and resources' },
        { name: 'Software', slug: 'software', description: 'Software solutions and tools' },
        { name: 'Templates', slug: 'templates', description: 'Professional templates for various uses' }
      ];
      
      for (const cat of defaultCategories) {
        await prisma.category.create({
          data: cat
        });
        console.log(`Created category: ${cat.name}`);
      }
      
      console.log('Default categories created successfully!');
    }
  } catch (error) {
    console.error('Error checking categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();