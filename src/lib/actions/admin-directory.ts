"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";

export async function getAdminDirectoryListings(filters?: {
  status?: string;
  category?: string;
  q?: string;
}) {
  await requireAdmin();

  const where: any = {};

  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters?.category && filters.category !== "ALL") {
    where.category = filters.category;
  }

  if (filters?.q && filters.q.trim()) {
    const query = filters.q.trim();
    where.OR = [
      { name: { contains: query } },
      { shortDescription: { contains: query } },
      { description: { contains: query } },
      { category: { contains: query } },
      { services: { contains: query } },
    ];
  }

  return prisma.directoryListing.findMany({
    where,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      contact: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateListingStatus(
  id: string,
  status: "PUBLISHED" | "PENDING" | "REJECTED" | "ARCHIVED" | "PAUSED"
) {
  await requireAdmin();

  const updated = await prisma.directoryListing.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/directory");
  revalidatePath("/admin/businesses");
  revalidatePath("/admin");

  return updated;
}

export async function updateListingAdmin(
  id: string,
  data: {
    name?: string;
    shortDescription?: string;
    description?: string;
    category?: string;
    subcategory?: string;
    status?: string;
    website?: string;
    location?: string;
  }
) {
  await requireAdmin();

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.category !== undefined) updateData.category = data.category.trim();
  if (data.subcategory !== undefined) updateData.subcategory = data.subcategory.trim();
  if (data.status !== undefined) updateData.status = data.status.trim();
  if (data.website !== undefined) updateData.website = data.website.trim();
  if (data.location !== undefined) updateData.location = data.location.trim();

  const updated = await prisma.directoryListing.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/directory");
  revalidatePath("/admin/businesses");
  revalidatePath("/admin");

  return updated;
}

export async function deleteListingAdmin(id: string) {
  await requireAdmin();

  const deleted = await prisma.directoryListing.delete({
    where: { id },
  });

  revalidatePath("/directory");
  revalidatePath("/admin/businesses");
  revalidatePath("/admin");

  return deleted;
}
