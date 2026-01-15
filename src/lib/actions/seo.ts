'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSeoSettings() {
  try {
    // Ensure prisma.seoSettings exists before querying
    if (!(prisma as any).seoSettings) {
        return { success: true, data: null };
    }
    const settings = await prisma.seoSettings.findFirst();
    return { success: true, data: settings };
  } catch (error) {
    console.error('Failed to fetch SEO settings:', error);
    return { success: false, error: 'Failed to fetch SEO settings' };
  }
}

export async function updateSeoSettings(formData: FormData) {
  const siteTitle = formData.get('siteTitle') as string;
  const siteDescription = formData.get('siteDescription') as string;
  const defaultKeywords = formData.get('defaultKeywords') as string;
  const twitterHandle = formData.get('twitterHandle') as string;
  const ogImage = formData.get('ogImage') as string;
  const googleVerification = formData.get('googleVerification') as string;
  const bingVerification = formData.get('bingVerification') as string;

  try {
    const existing = await prisma.seoSettings.findFirst();

    if (existing) {
      await prisma.seoSettings.update({
        where: { id: existing.id },
        data: {
          siteTitle,
          siteDescription,
          defaultKeywords,
          twitterHandle,
          ogImage,
          googleVerification,
          bingVerification
        }
      });
    } else {
      await prisma.seoSettings.create({
        data: {
          siteTitle,
          siteDescription,
          defaultKeywords,
          twitterHandle,
          ogImage,
          googleVerification,
          bingVerification
        }
      });
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update SEO settings:', error);
    return { success: false, error: 'Failed to update SEO settings' };
  }
}

// --- Page Specific SEO ---

export async function getAllPagesSeo() {
  try {
    if (!(prisma as any).pageSeo) {
        return { success: true, data: [] };
    }
    const pages = await prisma.pageSeo.findMany({
      orderBy: { path: 'asc' }
    });
    return { success: true, data: pages };
  } catch (error) {
    console.error('Failed to fetch pages SEO:', error);
    return { success: false, error: 'Failed to fetch pages SEO' };
  }
}

export async function getPageSeo(path: string) {
  try {
    const page = await prisma.pageSeo.findUnique({
      where: { path }
    });
    return page;
  } catch (error) {
    console.error(`Failed to fetch SEO for path ${path}:`, error);
    return null;
  }
}

export async function updatePageSeo(formData: FormData) {
  const path = formData.get('path') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const keywords = formData.get('keywords') as string;
  const ogImage = formData.get('ogImage') as string;

  if (!path) return { success: false, error: 'Path is required' };

  try {
    const existing = await prisma.pageSeo.findUnique({
      where: { path }
    });

    if (existing) {
      await prisma.pageSeo.update({
        where: { path },
        data: {
          title,
          description,
          keywords,
          ogImage
        }
      });
    } else {
      await prisma.pageSeo.create({
        data: {
          path,
          title,
          description,
          keywords,
          ogImage
        }
      });
    }

    revalidatePath('/admin');
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('Failed to update page SEO:', error);
    return { success: false, error: 'Failed to update page SEO' };
  }
}

export async function deletePageSeo(path: string) {
    try {
        await prisma.pageSeo.delete({
            where: { path }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete page SEO:', error);
        return { success: false, error: 'Failed to delete page SEO' };
    }
}
