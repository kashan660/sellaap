'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getSettings() {
  try {
    const settings = await prisma.seoSettings.findFirst();
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

export async function updateSettings(data: {
  siteTitle?: string;
  siteDescription?: string;
  defaultKeywords?: string;
  ogImage?: string;
  twitterHandle?: string;
  googleVerification?: string;
  bingVerification?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const existing = await prisma.seoSettings.findFirst();
    
    let settings;
    if (existing) {
      settings = await prisma.seoSettings.update({
        where: { id: existing.id },
        data
      });
    } else {
      settings = await prisma.seoSettings.create({
        data: {
            siteTitle: data.siteTitle || 'Sellaap',
            siteDescription: data.siteDescription || '',
            ...data
        }
      });
    }
    
    revalidatePath('/');
    return { success: true, settings };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { error: "Failed to update settings" };
  }
}
