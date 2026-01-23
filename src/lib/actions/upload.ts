'use server'

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function uploadFile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Unauthorized" };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { error: "No file provided" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure unique filename
  // Sanitize filename to remove special characters
  const originalName = file.name;
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = `${nameWithoutExt}-${uniqueSuffix}.${extension}`;
  
  const token = process.env.VERCEL_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    try {
      const { url } = await put(`uploads/${filename}`, buffer, {
        access: 'public',
        contentType: file.type || 'application/octet-stream',
        token: token,
      });
      return {
        success: true,
        url,
        filename,
        originalName,
        mimeType: file.type,
        size: file.size,
      };
    } catch (error) {
      return { error: "Failed to upload to blob" };
    }
  }

  const uploadDir = join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Error creating upload directory:', err);
  }

  const path = join(uploadDir, filename);
  try {
    await writeFile(path, buffer);
    return {
      success: true,
      url: `/uploads/${filename}`,
      filename,
      originalName,
      mimeType: file.type,
      size: file.size,
    };
  } catch (error) {
    console.error('Error saving file to disk:', error, 'Path:', path);
    return { error: "Failed to save file" };
  }
}
