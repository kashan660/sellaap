'use server';

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

const GENERIC_MESSAGE = "If an account exists for that email, we've sent a password reset link.";
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sellaap.com';
    const resetUrl = `${baseUrl}/auth/reset-password/${rawToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  return { success: true, message: GENERIC_MESSAGE };
}

export async function resetPassword(token: string, newPassword: string) {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { success: false, error: 'This reset link is invalid or has expired' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true };
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters' };
  }

  const user = await prisma.user.findUnique({ where: { id: parseInt(session.user.id, 10) } });
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!user.password) {
    return { success: false, error: 'This account signed up with Google and has no password to change' };
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return { success: false, error: 'Current password is incorrect' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}
