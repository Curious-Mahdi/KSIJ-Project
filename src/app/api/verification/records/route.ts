import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetOrgId = searchParams.get("orgId");
    const callerOrgId = req.headers.get("x-organization-id");

    // If caller attempts to fetch another organization's private records
    if (callerOrgId && targetOrgId && callerOrgId !== targetOrgId) {
      // Log unauthorized attempt to audit log
      await prisma.verificationAuditLog.create({
        data: {
          organizationId: callerOrgId,
          beneficiaryReference: "CROSS_ORG_PROBE",
          category: "DIRECT_DB_QUERY",
          action: "ACCESS_DENIED",
          result: "BLOCKED",
          reviewRequired: true,
          details: `Caller organization ${callerOrgId} attempted raw read access to organization ${targetOrgId}. Blocked by Central Privacy Policy.`,
        },
      });

      return NextResponse.json(
        {
          error: "Forbidden",
          message:
            "SECURITY BOUNDARY ENFORCED: Direct access to another foundation's private database partition is strictly prohibited. Organizations must communicate exclusively through the Central Verification API (/api/verification/check).",
        },
        { status: 403 }
      );
    }

    if (!callerOrgId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Missing x-organization-id header." },
        { status: 401 }
      );
    }

    // Caller can ONLY read its OWN records
    const ownRecords = await prisma.assistanceRecord.findMany({
      where: { organizationId: callerOrgId },
      include: { beneficiary: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ records: ownRecords });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
