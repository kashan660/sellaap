'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { CACHE_CONFIG } from "@/lib/cache";

// Menu Actions
export async function getMenus() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        items: {
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' },
              include: {
                children: { // Support 3 levels of nesting
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    // Filter root items for the main list, as Prisma include is not recursive
    // But since we want the tree structure, we need to assemble it if it's not already.
    // Actually, Prisma returns flat list if we don't nest includes properly or we can process it.
    // The current query structure assumes strict parent-child relationship in DB.
    // Let's refine the query to ensure we get a usable tree or flat list we can build from.
    // The previous implementation used recursive components, implying the data structure is nested.
    // Let's stick to the previous simple include but filter in JS if needed.
    // Actually, to support infinite nesting, it's better to fetch all items and build tree in JS.
    // But for now, let's keep it simple as implemented.
    
    // Better approach: Fetch all items for the menu and build tree client-side or server-side.
    // For now, let's assume 2-3 levels is enough and the previous query was okay.
    // I will slightly improve the query to support one more level just in case.
    
    return menus;
  } catch (error) {
    console.error('Error fetching menus:', error);
    return [];
  }
}

export async function createMenu(data: { name: string; location?: string }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const menu = await prisma.menu.create({ data });
    revalidatePath('/admin/menus');
    CACHE_CONFIG.menus.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true, menu };
  } catch (error) {
    console.error('Error creating menu:', error);
    return { error: "Failed to create menu" };
  }
}

export async function updateMenu(id: number, data: { name?: string; location?: string }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const menu = await prisma.menu.update({
      where: { id },
      data
    });
    revalidatePath('/admin/menus');
    CACHE_CONFIG.menus.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true, menu };
  } catch (error) {
    console.error('Error updating menu:', error);
    return { error: "Failed to update menu" };
  }
}

export async function deleteMenu(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.menu.delete({ where: { id } });
    revalidatePath('/admin/menus');
    CACHE_CONFIG.menus.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true };
  } catch (error) {
    console.error('Error deleting menu:', error);
    return { error: "Failed to delete menu" };
  }
}

// Menu Item Actions
export async function createMenuItem(data: {
  menuId: number;
  label: string;
  url: string;
  target?: string;
  parentId?: number;
  order?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    // If order is not provided, find the max order in the same scope and add 1
    let order = data.order;
    if (order === undefined) {
      const maxOrder = await prisma.menuItem.findFirst({
        where: {
          menuId: data.menuId,
          parentId: data.parentId || null
        },
        orderBy: { order: 'desc' },
        select: { order: true }
      });
      order = (maxOrder?.order ?? -1) + 1;
    }

    const menuItem = await prisma.menuItem.create({ 
      data: { ...data, order } 
    });
    revalidatePath('/admin/menus');
    CACHE_CONFIG.menus.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true, menuItem };
  } catch (error) {
    console.error('Error creating menu item:', error);
    return { error: "Failed to create menu item" };
  }
}

export async function updateMenuItem(id: number, data: {
  label?: string;
  url?: string;
  target?: string;
  order?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data
    });
    revalidatePath('/admin/menus');
    CACHE_CONFIG.menus.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true, menuItem };
  } catch (error) {
    console.error('Error updating menu item:', error);
    return { error: "Failed to update menu item" };
  }
}

export async function updateMenuItemOrders(items: { id: number; order: number }[]) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const transaction = items.map(item => 
      prisma.menuItem.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    );
    await prisma.$transaction(transaction);
    revalidatePath('/admin/menus');
    CACHE_CONFIG.menus.tags.forEach(tag => revalidateTag(tag, 'max'));
    return { success: true };
  } catch (error) {
    console.error('Error updating menu item orders:', error);
    return { error: "Failed to update orders" };
  }
}

export async function deleteMenuItem(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.menuItem.delete({ where: { id } });
    revalidatePath('/admin/menus');
    return { success: true };
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return { error: "Failed to delete menu item" };
  }
}

// Redirect Actions
export async function getRedirects() {
  try {
    return await prisma.redirect.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return [];
  }
}

export async function createRedirect(data: {
  source: string;
  destination: string;
  permanent?: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const redirect = await prisma.redirect.create({ data });
    revalidatePath('/admin/redirects');
    return { success: true, redirect };
  } catch (error: any) {
    console.error('Error creating redirect:', error);
    if (error.code === 'P2002') {
      return { error: "A redirect for this source path already exists." };
    }
    return { error: "Failed to create redirect" };
  }
}

export async function deleteRedirect(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.redirect.delete({ where: { id } });
    revalidatePath('/admin/redirects');
    return { success: true };
  } catch (error) {
    console.error('Error deleting redirect:', error);
    return { error: "Failed to delete redirect" };
  }
}
