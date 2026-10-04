"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";

const DEFAULT_ANNOUNCEMENTS = [
  {
    title: "Higher Education Scholarship 2024 Applications Now Open",
    content: "The Jamaat Education Board invites applications for undergraduate and postgraduate scholarships for the academic year 2024-2025. Ensure marksheets and verification papers are submitted before the 30th of this month.",
    category: "Education",
    isImportant: true,
    isPublished: true,
    linkUrl: "/services",
  },
  {
    title: "Community Health & Eye Checkup Camp This Weekend",
    content: "Free comprehensive health checkups, vision tests, and expert consultations will be conducted at City Community Center this Sunday starting at 9:00 AM. Bring previous medical records if available.",
    category: "Health",
    isImportant: false,
    isPublished: true,
    linkUrl: "/events",
  },
  {
    title: "Facility Booking Notice: Auditorium Maintenance",
    content: "Al-Zahra Community Auditorium will be undergoing routine acoustics upgrade on Friday from 8:00 AM to 2:00 PM. Bookings will resume as normal for the evening slot.",
    category: "General",
    isImportant: false,
    isPublished: true,
    linkUrl: "/facilities",
  },
];

export async function getAnnouncements(options?: { onlyPublished?: boolean; q?: string }) {
  // Auto-seed if empty
  const count = await prisma.announcement.count();
  if (count === 0) {
    for (const item of DEFAULT_ANNOUNCEMENTS) {
      await prisma.announcement.create({ data: item });
    }
  }

  const where: any = {};
  if (options?.onlyPublished) {
    where.isPublished = true;
  }
  if (options?.q && options.q.trim()) {
    const query = options.q.trim();
    where.OR = [
      { title: { contains: query } },
      { content: { contains: query } },
      { category: { contains: query } },
    ];
  }

  return prisma.announcement.findMany({
    where,
    orderBy: [
      { isImportant: "desc" },
      { publishedAt: "desc" },
    ],
  });
}

export async function getAnnouncementById(id: string) {
  return prisma.announcement.findUnique({
    where: { id },
  });
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  category?: string;
  isImportant?: boolean;
  isPublished?: boolean;
  linkUrl?: string;
}) {
  await requireAdmin();

  if (!data.title?.trim() || !data.content?.trim()) {
    throw new Error("Title and content are required");
  }

  const announcement = await prisma.announcement.create({
    data: {
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category?.trim() || "General",
      isImportant: data.isImportant || false,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      linkUrl: data.linkUrl?.trim() || null,
    },
  });

  revalidatePath("/home");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin");

  return announcement;
}

export async function updateAnnouncement(
  id: string,
  data: {
    title?: string;
    content?: string;
    category?: string;
    isImportant?: boolean;
    isPublished?: boolean;
    linkUrl?: string;
  }
) {
  await requireAdmin();

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.content !== undefined) updateData.content = data.content.trim();
  if (data.category !== undefined) updateData.category = data.category.trim();
  if (data.isImportant !== undefined) updateData.isImportant = data.isImportant;
  if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
  if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl.trim() || null;

  const announcement = await prisma.announcement.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/home");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin");

  return announcement;
}

export async function toggleAnnouncementPublish(id: string, isPublished: boolean) {
  await requireAdmin();

  const announcement = await prisma.announcement.update({
    where: { id },
    data: { isPublished },
  });

  revalidatePath("/home");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin");

  return announcement;
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();

  const announcement = await prisma.announcement.delete({
    where: { id },
  });

  revalidatePath("/home");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin");

  return announcement;
}
