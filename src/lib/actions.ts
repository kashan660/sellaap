'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// --- Product Actions ---

export async function updateProductImage(id: number, imageUrl: string) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { image: imageUrl },
    })
    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)
    return { success: true, data: product }
  } catch (error) {
    console.error('Error updating product image:', error)
    return { success: false, error: 'Failed to update product image' }
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany()
    return { success: true, data: products }
  } catch (error) {
    return { success: false, error: 'Failed to fetch products' }
  }
}

// --- Post Actions ---

export async function updatePostImage(id: number, imageUrl: string) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { imageUrl: imageUrl },
    })
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    return { success: true, data: post }
  } catch (error) {
    console.error('Error updating post image:', error)
    return { success: false, error: 'Failed to update post image' }
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { date: 'desc' }
    })
    return { success: true, data: posts }
  } catch (error) {
    return { success: false, error: 'Failed to fetch posts' }
  }
}
