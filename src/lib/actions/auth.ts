'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const mobile = formData.get("mobile") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobile,
      },
    });

    return { success: true, error: "" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Something went wrong" };
  }
}
