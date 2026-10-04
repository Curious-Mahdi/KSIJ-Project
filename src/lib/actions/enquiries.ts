"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";

export async function submitEnquiry(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: string;
}) {
  if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
    throw new Error("Name, email, subject, and message are required");
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      subject: data.subject.trim(),
      message: data.message.trim(),
      category: data.category?.trim() || "General",
      status: "PENDING",
    },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");

  return enquiry;
}

export async function getEnquiries(options?: { status?: string; q?: string }) {
  await requireAdmin();

  const where: any = {};
  if (options?.status && options.status !== "ALL") {
    where.status = options.status;
  }
  if (options?.q && options.q.trim()) {
    const query = options.q.trim();
    where.OR = [
      { name: { contains: query } },
      { email: { contains: query } },
      { subject: { contains: query } },
      { message: { contains: query } },
    ];
  }

  return prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateEnquiryStatus(
  id: string,
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED",
  adminNotes?: string
) {
  await requireAdmin();

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: {
      status,
      ...(adminNotes !== undefined ? { adminNotes: adminNotes.trim() } : {}),
    },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");

  return enquiry;
}

export async function deleteEnquiry(id: string) {
  await requireAdmin();

  const enquiry = await prisma.enquiry.delete({
    where: { id },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");

  return enquiry;
}
