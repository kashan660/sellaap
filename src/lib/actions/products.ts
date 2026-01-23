'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { CACHE_CONFIG } from '@/lib/cache';

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  currency: z.string().default("USD"),
  categoryId: z.coerce.number().optional(),
  image: z.string().optional(),
  fallbackImage: z.string().default("/placeholder.png"),
  features: z.string().optional(), // JSON string
  isFeatured: z.coerce.boolean().optional(),
});

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  const categoryIdRaw = formData.get('categoryId');
  // Handle "0" as null (explicit removal/no category), null as undefined (missing field)
  let categoryId: number | null | undefined;
  
  if (categoryIdRaw === "0") {
    categoryId = null;
  } else if (categoryIdRaw) {
    categoryId = parseInt(categoryIdRaw as string);
  } else {
    categoryId = undefined;
  }

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price'),
    currency: formData.get('currency'),
    categoryId: categoryId,
    image: formData.get('image'),
    fallbackImage: formData.get('fallbackImage') || '/placeholder.png',
    features: formData.get('features'),
    isFeatured: formData.get('isFeatured') === 'true',
  };

  const regionalAvailability = formData.get('regionalAvailability') 
      ? JSON.parse(formData.get('regionalAvailability') as string) 
      : [];

  try {
    const data = ProductSchema.parse(rawData);
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        currency: data.currency,
        categoryId: data.categoryId,
        image: data.image,
        fallbackImage: data.fallbackImage,
        features: data.features,
        isFeatured: data.isFeatured || false,
        regionalAvailability: {
            create: regionalAvailability.map((r: any) => ({
                region: r.region,
                available: r.available,
                price: r.price ? parseFloat(r.price) : null,
                currency: r.currency || null
            }))
        }
      },
    });

    revalidatePath('/products');
    revalidatePath('/admin/products');
    CACHE_CONFIG.products.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true, product };
  } catch (error) {
    console.error('Error creating product:', error);
    return { error: "Failed to create product" };
  }
}

export async function updateProduct(id: number, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  const categoryIdRaw = formData.get('categoryId');
  let categoryId: number | null | undefined;
  
  if (categoryIdRaw === "0") {
    categoryId = null;
  } else if (categoryIdRaw) {
    categoryId = parseInt(categoryIdRaw as string);
  } else {
    categoryId = undefined;
  }

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price'),
    currency: formData.get('currency'),
    categoryId: categoryId,
    image: formData.get('image'),
    fallbackImage: formData.get('fallbackImage'),
    features: formData.get('features'),
  };

  const regionalAvailability = formData.get('regionalAvailability') 
      ? JSON.parse(formData.get('regionalAvailability') as string) 
      : undefined;

  try {
    const data = ProductSchema.parse(rawData);
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        currency: data.currency,
        categoryId: data.categoryId,
        image: data.image,
        fallbackImage: data.fallbackImage,
        features: data.features,
        ...(regionalAvailability ? {
            regionalAvailability: {
                deleteMany: {},
                create: regionalAvailability.map((r: any) => ({
                    region: r.region,
                    available: r.available,
                    price: r.price ? parseFloat(r.price) : null,
                    currency: r.currency || null
                }))
            }
        } : {})
      },
    });

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath(`/products/${product.slug}`);
    CACHE_CONFIG.products.tags.forEach(tag => revalidateTag(tag, 'max'));
    CACHE_CONFIG.product.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true, product };
  } catch (error) {
    console.error('Error updating product:', error);
    return { error: "Failed to update product" };
  }
}

export async function deleteProduct(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/products');
    revalidatePath('/admin/products');
    CACHE_CONFIG.products.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2003') {
      return { error: "Cannot delete product because it is referenced in orders or other data." };
    }
    return { error: "Failed to delete product" };
  }
}

export async function getProductsAction() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      regionalAvailability: true,
    },
    orderBy: {
      id: 'desc',
    },
  });
  return products;
}

export async function getCategories() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });
    return categories;
}

const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

import { createMenuItem } from './navigation';

export async function createCategory(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    image: formData.get('image'),
  };

  const menuPlacement = formData.get('menuPlacement');
  const targetMenuId = formData.get('targetMenuId');
  const parentMenuItemId = formData.get('parentMenuItemId');

  try {
    const data = CategorySchema.parse(rawData);
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
      }
    });

    // Handle Menu Item Creation
    if (menuPlacement && menuPlacement !== 'none' && targetMenuId) {
      const menuId = parseInt(targetMenuId as string);
      let parentId: number | undefined = undefined;

      if (parentMenuItemId && parentMenuItemId !== 'root') {
        const parsed = parseInt(parentMenuItemId as string);
        if (!isNaN(parsed)) {
          parentId = parsed;
        }
      }
      
      if (!isNaN(menuId)) {
        await createMenuItem({
          menuId,
          label: data.name,
          url: `/products/${data.slug}`,
          parentId: menuPlacement === 'submenu' ? parentId : undefined,
          target: '_self'
        });
      }
    }

    revalidatePath('/admin/categories');
    CACHE_CONFIG.categories.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true, category };
  } catch (error) {
    console.error('Error creating category:', error);
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(id: number, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    image: formData.get('image'),
  };

  try {
    const data = CategorySchema.parse(rawData);
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
      }
    });
    revalidatePath('/admin/categories');
    CACHE_CONFIG.categories.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true, category };
  } catch (error) {
    console.error('Error updating category:', error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
    CACHE_CONFIG.categories.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    if (error.code === 'P2003') {
      return { error: "Cannot delete category because it has products associated with it." };
    }
    return { error: "Failed to delete category" };
  }
}
