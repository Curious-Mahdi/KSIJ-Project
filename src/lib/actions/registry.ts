"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface OrganizationDTO {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: string;
}

export interface AssistanceRecordDTO {
  id: string;
  beneficiaryId: string;
  organizationId: string;
  organizationName: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  purpose: string | null;
  notes: string | null;
}

export interface BeneficiarySummaryDTO {
  id: string;
  beneficiaryId: string;
  name: string;
  phone: string;
  area: string;
  familySize: number;
  verificationStatus: string;
  verificationRef: string | null;
  notes: string | null;
  createdAt: string;
  recordsCount: number;
  totalAssistanceAmount: number;
  categoriesReceived: string[];
  lastAssistanceDate: string | null;
}

export interface DuplicateCheckResult {
  hasDuplicate: boolean;
  duplicateCount: number;
  category: string;
  previousRecords: Array<{
    id: string;
    amount: number;
    date: string;
    organizationName: string;
    purpose: string | null;
    status: string;
  }>;
  warningMessage: string | null;
}

/**
 * Fetch all active participating welfare organizations.
 */
export async function getOrganizations(): Promise<OrganizationDTO[]> {
  try {
    const orgs = await prisma.organization.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    });
    return orgs.map((o) => ({
      id: o.id,
      name: o.name,
      code: o.code,
      description: o.description,
      status: o.status,
    }));
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
}

/**
 * Fetch aggregated statistics across the entire centralized registry.
 */
export async function getRegistryStats() {
  try {
    const [totalBeneficiaries, totalRecords, amountAgg] = await Promise.all([
      prisma.beneficiary.count(),
      prisma.assistanceRecord.count(),
      prisma.assistanceRecord.aggregate({
        _sum: { amount: true },
      }),
    ]);

    // Calculate potential duplicate cases: beneficiaries with > 1 record in the same category
    const allRecords = await prisma.assistanceRecord.findMany({
      select: {
        beneficiaryId: true,
        category: true,
      },
    });

    const categoryMap = new Map<string, Set<string>>();
    let duplicateCaseCount = 0;
    for (const r of allRecords) {
      const key = `${r.beneficiaryId}::${r.category}`;
      if (categoryMap.has(key)) {
        duplicateCaseCount++;
      } else {
        categoryMap.set(key, new Set());
      }
    }

    return {
      totalBeneficiaries,
      totalRecords,
      totalDisbursed: amountAgg._sum.amount || 0,
      flaggedDuplicatesCount: duplicateCaseCount,
    };
  } catch (error) {
    console.error("Error fetching registry stats:", error);
    return {
      totalBeneficiaries: 0,
      totalRecords: 0,
      totalDisbursed: 0,
      flaggedDuplicatesCount: 0,
    };
  }
}

/**
 * Search beneficiaries with multi-parameter deterministic matching.
 */
