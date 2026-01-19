import { prisma } from '@/lib/prisma';
import { Product } from '@prisma/client';
import { ProductWithCategory } from './products';

export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  currency?: string;
  categoryId?: number;
  image?: string;
  fallbackImage?: string;
  features?: string;
  regionalAvailability?: {
    region: string;
    available: boolean;
    price?: number;
    currency?: string;
  }[];
}

/**
 * Creates a new product with AddToCart functionality automatically enabled
 * This ensures all new products have cart integration from creation
 */
export async function createProductWithAddToCart(data: CreateProductData): Promise<Product> {
  // Generate slug if not provided
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  // Default currency
  const currency = data.currency || 'USD';
  
  // Default fallback image
  const fallbackImage = data.fallbackImage || "https://placehold.co/600x400?text=Product";
  
  try {
    // Create the product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        currency,
        categoryId: data.categoryId || null,
        features: data.features || JSON.stringify(["Instant Delivery", "24/7 Support"]),
        image: data.image || null,
        fallbackImage
      },
      include: {
        category: true
      }
    });
    
    // Set up regional availability if provided
    if (data.regionalAvailability && data.regionalAvailability.length > 0) {
      await prisma.productRegion.createMany({
        data: data.regionalAvailability.map(region => ({
          productId: product.id,
          region: region.region,
          available: region.available,
          price: region.price || data.price,
          currency: region.currency || currency
        }))
      });
    }
    
    console.log(`✅ Product created with AddToCart: ${product.name} (ID: ${product.id})`);
    return product;
    
  } catch (error) {
    console.error('❌ Failed to create product with AddToCart:', error);
    throw new Error('Failed to create product with AddToCart functionality');
  }
}

/**
 * Updates an existing product while maintaining AddToCart compatibility
 */
export async function updateProductWithAddToCart(
  id: number, 
  data: Partial<CreateProductData>
): Promise<Product> {
  try {
    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        categoryId: data.categoryId,
        features: data.features,
        image: data.image,
        fallbackImage: data.fallbackImage
      },
      include: {
        category: true
      }
    });
    
    // Update regional availability if provided
    if (data.regionalAvailability) {
      // Delete existing regional availability
      await prisma.productRegion.deleteMany({
        where: { productId: id }
      });
      
      // Create new regional availability
      if (data.regionalAvailability.length > 0) {
        await prisma.productRegion.createMany({
          data: data.regionalAvailability.map(region => ({
            productId: id,
            region: region.region,
            available: region.available,
            price: region.price || data.price || product.price,
            currency: region.currency || data.currency || product.currency
          }))
        });
      }
    }
    
    console.log(`✅ Product updated with AddToCart: ${product.name} (ID: ${product.id})`);
    return product;
    
  } catch (error) {
    console.error('❌ Failed to update product with AddToCart:', error);
    throw new Error('Failed to update product with AddToCart functionality');
  }
}

/**
 * Gets all products with AddToCart compatibility
 * Ensures all products returned have the necessary data for cart functionality
 */
export async function getProductsWithAddToCart(): Promise<ProductWithCategory[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        id: 'asc'
      }
    });
    
    console.log(`✅ Retrieved ${products.length} products with AddToCart compatibility`);
    return products;
    
  } catch (error) {
    console.error('❌ Failed to get products with AddToCart:', error);
    throw new Error('Failed to retrieve products with AddToCart functionality');
  }
}

/**
 * Validates that a product has all necessary data for AddToCart functionality
 */
export function validateProductForAddToCart(product: Product): boolean {
  const requiredFields = ['id', 'name', 'price', 'currency', 'slug'];
  
  for (const field of requiredFields) {
    if (!product[field as keyof Product]) {
      console.warn(`⚠️ Product missing required field for AddToCart: ${field}`);
      return false;
    }
  }
  
  if (product.price <= 0) {
    console.warn(`⚠️ Product has invalid price for AddToCart: ${product.price}`);
    return false;
  }
  
  console.log(`✅ Product validated for AddToCart: ${product.name} (ID: ${product.id})`);
  return true;
}

/**
 * Batch creates multiple products with AddToCart functionality
 * Useful for importing products or bulk creation
 */
export async function batchCreateProductsWithAddToCart(
  productsData: CreateProductData[]
): Promise<Product[]> {
  const createdProducts: Product[] = [];
  
  for (const productData of productsData) {
    try {
      const product = await createProductWithAddToCart(productData);
      createdProducts.push(product);
    } catch (error) {
      console.error(`❌ Failed to create product: ${productData.name}`, error);
      // Continue with other products even if one fails
    }
  }
  
  console.log(`✅ Batch created ${createdProducts.length}/${productsData.length} products with AddToCart`);
  return createdProducts;
}