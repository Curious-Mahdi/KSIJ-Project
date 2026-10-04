"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";

const DEFAULT_SERVICES = [
  {
    title: "Education Support Scheme",
    description: "Financial assistance for education and skill development for eligible community students.",
    category: "Education",
    eligibility: "Enrolled community students with family income under threshold guidelines.",
    requiredDocuments: "Latest fee structure, previous marksheets, identity proof, income certificate.",
    process: "1. Submit online inquiry\n2. Document verification by education board\n3. Committee approval and disbursement.",
    contactInfo: "education@ksij.org | +91 98200 12345",
    faqs: "Q: Can higher education students apply?\nA: Yes, undergraduate and postgraduate programs are supported.",
    isActive: true,
  },
  {
    title: "Employment Scheme",
    description: "Job opportunities, internship placements, and professional skill training programs.",
    category: "Employment",
    eligibility: "Job seekers, fresh graduates, and professionals seeking career transitions.",
    requiredDocuments: "Updated resume/CV, educational degrees, photo ID.",
    process: "1. Register in the portal\n2. Profile matching with community employers\n3. Interview scheduling.",
    contactInfo: "careers@ksij.org | +91 98200 12346",
    faqs: "Q: Is there any registration fee?\nA: No, the employment facilitation service is completely free.",
    isActive: true,
  },
  {
    title: "Health Support Scheme",
    description: "Healthcare assistance, medical emergency relief, and ongoing treatment subsidies.",
    category: "Health",
    eligibility: "Community members facing emergency hospitalizations or chronic medical expenses.",
    requiredDocuments: "Hospital estimate/bills, medical prescription, identity proof, doctor's referral.",
    process: "1. Immediate emergency desk notification\n2. Medical committee assessment\n3. Direct hospital payment assistance.",
    contactInfo: "healthdesk@ksij.org | Emergency: +91 98200 99999",
    faqs: "Q: How fast are emergencies processed?\nA: Emergency cases are processed within 4 to 6 hours.",
    isActive: true,
  },
  {
    title: "Housing Assistance",
    description: "Subsidies and soft loan assistance for housing repairs and accommodation needs.",
    category: "Housing",
    eligibility: "Families needing essential repairs or emergency relocation aid.",
    requiredDocuments: "Tenancy/ownership proof, repair estimates, family income declaration.",
    process: "1. Inspection by housing committee\n2. Quote verification\n3. Assistance release in tranches.",
    contactInfo: "housing@ksij.org | +91 98200 12347",
    faqs: "Q: Does this cover commercial rent?\nA: No, strictly residential primary homes.",
    isActive: true,
  },
  {
    title: "Community Welfare",
    description: "General welfare support, ration distribution, and senior citizen assistance programs.",
    category: "Welfare",
    eligibility: "Vulnerable individuals, widows, orphans, and senior citizens.",
    requiredDocuments: "Identity proof, proof of residency, family card.",
    process: "1. Application at community office\n2. Welfare volunteer visit\n3. Monthly enrollment.",
    contactInfo: "welfare@ksij.org | +91 98200 12348",
    faqs: "Q: Can anyone nominate a family in need?\nA: Yes, confidential nominations are welcome.",
    isActive: true,
  },
  {
    title: "Grievance Redressal",
    description: "Confidential filing and resolution tracking for community disputes and administrative issues.",
    category: "General",
    eligibility: "All registered community members.",
    requiredDocuments: "Written summary of dispute/issue and any supporting correspondence.",
    process: "1. Submit formal complaint\n2. Case assigned to ombudsman\n3. Mediation hearing.\n4. Written resolution.",
    contactInfo: "ombudsman@ksij.org | +91 98200 12349",
    faqs: "Q: Is my complaint kept confidential?\nA: Yes, strict confidentiality protocols apply.",
    isActive: true,
  },
];

export async function getServices(options?: {
  onlyActive?: boolean;
  category?: string;
  q?: string;
}) {
  // Auto-seed if empty
  const count = await prisma.service.count();
  if (count === 0) {
    for (const item of DEFAULT_SERVICES) {
      await prisma.service.create({ data: item });
    }
  }

  const where: any = {};

  if (options?.onlyActive) {
    where.isActive = true;
  }

  if (options?.category && options.category !== "All") {
    where.category = options.category;
  }

  if (options?.q && options.q.trim()) {
    const query = options.q.trim();
    where.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
      { category: { contains: query } },
    ];
  }

  return prisma.service.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
  });
}

export async function createService(data: {
  title: string;
  description: string;
  category: string;
  eligibility?: string;
  requiredDocuments?: string;
  process?: string;
  contactInfo?: string;
  faqs?: string;
  isActive?: boolean;
}) {
  await requireAdmin();

  if (!data.title?.trim() || !data.description?.trim()) {
    throw new Error("Title and description are required");
  }

  const service = await prisma.service.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category?.trim() || "General",
      eligibility: data.eligibility?.trim() || null,
      requiredDocuments: data.requiredDocuments?.trim() || null,
      process: data.process?.trim() || null,
      contactInfo: data.contactInfo?.trim() || null,
      faqs: data.faqs?.trim() || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });

  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath("/admin");

  return service;
}

export async function updateService(
  id: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    eligibility?: string;
    requiredDocuments?: string;
    process?: string;
    contactInfo?: string;
    faqs?: string;
    isActive?: boolean;
  }
) {
  await requireAdmin();

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.category !== undefined) updateData.category = data.category.trim();
  if (data.eligibility !== undefined) updateData.eligibility = data.eligibility.trim();
  if (data.requiredDocuments !== undefined) updateData.requiredDocuments = data.requiredDocuments.trim();
  if (data.process !== undefined) updateData.process = data.process.trim();
  if (data.contactInfo !== undefined) updateData.contactInfo = data.contactInfo.trim();
  if (data.faqs !== undefined) updateData.faqs = data.faqs.trim();
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const service = await prisma.service.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}/edit`);
  revalidatePath("/admin");

  return service;
}

export async function toggleServiceStatus(id: string, isActive: boolean) {
  await requireAdmin();

  const service = await prisma.service.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath("/admin");

  return service;
}

export async function deleteService(id: string) {
  await requireAdmin();

  const service = await prisma.service.delete({
    where: { id },
  });

  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath("/admin");

  return service;
}
