import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { put } from "@vercel/blob";

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json(
        { error: "No file received." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
    
    if (process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
      const { url } = await put(`${folder}/${filename}`, buffer, {
        access: 'public',
        contentType: file.type || 'application/octet-stream',
        token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ success: true, url, filename });
    }

    const uploadDir = path.join(process.cwd(), "public", folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/${folder}/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl, filename });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file." },
      { status: 500 }
    );
  }
}
