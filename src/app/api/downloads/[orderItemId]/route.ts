import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderItemId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderItemId } = await params;
  const id = parseInt(orderItemId, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid order item' }, { status: 400 });
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id },
    include: { order: true, product: true },
  });

  if (!orderItem) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isOwner = orderItem.order.userId === parseInt(session.user.id, 10);
  const isAdmin = session.user.role === 'ADMIN';
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (orderItem.order.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Order is not completed' }, { status: 403 });
  }

  const { digitalFileUrl, digitalFileName, digitalFileMimeType } = orderItem.product;
  if (!digitalFileUrl) {
    return NextResponse.json({ error: 'No digital file attached to this product' }, { status: 404 });
  }

  const fileResponse = await fetch(digitalFileUrl);
  if (!fileResponse.ok || !fileResponse.body) {
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 502 });
  }

  return new NextResponse(fileResponse.body, {
    headers: {
      'Content-Type': digitalFileMimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${(digitalFileName || 'download').replace(/"/g, '')}"`,
    },
  });
}
