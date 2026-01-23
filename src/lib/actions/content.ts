'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { CACHE_CONFIG, getCachedPageBySlug, getCachedPostBySlug } from "@/lib/cache";

// Helper to verify internal links
async function verifyInternalLinks(content: string) {
  const regex = /href=["']([^"']+)["']/g;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }

  const brokenLinks: string[] = [];
  
  for (const link of links) {
    if (link.startsWith('/')) {
      const parts = link.split('/').filter(p => p);
      // Check against known routes
      if (parts.length === 2) {
        const [type, slug] = parts;
        if (type === 'pages') {
          const exists = await prisma.page.findUnique({ where: { slug }, select: { id: true } });
          if (!exists) brokenLinks.push(link);
        } else if (type === 'blog') {
          const exists = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
          if (!exists) brokenLinks.push(link);
        } else if (type === 'products') {
          const exists = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
          if (!exists) brokenLinks.push(link);
        }
      }
    }
  }
  
  return brokenLinks;
}

// Page Management Actions
export async function createPage(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'ARCHIVED';
  template?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  featuredImageId?: number;
  parentId?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const page = await prisma.page.create({
      data: {
        ...data,
        authorId: parseInt(session.user.id as string),
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      }
    });
    
    const brokenLinks = await verifyInternalLinks(data.content);
    
    revalidatePath('/[location]');
    revalidatePath('/admin/pages');
    CACHE_CONFIG.pages.tags.forEach(tag => revalidateTag(tag, 'max'));
    
    return { 
      success: true, 
      page, 
      warnings: brokenLinks.length > 0 ? brokenLinks : undefined 
    };
  } catch (error: any) {
    console.error('Error creating page:', error);
    if (error.code === 'P2002') {
      return { error: "A page with this slug already exists." };
    }
    return { error: "Failed to create page. Please check your input." };
  }
}

export async function updatePage(id: number, data: {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'ARCHIVED';
  template?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  featuredImageId?: number;
  parentId?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const page = await prisma.page.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined,
      }
    });
    
    let brokenLinks: string[] = [];
    if (data.content) {
      brokenLinks = await verifyInternalLinks(data.content);
    }
    
    revalidatePath('/[location]');
    revalidatePath('/admin/pages');
    revalidatePath(`/admin/pages/${id}`);
    CACHE_CONFIG.pages.tags.forEach(tag => revalidateTag(tag, 'max'));
    
    return { 
      success: true, 
      page,
      warnings: brokenLinks.length > 0 ? brokenLinks : undefined
    };
  } catch (error: any) {
    console.error('Error updating page:', error);
    if (error.code === 'P2002') {
      return { error: "A page with this slug already exists." };
    }
    return { error: "Failed to update page." };
  }
}

export async function deletePage(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.page.delete({ where: { id } });
    revalidatePath('/[location]');
    revalidatePath('/admin/pages');
    CACHE_CONFIG.pages.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true };
  } catch (error) {
    console.error('Error deleting page:', error);
    return { error: "Failed to delete page" };
  }
}

export async function getPages(status?: string) {
  try {
    const where = status ? { status } : {};
    return await prisma.page.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        featuredImage: true,
        parent: true,
        _count: {
          select: { children: true }
        }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const page = await getCachedPageBySlug(slug);
    return page;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Blog Management Actions
export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  keywords: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  metaTitle?: string;
  metaDescription?: string;
  imageUrl?: string;
  featured?: boolean;
  tagIds?: number[];
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: parseInt(session.user.id as string),
        tags: data.tagIds ? {
          create: data.tagIds.map(tagId => ({ tagId }))
        } : undefined,
      }
    });
    
    const brokenLinks = await verifyInternalLinks(data.content);

    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    CACHE_CONFIG.posts.tags.forEach(tag => revalidateTag(tag, 'max'));
    
    return { 
      success: true, 
      post,
      warnings: brokenLinks.length > 0 ? brokenLinks : undefined
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return { error: "Failed to create post" };
  }
}

export async function updatePost(id: number, data: {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  keywords?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  metaTitle?: string;
  metaDescription?: string;
  imageUrl?: string;
  featured?: boolean;
  tagIds?: number[];
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        tags: data.tagIds ? {
          deleteMany: {},
          create: data.tagIds.map(tagId => ({ tagId }))
        } : undefined,
      }
    });
    
    let brokenLinks: string[] = [];
    if (data.content) {
      brokenLinks = await verifyInternalLinks(data.content);
    }

    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${post.slug}`);
    CACHE_CONFIG.posts.tags.forEach(tag => revalidateTag(tag, 'max'));
    
    return { 
      success: true, 
      post,
      warnings: brokenLinks.length > 0 ? brokenLinks : undefined
    };
  } catch (error) {
    console.error('Error updating post:', error);
    return { error: "Failed to update post" };
  }
}

export async function deletePost(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    CACHE_CONFIG.posts.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error: "Failed to delete post" };
  }
}

export async function getPosts(options?: string | { status?: string, category?: string, featured?: boolean, limit?: number, orderBy?: string }) {
  try {
    let status: string | undefined;
    let category: string | undefined;
    let featured: boolean | undefined;
    let limit: number | undefined;
    let orderBy: string | undefined;

    if (typeof options === 'string') {
      status = options;
    } else if (typeof options === 'object') {
      status = options.status;
      category = options.category;
      featured = options.featured;
      limit = options.limit;
      orderBy = options.orderBy;
    }

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: { images: true }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { date: 'desc' }
      ],
      take: limit
    });
    
    // Maintain backward compatibility with old return type (array)
    // but also support new pagination format if needed in future
    // For now, simple array return matches usage in other files
    return posts;

  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await getCachedPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Tag Management Actions
export async function createTag(data: {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const tag = await prisma.tag.create({ data });
    return { success: true, tag };
  } catch (error) {
    console.error('Error creating tag:', error);
    return { error: "Failed to create tag" };
  }
}

export async function getTags() {
  try {
    return await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Image Management Actions
export async function uploadImage(data: {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const image = await prisma.image.create({
      data: {
        ...data,
        uploadedBy: parseInt(session.user.id as string)
      }
    });
    return { success: true, image };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { error: "Failed to upload image" };
  }
}

export async function getImages() {
  try {
    return await prisma.image.findMany({
      include: {
        uploader: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export async function deleteImage(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.image.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting image:', error);
    if (error.code === 'P2003') {
      return { error: "Cannot delete this image because it is currently in use by pages or products." };
    }
    return { error: "Failed to delete image" };
  }
}