export async function searchBeneficiaries(
  query: string = "",
  area?: string,
  status?: string
): Promise<BeneficiarySummaryDTO[]> {
  try {
    const cleanQuery = query.trim();
    const normalizedDigits = cleanQuery.replace(/\D/g, "");

    const whereClause: any = {};

    if (cleanQuery) {
      const orConditions: any[] = [
        { name: { contains: cleanQuery, mode: "insensitive" } },
        { beneficiaryId: { contains: cleanQuery, mode: "insensitive" } },
      ];

      if (normalizedDigits.length >= 3) {
        orConditions.push({ phone: { contains: normalizedDigits } });
      }

      whereClause.OR = orConditions;
    }

    if (area && area !== "ALL") {
      whereClause.area = area;
    }

    if (status && status !== "ALL") {
      whereClause.verificationStatus = status;
    }

    const beneficiaries = await prisma.beneficiary.findMany({
      where: whereClause,
      include: {
        assistanceRecords: {
          select: {
            amount: true,
            category: true,
            date: true,
          },
          orderBy: { date: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return beneficiaries.map((b) => {
      const categoriesSet = new Set<string>();
      let totalAmount = 0;
      let lastDate: string | null = null;

      b.assistanceRecords.forEach((r, idx) => {
        totalAmount += r.amount;
        categoriesSet.add(r.category);
        if (idx === 0) {
          lastDate = r.date.toISOString();
        }
      });

      return {
        id: b.id,
        beneficiaryId: b.beneficiaryId,
        name: b.name,
        phone: b.phone,
        area: b.area,
        familySize: b.familySize,
        verificationStatus: b.verificationStatus,
        verificationRef: b.verificationRef,
        notes: b.notes,
        createdAt: b.createdAt.toISOString(),
        recordsCount: b.assistanceRecords.length,
        totalAssistanceAmount: totalAmount,
        categoriesReceived: Array.from(categoriesSet),
        lastAssistanceDate: lastDate,
      };
    });
  } catch (error) {
    console.error("Error searching beneficiaries:", error);
    return [];
  }
}

/**
 * Fetch a single beneficiary with full assistance history across all organizations.
 */
export async function getBeneficiaryById(id: string) {
  try {
    const beneficiary = await prisma.beneficiary.findFirst({
      where: {
        OR: [
          { id },
          { beneficiaryId: id },
        ],
      },
      include: {
        assistanceRecords: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!beneficiary) return null;

    return {
      id: beneficiary.id,
      beneficiaryId: beneficiary.beneficiaryId,
      name: beneficiary.name,
      phone: beneficiary.phone,
      area: beneficiary.area,
      familySize: beneficiary.familySize,
      verificationStatus: beneficiary.verificationStatus,
      verificationRef: beneficiary.verificationRef,
      notes: beneficiary.notes,
      createdAt: beneficiary.createdAt.toISOString(),
      assistanceRecords: beneficiary.assistanceRecords.map((r) => ({
        id: r.id,
        beneficiaryId: r.beneficiaryId,
        organizationId: r.organizationId,
        organizationName: r.organization.name,
        category: r.category,
        amount: r.amount,
        date: r.date.toISOString(),
        status: r.status,
        purpose: r.purpose,
        notes: r.notes,
      })),
    };
  } catch (error) {
    console.error(`Error fetching beneficiary ${id}:`, error);
    return null;
  }
}

/**
 * Real-time deterministic duplicate check.
 * Checks if the beneficiary has previously received assistance in the specified category.
 */
export async function checkDuplicateAssistance(
  beneficiaryId: string,
  category: string
): Promise<DuplicateCheckResult> {
  try {
    const previous = await prisma.assistanceRecord.findMany({
      where: {
        OR: [
          { beneficiaryId: beneficiaryId },
          { beneficiary: { beneficiaryId: beneficiaryId } },
        ],
        category: { equals: category, mode: "insensitive" },
      },
      include: {
        organization: {
          select: { name: true },
        },
      },
      orderBy: { date: "desc" },
    });

    if (previous.length === 0) {
      return {
        hasDuplicate: false,
        duplicateCount: 0,
        category,
        previousRecords: [],
        warningMessage: null,
      };
    }

    const latest = previous[0];
    const formattedDate = new Date(latest.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(latest.amount);

    const warningMessage = `Potential Duplicate Assistance Detected: This beneficiary has previously received ${category} of ${formattedAmount} on ${formattedDate} (${latest.organization.name}). Review prior history before approving additional funds.`;

    return {
      hasDuplicate: true,
      duplicateCount: previous.length,
      category,
      previousRecords: previous.map((p) => ({
        id: p.id,
        amount: p.amount,
        date: p.date.toISOString(),
        organizationName: p.organization.name,
        purpose: p.purpose,
        status: p.status,
      })),
      warningMessage,
    };
  } catch (error) {
    console.error("Error checking duplicate assistance:", error);
    return {
      hasDuplicate: false,
      duplicateCount: 0,
      category,
      previousRecords: [],
      warningMessage: null,
    };
  }
}

/**
 * Record a new assistance grant in the centralized ledger.
 */
export async function createAssistanceRecord(data: {
  beneficiaryId: string;
  organizationId: string;
  category: string;
  amount: number;
  date?: string;
  purpose?: string;
  notes?: string;
}) {
  try {
    let targetBeneficiaryId = data.beneficiaryId;
    if (data.beneficiaryId.startsWith("BEN-")) {
      const b = await prisma.beneficiary.findUnique({
        where: { beneficiaryId: data.beneficiaryId },
        select: { id: true },
      });
      if (b) {
        targetBeneficiaryId = b.id;
      }
    }

    const record = await prisma.assistanceRecord.create({
      data: {
        beneficiaryId: targetBeneficiaryId,
        organizationId: data.organizationId,
        category: data.category,
        amount: Number(data.amount),
        date: data.date ? new Date(data.date) : new Date(),
        status: "COMPLETED",
        purpose: data.purpose?.trim() || null,
        notes: data.notes?.trim() || null,
      },
    });

    revalidatePath("/admin/registry");
    revalidatePath(`/admin/registry/${data.beneficiaryId}`);
    revalidatePath(`/admin/registry/${targetBeneficiaryId}`);
    return { success: true, recordId: record.id };
  } catch (error: any) {
    console.error("Error creating assistance record:", error);
    return { success: false, error: error.message || "Failed to create assistance record" };
  }
}

/**
 * Register a new beneficiary in the centralized registry.
 */
export async function createBeneficiary(data: {
  name: string;
  phone: string;
  area: string;
  familySize?: number;
  verificationStatus?: string;
  notes?: string;
}) {
  try {
    const count = await prisma.beneficiary.count();
    const nextNum = 101 + count;
    const beneficiaryId = `BEN-${String(nextNum).padStart(6, "0")}`;
    const verificationRef = `REF-KYC-${Math.floor(1000 + Math.random() * 9000)}`;

    const cleanPhone = data.phone.replace(/\D/g, "");

    const beneficiary = await prisma.beneficiary.create({
      data: {
        beneficiaryId,
        name: data.name.trim(),
        phone: cleanPhone,
        area: data.area.trim(),
        familySize: Number(data.familySize) || 1,
        verificationStatus: data.verificationStatus || "VERIFIED",
        verificationRef,
        notes: data.notes?.trim() || null,
      },
    });

    revalidatePath("/admin/registry");
    return { success: true, beneficiaryId: beneficiary.id, formattedId: beneficiary.beneficiaryId };
  } catch (error: any) {
    console.error("Error creating beneficiary:", error);
    return { success: false, error: error.message || "Failed to register beneficiary" };
  }
}
