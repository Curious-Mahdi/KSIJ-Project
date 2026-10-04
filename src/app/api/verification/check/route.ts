import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { beneficiaryReference, assistanceType } = body;

    // 1. Identify Caller Organization from header or body
    const apiKey = req.headers.get("x-api-key");
    const headerOrgId = req.headers.get("x-organization-id");

    let callerOrg = null;
    if (apiKey) {
      callerOrg = await prisma.organization.findFirst({ where: { apiKey } });
    } else if (headerOrgId) {
      callerOrg = await prisma.organization.findUnique({ where: { id: headerOrgId } });
    }

    // Default to Anfaal if demoing without explicit header
    if (!callerOrg) {
      callerOrg = await prisma.organization.findFirst({ where: { code: "ANFAAL" } });
    }

    if (!beneficiaryReference || !assistanceType) {
      return NextResponse.json(
        { error: "Bad Request", message: "beneficiaryReference and assistanceType are required" },
        { status: 400 }
      );
    }

    const cleanRef = beneficiaryReference.trim();
    const cleanCategory = assistanceType.trim();
    const cleanDigits = cleanRef.replace(/\D/g, "");

    // 2. Query Central Verification Layer (Data-Minimization: No access to originating org's private database)
    // Check if beneficiary exists in central identity registry
    const orConditions: any[] = [
      { beneficiaryId: { equals: cleanRef, mode: "insensitive" } },
      { name: { contains: cleanRef, mode: "insensitive" } },
    ];
    if (cleanDigits.length >= 3) {
      orConditions.push({ phone: { contains: cleanDigits } });
    }

    const beneficiary = await prisma.beneficiary.findFirst({
      where: { OR: orConditions },
    });

    const targetRef = beneficiary ? beneficiary.beneficiaryId : cleanRef;
    const categoryStem = cleanCategory.split(" ")[0].toLowerCase();

    // Check CentralVerificationRecord for category
    const relevantAttestation = await prisma.centralVerificationRecord.findFirst({
      where: {
        beneficiaryReference: { equals: targetRef, mode: "insensitive" },
        category: { contains: categoryStem, mode: "insensitive" },
        status: "ACTIVE",
      },
      orderBy: { lastAssistanceDate: "desc" },
    });

    const hasPrevious = !!relevantAttestation;
    const lastDate = relevantAttestation
      ? relevantAttestation.lastAssistanceDate.toISOString().split("T")[0]
      : null;

    // 3. Log Immutable Audit Record
    if (callerOrg) {
      await prisma.verificationAuditLog.create({
        data: {
          organizationId: callerOrg.id,
          beneficiaryReference: targetRef,
          category: cleanCategory,
          action: "VERIFICATION_CHECK",
          result: hasPrevious ? "RELEVANT_ASSISTANCE_FOUND" : "CLEARED",
          reviewRequired: hasPrevious,
          details: hasPrevious
            ? `Previous assistance flagged on ${lastDate}. Minimal attestation returned without private records.`
            : "No previous assistance detected. Cleared.",
        },
      });
    }

    // 4. Return Data-Minimized Privacy Response
    return NextResponse.json(
      {
        found: !!beneficiary || hasPrevious,
        beneficiaryReference: cleanRef,
        category: cleanCategory,
        previousAssistance: hasPrevious,
        relevantAssistance: hasPrevious,
        lastAssistanceDate: lastDate,
        reviewRequired: hasPrevious,
        verificationNetwork: "Central Jamaat Welfare Attestation Network",
        privacyNotice:
          "DATA MINIMIZATION ACTIVE: Originating organization private case notes, documents, and internal files are withheld under Central Privacy Protocol.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Central Verification API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
