import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Seeding Centralized Assistance Verification Environment ---");

  // 1. Seed / Upsert the 3 Participating Foundations
  const orgData = [
    {
      code: "ANFAAL",
      name: "Anfaal Foundation",
      description: "Dedicated to family sustenance, ration distribution, and grassroots social welfare.",
      contactEmail: "intake@anfaalfoundation.org",
      contactPhone: "+91 98201 55441",
      apiKey: "ak_live_anfaal_981",
    },
    {
      code: "AL_QAIM",
      name: "Al Qaim Foundation",
      description: "Specialized healthcare charity providing hospital, dialysis, and emergency medical assistance.",
      contactEmail: "relief@alqaimfoundation.org",
      contactPhone: "+91 98202 77332",
      apiKey: "ak_live_alqaim_412",
    },
    {
      code: "CWT",
      name: "Community Welfare Trust",
      description: "Higher education scholarships, vocational grants, and emergency housing support.",
      contactEmail: "scholarships@communitytrust.org",
      contactPhone: "+91 98203 99110",
      apiKey: "ak_live_cwt_773",
    },
  ];

  const orgMap = new Map<string, string>();

  for (const o of orgData) {
    const existing = await prisma.organization.findUnique({ where: { code: o.code } });
    if (existing) {
      const updated = await prisma.organization.update({
        where: { id: existing.id },
        data: { name: o.name, apiKey: o.apiKey, description: o.description },
      });
      orgMap.set(o.code, updated.id);
      console.log(`Updated organization: ${o.name} (${o.code})`);
    } else {
      const created = await prisma.organization.create({
        data: {
          code: o.code,
          name: o.name,
          description: o.description,
          contactEmail: o.contactEmail,
          contactPhone: o.contactPhone,
          apiKey: o.apiKey,
          status: "ACTIVE",
        },
      });
      orgMap.set(o.code, created.id);
      console.log(`Created organization: ${o.name} (${o.code})`);
    }
  }

  // 2. Ensure Benchmark Beneficiary BEN-000123 exists
  const benchmarkId = "BEN-000123";
  let benchmarkBen = await prisma.beneficiary.findUnique({ where: { beneficiaryId: benchmarkId } });
  if (!benchmarkBen) {
    benchmarkBen = await prisma.beneficiary.create({
      data: {
        beneficiaryId: benchmarkId,
        name: "Ahmed Khan",
        phone: "9820011223",
        area: "Kurla",
        familySize: 5,
        verificationStatus: "VERIFIED",
        verificationRef: "REF-KYC-4819",
        notes: "Family head, sole earner recovering from medical condition.",
      },
    });
    console.log(`Created benchmark beneficiary: Ahmed Khan (${benchmarkId})`);
  } else {
    console.log(`Found benchmark beneficiary: Ahmed Khan (${benchmarkId})`);
  }

  // Also make sure BEN-000101 through BEN-000120 exist
  const existingCount = await prisma.beneficiary.count();
  console.log(`Current beneficiaries in registry: ${existingCount}`);

  // 3. Clear existing CentralVerificationRecord and VerificationAuditLog for clean deterministic demo state
  await prisma.centralVerificationRecord.deleteMany();
  await prisma.verificationAuditLog.deleteMany();

  // 4. Create Al Qaim Foundation's strictly PRIVATE record for Ahmed Khan (BEN-000123)
  const alQaimId = orgMap.get("AL_QAIM")!;
  const anfaalId = orgMap.get("ANFAAL")!;
  const cwtId = orgMap.get("CWT")!;

  // Check if Al Qaim already has this private record
  const existingMedicalRecord = await prisma.assistanceRecord.findFirst({
    where: {
      beneficiaryId: benchmarkBen.id,
      organizationId: alQaimId,
      category: "Medical Assistance",
    },
  });

  const alQaimDate = new Date("2026-08-12T10:00:00.000Z");

  if (!existingMedicalRecord) {
    await prisma.assistanceRecord.create({
      data: {
        beneficiaryId: benchmarkBen.id,
        organizationId: alQaimId,
        category: "Medical Assistance",
        amount: 15000,
        date: alQaimDate,
        status: "COMPLETED",
        purpose: "Nephrology dialysis treatment cycle",
        notes: "Approved under Trustee Medical Discretion Fund",
        privateNotes: "CONFIDENTIAL CASE FILE #MED-2026-88: Dialysis recurring patient at Noor Hospital. Approved via trustee discretion. Family has zero additional insurance.",
        caseReference: "CASE-MED-2026-88",
        isPrivate: true,
      },
    });
    console.log("Created Al Qaim's private assistance record for Ahmed Khan (Medical Assistance ₹15,000)");
  } else {
    await prisma.assistanceRecord.update({
      where: { id: existingMedicalRecord.id },
      data: {
        privateNotes: "CONFIDENTIAL CASE FILE #MED-2026-88: Dialysis recurring patient at Noor Hospital. Approved via trustee discretion. Family has zero additional insurance.",
        caseReference: "CASE-MED-2026-88",
        category: "Medical Assistance",
        date: alQaimDate,
        isPrivate: true,
      },
    });
    console.log("Updated Al Qaim's private record with confidential case notes.");
  }

  // 5. Broadcast sanitized attestation to Central Verification Service
  await prisma.centralVerificationRecord.create({
    data: {
      beneficiaryReference: benchmarkId,
      category: "Medical Assistance",
      lastAssistanceDate: alQaimDate,
      status: "ACTIVE",
      reviewRequired: true,
      sourceAttestation: "AUTHORIZED_MEMBER_FOUNDATION",
    },
  });
  console.log(`✓ Synchronized sanitized attestation for ${benchmarkId} into CentralVerificationRecord.`);

  // 6. Add Anfaal's own private record for someone else (BEN-000104) to demonstrate organization data isolation
  const ben104 = await prisma.beneficiary.findFirst({ where: { beneficiaryId: { contains: "104" } } }) || benchmarkBen;
  await prisma.assistanceRecord.create({
    data: {
      beneficiaryId: ben104.id,
      organizationId: anfaalId,
      category: "Food Support",
      amount: 4500,
      date: new Date("2026-09-20"),
      status: "COMPLETED",
      purpose: "Monthly ration kit - 5 members",
      notes: "Routine distribution",
      privateNotes: "ANFAAL INTERNAL: Ration card verified; verified by volunteer Brother Zaid.",
      caseReference: "ANF-FOOD-902",
      isPrivate: true,
    },
  });

  await prisma.centralVerificationRecord.create({
    data: {
      beneficiaryReference: ben104.beneficiaryId,
      category: "Food Support",
      lastAssistanceDate: new Date("2026-09-20"),
      status: "ACTIVE",
      reviewRequired: true,
      sourceAttestation: "AUTHORIZED_MEMBER_FOUNDATION",
    },
  });

  // 7. Seed initial Audit Log entries
  await prisma.verificationAuditLog.createMany({
    data: [
      {
        organizationId: alQaimId,
        beneficiaryReference: benchmarkId,
        category: "Medical Assistance",
        action: "ASSISTANCE_RECORDED",
        result: "RECORD_CREATED",
        reviewRequired: true,
        details: "Sanitized attestation synchronized to Central Verification Network.",
        createdAt: alQaimDate,
      },
      {
        organizationId: anfaalId,
        beneficiaryReference: "BEN-000108",
        category: "Food Support",
        action: "VERIFICATION_CHECK",
        result: "CLEARED",
        reviewRequired: false,
        details: "No previous assistance detected within 365 days.",
        createdAt: new Date("2026-10-01T11:20:00Z"),
      },
    ],
  });
  console.log("✓ Initial verification audit log created.");

  console.log("--- Seeding Completed Successfully ---");
}

main()
  .catch((e) => {
    console.error("Error seeding verification data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
