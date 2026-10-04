"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DEFAULT_FACILITIES = [
  {
    name: "Al-Zahra Community Auditorium",
    description: "Grand community hall suitable for weddings, majalis, conferences, and large social gatherings. Features centralized air-conditioning and audio-visual equipment.",
    location: "Main Community Complex, 1st Floor",
    capacity: 450,
    amenities: "Centralized AC, Stage Lighting, Audio System, Projector, Dining Annex, Wheelchair Access",
    imageUrl: null,
    isAvailable: true,
    contactInfo: "facilities@ksij.org | +91 98200 44551",
    rules: "1. No outside non-approved catering.\n2. Music must adhere to community guidelines.\n3. Premises to be vacated by 11:30 PM.",
  },
  {
    name: "Imam Ali Seminar & Conference Room",
    description: "Modern conference and board meeting room equipped with video conferencing screens, high-speed Wi-Fi, and executive seating.",
    location: "Administrative Block, 2nd Floor",
    capacity: 60,
    amenities: "Video Conference Screen, Wi-Fi, Whiteboard, Air Conditioning, Mic System",
    imageUrl: null,
    isAvailable: true,
    contactInfo: "facilities@ksij.org | +91 98200 44552",
    rules: "Advance booking of at least 48 hours required for technical setup.",
  },
  {
    name: "Fatima Zahra Sports & Youth Arena",
    description: "Indoor multi-sports facility for youth tournaments, badminton, table tennis, and community fitness workshops.",
    location: "Sports Wing, Ground Floor",
    capacity: 120,
    amenities: "Badminton Court, TT Tables, Locker Rooms, Drinking Water, First Aid Kit",
    imageUrl: null,
    isAvailable: true,
    contactInfo: "sports@ksij.org | +91 98200 44553",
    rules: "Non-marking sports shoes mandatory. Priority given to scheduled youth clubs.",
  },
];

export async function getFacilities(options?: { onlyAvailable?: boolean; q?: string }) {
  // Auto-seed if empty
  const count = await prisma.facility.count();
  if (count === 0) {
    for (const item of DEFAULT_FACILITIES) {
      await prisma.facility.create({ data: item });
    }
  }

  const where: any = {};
  if (options?.onlyAvailable) {
    where.isAvailable = true;
  }
  if (options?.q && options.q.trim()) {
    const query = options.q.trim();
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { location: { contains: query } },
    ];
  }

  return prisma.facility.findMany({
    where,
    include: {
      bookings: {
        orderBy: { eventDate: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFacilityById(id: string) {
  return prisma.facility.findUnique({
    where: { id },
    include: {
      bookings: {
        orderBy: { eventDate: "asc" },
      },
    },
  });
}

export async function createFacility(data: {
  name: string;
  description: string;
  location: string;
  capacity?: number;
  amenities?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  contactInfo?: string;
  rules?: string;
}) {
  await requireAdmin();

  if (!data.name?.trim() || !data.location?.trim()) {
    throw new Error("Name and location are required");
  }

  const facility = await prisma.facility.create({
    data: {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      location: data.location.trim(),
      capacity: Number(data.capacity) || 50,
      amenities: data.amenities?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      contactInfo: data.contactInfo?.trim() || null,
      rules: data.rules?.trim() || null,
    },
  });

  revalidatePath("/facilities");
  revalidatePath("/admin/facilities");
  revalidatePath("/admin");

  return facility;
}

export async function updateFacility(
  id: string,
  data: {
    name?: string;
    description?: string;
    location?: string;
    capacity?: number;
    amenities?: string;
    imageUrl?: string;
    isAvailable?: boolean;
    contactInfo?: string;
    rules?: string;
  }
) {
  await requireAdmin();

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.location !== undefined) updateData.location = data.location.trim();
  if (data.capacity !== undefined) updateData.capacity = Number(data.capacity);
  if (data.amenities !== undefined) updateData.amenities = data.amenities.trim() || null;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl.trim() || null;
  if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;
  if (data.contactInfo !== undefined) updateData.contactInfo = data.contactInfo.trim() || null;
  if (data.rules !== undefined) updateData.rules = data.rules.trim() || null;

  const facility = await prisma.facility.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/facilities");
  revalidatePath("/admin/facilities");
  revalidatePath(`/admin/facilities/${id}/edit`);
  revalidatePath("/admin");

  return facility;
}

export async function toggleFacilityAvailability(id: string, isAvailable: boolean) {
  await requireAdmin();

  const facility = await prisma.facility.update({
    where: { id },
    data: { isAvailable },
  });

  revalidatePath("/facilities");
  revalidatePath("/admin/facilities");
  revalidatePath("/admin");

  return facility;
}

export async function deleteFacility(id: string) {
  await requireAdmin();

  const facility = await prisma.facility.delete({
    where: { id },
  });

  revalidatePath("/facilities");
  revalidatePath("/admin/facilities");
  revalidatePath("/admin");

  return facility;
}

/* ─── Facility Bookings ─────────────────────────────────────────── */

export async function submitFacilityBooking(data: {
  facilityId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  eventDate: string | Date;
  timeSlot: string;
  purpose: string;
  notes?: string;
}) {
  if (!data.facilityId || !data.userName || !data.userEmail || !data.userPhone || !data.eventDate || !data.purpose) {
    throw new Error("All required fields must be filled");
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || null;

  const booking = await prisma.facilityBooking.create({
    data: {
      facilityId: data.facilityId,
      userId,
      userName: data.userName.trim(),
      userEmail: data.userEmail.trim(),
      userPhone: data.userPhone.trim(),
      eventDate: typeof data.eventDate === "string" ? new Date(data.eventDate) : data.eventDate,
      timeSlot: data.timeSlot.trim(),
      purpose: data.purpose.trim(),
      notes: data.notes?.trim() || null,
      status: "PENDING",
    },
  });

  revalidatePath("/facilities");
  revalidatePath("/admin/facilities");
  revalidatePath("/admin");

  return booking;
}

export async function getAllBookings(facilityId?: string) {
  await requireAdmin();

  const where: any = {};
  if (facilityId) where.facilityId = facilityId;

  return prisma.facilityBooking.findMany({
    where,
    include: {
      facility: {
        select: { id: true, name: true, location: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateBookingStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED",
  notes?: string
) {
  await requireAdmin();

  const booking = await prisma.facilityBooking.update({
    where: { id },
    data: {
      status,
      ...(notes !== undefined ? { notes } : {}),
    },
  });

  revalidatePath("/facilities");
  revalidatePath("/admin/facilities");
  revalidatePath("/admin");

  return booking;
}
