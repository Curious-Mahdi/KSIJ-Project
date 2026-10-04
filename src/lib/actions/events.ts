"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";

/**
 * Validates and sanitizes a URL.
 * - Prepends https:// if user entered domain without protocol.
 * - Disallows dangerous javascript: or data: protocols.
 * - Returns null for invalid or empty values.
 */
export async function sanitizeAndValidateUrl(rawUrl?: string | null): Promise<string | null> {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return null;
  }

  let candidate = trimmed;
  if (!lower.startsWith("http://") && !lower.startsWith("https://") && !lower.startsWith("/")) {
    candidate = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(candidate, "https://ksij.org");
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return candidate;
    }
    return null;
  } catch {
    return null;
  }
}

function parseSafeDate(rawDate: string | Date | undefined): Date {
  if (!rawDate) return new Date();
  const parsed = typeof rawDate === "string" ? new Date(rawDate) : rawDate;
  if (isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

const DEFAULT_EVENTS = [
  {
    title: "Education Scheme Awareness Session",
    description: "Informative session for students and parents regarding available educational scholarships, eligibility criteria, and application processes.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days ahead
    time: "10:00 AM - 12:00 PM",
    location: "Community Hall",
    imageUrl: null,
    registrationUrl: "https://forms.gle/education-awareness-session",
    isImportant: true,
    status: "UPCOMING",
  },
  {
    title: "Community Health Camp",
    description: "Free medical checkups, eye tests, blood pressure screenings, and doctor consultations for all registered community members.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days ahead
    time: "9:00 AM - 4:00 PM",
    location: "City Community Center",
    imageUrl: null,
    registrationUrl: null,
    isImportant: false,
    status: "UPCOMING",
  },
  {
    title: "Youth Employment & Internship Fair",
    description: "Connect with community business owners, corporate partners, and recruitment specialists offering full-time and internship positions.",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days ahead
    time: "11:00 AM - 2:00 PM",
    location: "Main Auditorium",
    imageUrl: null,
    registrationUrl: "https://forms.gle/employment-fair-registration",
    isImportant: false,
    status: "UPCOMING",
  },
];

export async function getEvents(options?: {
  status?: string;
  upcomingOnly?: boolean;
}) {
  try {
    // Auto-seed if empty
    const count = await prisma.event.count();
    if (count === 0) {
      for (const item of DEFAULT_EVENTS) {
        await prisma.event.create({ data: item });
      }
    }

    const where: any = {};

    if (options?.status && options.status !== "All") {
      where.status = options.status;
    }

    if (options?.upcomingOnly) {
      where.status = "UPCOMING";
    }

    return await prisma.event.findMany({
      where,
      orderBy: [
        { isImportant: "desc" },
        { date: "asc" },
      ],
    });
  } catch (err) {
    console.error("Error in getEvents:", err);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    return await prisma.event.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error(`Error in getEventById for ${id}:`, err);
    return null;
  }
}

export async function createEvent(data: {
  title: string;
  description: string;
  date: string | Date;
  time: string;
  location: string;
  imageUrl?: string | null;
  registrationUrl?: string | null;
  isImportant?: boolean;
  status?: string;
}) {
  await requireAdmin();

  if (!data.title?.trim() || !data.date || !data.location?.trim()) {
    throw new Error("Title, date, and location are required");
  }

  const parsedDate = parseSafeDate(data.date);
  const validatedImageUrl = await sanitizeAndValidateUrl(data.imageUrl);
  const validatedRegUrl = await sanitizeAndValidateUrl(data.registrationUrl);

  const event = await prisma.event.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || "",
      date: parsedDate,
      time: data.time?.trim() || "TBA",
      location: data.location.trim(),
      imageUrl: validatedImageUrl,
      registrationUrl: validatedRegUrl,
      isImportant: Boolean(data.isImportant),
      status: data.status?.trim() || "UPCOMING",
    },
  });

  revalidatePath("/events");
  revalidatePath("/services");
  revalidatePath("/admin/events");
  revalidatePath("/admin");

  return event;
}

export async function updateEvent(
  id: string,
  data: {
    title?: string;
    description?: string;
    date?: string | Date;
    time?: string;
    location?: string;
    imageUrl?: string | null;
    registrationUrl?: string | null;
    isImportant?: boolean;
    status?: string;
  }
) {
  await requireAdmin();

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.date !== undefined) {
    updateData.date = parseSafeDate(data.date);
  }
  if (data.time !== undefined) updateData.time = data.time.trim();
  if (data.location !== undefined) updateData.location = data.location.trim();
  if (data.imageUrl !== undefined) {
    updateData.imageUrl = await sanitizeAndValidateUrl(data.imageUrl);
  }
  if (data.registrationUrl !== undefined) {
    updateData.registrationUrl = await sanitizeAndValidateUrl(data.registrationUrl);
  }
  if (data.isImportant !== undefined) updateData.isImportant = Boolean(data.isImportant);
  if (data.status !== undefined) updateData.status = data.status.trim();

  const event = await prisma.event.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/events");
  revalidatePath("/services");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}/edit`);
  revalidatePath("/admin");

  return event;
}

export async function deleteEvent(id: string) {
  await requireAdmin();

  const event = await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/events");
  revalidatePath("/services");
  revalidatePath("/admin/events");
  revalidatePath("/admin");

  return event;
}
