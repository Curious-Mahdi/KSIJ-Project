"use server";

import { prisma } from "@/lib/prisma";

export async function completeOnboarding(userId: string, name: string, jamaat: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, jamaat }
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update profile" };
  }
}
