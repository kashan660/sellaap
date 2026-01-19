'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createProductWithAddToCart, updateProductWithAddToCart } from '@/lib/product-utils'

// --- Category Actions ---

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const metaTitle = formData.get('metaTitle') as string
  const metaDescription = formData.get('metaDescription') as string
  const metaKeywords = formData.get('metaKeywords') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  try {
    const category = await prisma.category.create({
      data: { 
        name, 
        slug, 
        description
      }
    })
    revalidatePath('/admin')
    return { success: true, data: category }
  } catch (error) {
    console.error('Failed to create category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function updateCategory(id: number, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { 
        name, 
        slug, 
        description
      }
    })
    revalidatePath('/admin')
    return { success: true, data: category }
  } catch (error) {
    console.error('Failed to update category:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}

// --- Product Actions ---

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const categoryId = parseInt(formData.get('categoryId') as string)
  const features = formData.get('features') as string // Expecting JSON string or newlines
  const image = formData.get('image') as string // Optional image URL
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const fallbackImage = "https://placehold.co/600x400?text=No+Image" // Default

  try {
    // Use the new AddToCart-enabled product creation
    const product = await createProductWithAddToCart({
      name,
      slug,
      description,
      price,
      categoryId: isNaN(categoryId) ? undefined : categoryId,
      features: features || JSON.stringify(["Instant Delivery", "24/7 Support"]),
      image: image || undefined,
      fallbackImage
    })
    
    revalidatePath('/admin')
    revalidatePath('/products')
    revalidatePath('/digital-products')
    return { success: true, data: product }
  } catch (error) {
    console.error('Failed to create product with AddToCart:', error)
    return { success: false, error: 'Failed to create product with AddToCart functionality' }
  }
}

export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const categoryId = parseInt(formData.get('categoryId') as string)
  const features = formData.get('features') as string

  try {
    // Use the new AddToCart-enabled product update
    const product = await updateProductWithAddToCart(id, {
      name,
      description,
      price,
      categoryId: isNaN(categoryId) ? undefined : categoryId,
      features
    })
    
    revalidatePath('/admin')
    revalidatePath('/products')
    revalidatePath('/digital-products')
    return { success: true, data: product }
  } catch (error) {
    console.error('Failed to update product with AddToCart:', error)
    return { success: false, error: 'Failed to update product with AddToCart functionality' }
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

// --- Post Actions ---

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string
  const keywords = formData.get('keywords') as string
  const metaTitle = formData.get('metaTitle') as string
  const metaDescription = formData.get('metaDescription') as string
  const metaKeywords = formData.get('metaKeywords') as string
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        keywords,
        imageUrl: null,
        metaTitle,
        metaDescription
      }
    })
    revalidatePath('/admin')
    revalidatePath('/blog')
    return { success: true, data: newPost }
  } catch (error) {
    console.error('Failed to create post:', error)
    return { success: false, error: 'Failed to create post' }
  }
}

export async function updatePost(id: number, formData: FormData) {
  const title = formData.get('title') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string
  const keywords = formData.get('keywords') as string
  const metaTitle = formData.get('metaTitle') as string
  const metaDescription = formData.get('metaDescription') as string

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        category,
        keywords,
        metaTitle,
        metaDescription
      }
    })
    revalidatePath('/admin')
    revalidatePath('/blog')
    return { success: true, data: updatedPost }
  } catch (error) {
    console.error('Failed to update post:', error)
    return { success: false, error: 'Failed to update post' }
  }
}

export async function deletePost(id: number) {
  try {
    await prisma.post.delete({ where: { id } })
    revalidatePath('/admin')
    revalidatePath('/blog')
    return { success: true, data: id }
  } catch (error) {
    console.error('Failed to delete post:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}
