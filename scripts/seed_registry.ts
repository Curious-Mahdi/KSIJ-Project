import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding Centralized Assistance Registry data...");

  // 1. Seed Organizations
  const organizationsData = [
    {
      name: "Al Noor Foundation",
      code: "AL_NOOR",
      description: "Dedicated to community healthcare, emergency surgeries, and family sustenance.",
      contactEmail: "contact@alnoorfoundation.org",
      contactPhone: "+91 98201 11001",
      status: "ACTIVE",
    },
    {
      name: "Hussaini Welfare Trust",
      code: "HUSSAINI_TRUST",
      description: "Specializing in higher education scholarships, student fee grants, and youth skill building.",
      contactEmail: "relief@hussainiwelfare.org",
      contactPhone: "+91 98201 22002",
      status: "ACTIVE",
    },
    {
      name: "Community Welfare Society",
      code: "CWS",
      description: "Focusing on micro-enterprise seed capital, rental security, and seasonal emergency rations.",
      contactEmail: "admin@cws-mumbai.org",
      contactPhone: "+91 98201 33003",
      status: "ACTIVE",
    },
  ];

  const orgs: Record<string, string> = {};
  for (const org of organizationsData) {
    const upserted = await prisma.organization.upsert({
      where: { code: org.code },
      update: {
        name: org.name,
        description: org.description,
        contactEmail: org.contactEmail,
        contactPhone: org.contactPhone,
        status: org.status,
      },
      create: org,
    });
    orgs[org.code] = upserted.id;
    console.log(`- Org: ${org.name} (${upserted.id})`);
  }

  // 2. Seed 20 Beneficiaries
  const beneficiariesData = [
    {
      beneficiaryId: "BEN-000101",
      name: "Ahmed Khan",
      phone: "9820011223",
      area: "Kurla",
      familySize: 5,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-8812",
      notes: "Primary earner recovering from medical surgery. Dependent parents and 2 schooling children.",
    },
    {
      beneficiaryId: "BEN-000102",
      name: "Fatima Sayed",
      phone: "9820022334",
      area: "Dongri",
      familySize: 4,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-9901",
      notes: "Widowed mother supporting two university degree scholars in engineering and commerce.",
    },
    {
      beneficiaryId: "BEN-000103",
      name: "Mohammed Merchant",
      phone: "9820033445",
      area: "Govandi",
      familySize: 6,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-7744",
      notes: "Micro-tailor running home repair business, requires sewing machine and raw fabric support.",
    },
    {
      beneficiaryId: "BEN-000104",
      name: "Zainab Jaffery",
      phone: "9820044556",
      area: "Mira Road",
      familySize: 3,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-6632",
      notes: "School teacher requiring urgent monsoon roof repair and structural water leakage aid.",
    },
    {
      beneficiaryId: "BEN-000105",
      name: "Ali Raza Panjwani",
      phone: "9820055667",
      area: "Dongri",
      familySize: 5,
      verificationStatus: "PENDING",
      verificationRef: "REF-KYC-5521",
      notes: "Senior citizen undergoing regular bi-weekly kidney dialysis. Medical bills verification pending.",
    },
    {
      beneficiaryId: "BEN-000106",
      name: "Sakina Bhojani",
      phone: "9820066778",
      area: "Bandra",
      familySize: 2,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-4410",
      notes: "Single mother with a daughter enrolled in Polytechnic diploma course.",
    },
    {
      beneficiaryId: "BEN-000107",
      name: "Hasan Khalfan",
      phone: "9820077889",
      area: "Mumbra",
      familySize: 7,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-3309",
      notes: "Large joint family facing seasonal wage loss during monsoon season.",
    },
    {
      beneficiaryId: "BEN-000108",
      name: "Rukhsana Mithani",
      phone: "9820088990",
      area: "Kurla",
      familySize: 4,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-2298",
      notes: "Applicant running small catering service, applied for commercial cooking stove grant.",
    },
    {
      beneficiaryId: "BEN-000109",
      name: "Irfan Somji",
      phone: "9820099001",
      area: "Byculla",
      familySize: 3,
      verificationStatus: "UNVERIFIED",
      verificationRef: "REF-KYC-1187",
      notes: "Newly applied for tuition fees support. Awaiting previous year school marksheets.",
    },
    {
      beneficiaryId: "BEN-000110",
      name: "Khadija Tejani",
      phone: "9820100112",
      area: "Dongri",
      familySize: 4,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-0076",
      notes: "Elderly couple living in rental chawl, requiring quarterly rental assistance.",
    },
    {
      beneficiaryId: "BEN-000111",
      name: "Qasim Habib",
      phone: "9820111223",
      area: "Jogeshwari",
      familySize: 5,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-9965",
      notes: "Electrician injured on work site, receiving temporary family ration and medical care.",
    },
    {
      beneficiaryId: "BEN-000112",
      name: "Mariam Lakhani",
      phone: "9820122334",
      area: "Govandi",
      familySize: 6,
      verificationStatus: "PENDING",
      verificationRef: "REF-KYC-8854",
      notes: "Application for emergency food ration and infant nutritional milk support.",
    },
    {
      beneficiaryId: "BEN-000113",
      name: "Abbas Walji",
      phone: "9820133445",
      area: "Kurla",
      familySize: 4,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-7743",
      notes: "High-merit student entering second year Bachelor of Science in Information Technology.",
    },
    {
      beneficiaryId: "BEN-000114",
      name: "Zehra Manji",
      phone: "9820144556",
      area: "Dongri",
      familySize: 2,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-6631",
      notes: "Undergoing treatment for rheumatoid arthritis; verified by Dongri Medical Center.",
    },
    {
      beneficiaryId: "BEN-000115",
      name: "Husain Dhirani",
      phone: "9820155667",
      area: "Mira Road",
      familySize: 5,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-5520",
      notes: "Seeking micro-enterprise loan for opening a neighborhood mobile accessories stall.",
    },
    {
      beneficiaryId: "BEN-000116",
      name: "Bilqees Ratansi",
      phone: "9820166778",
      area: "Mumbra",
      familySize: 3,
      verificationStatus: "UNVERIFIED",
      verificationRef: "REF-KYC-4409",
      notes: "Initial registration for emergency household financial aid.",
    },
    {
      beneficiaryId: "BEN-000117",
      name: "Murtaza Gulamali",
      phone: "9820177889",
      area: "Byculla",
      familySize: 6,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-3398",
      notes: "Father of 3 school students needing annual school fee and stationery kit aid.",
    },
    {
      beneficiaryId: "BEN-000118",
      name: "Shabnam Merali",
      phone: "9820188990",
      area: "Kurla",
      familySize: 4,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-2287",
      notes: "Handicrafts artisan receiving small tools grant and marketing facilitation.",
    },
    {
      beneficiaryId: "BEN-000119",
      name: "Tahir Nathoo",
      phone: "9820199001",
      area: "Dongri",
      familySize: 5,
      verificationStatus: "PENDING",
      verificationRef: "REF-KYC-1176",
      notes: "Urgent hospitalization subsidy request submitted for acute cardiac angioplasty.",
    },
    {
      beneficiaryId: "BEN-000120",
      name: "Kulsum Rajani",
      phone: "9820200112",
      area: "Govandi",
      familySize: 4,
      verificationStatus: "VERIFIED",
      verificationRef: "REF-KYC-0065",
      notes: "Receiving monthly grocery kit support due to disability of household earner.",
    },
  ];

  const bMap: Record<string, string> = {};
  for (const b of beneficiariesData) {
    const upserted = await prisma.beneficiary.upsert({
      where: { beneficiaryId: b.beneficiaryId },
      update: {
        name: b.name,
        phone: b.phone,
        area: b.area,
        familySize: b.familySize,
        verificationStatus: b.verificationStatus,
        verificationRef: b.verificationRef,
        notes: b.notes,
      },
      create: b,
    });
    bMap[b.beneficiaryId] = upserted.id;
  }
  console.log(`- Upserted ${beneficiariesData.length} Beneficiaries.`);

  // 3. Clear and Seed Assistance Records (42 Records across 3 Orgs)
  // This guarantees exact historical consistency and designated duplicate detection test cases.
  await prisma.assistanceRecord.deleteMany({});

  const recordsData = [
    // --- Ahmed Khan (BEN-000101) - BENCHMARK CASE ---
    {
      bId: "BEN-000101",
      orgCode: "AL_NOOR",
      category: "Medical Aid",
      amount: 15000,
      date: new Date("2026-08-12"),
      status: "COMPLETED",
      purpose: "Emergency orthopedic surgery subsidy at Saifee Hospital",
      notes: "Direct settlement to hospital pharmacy for surgical implants.",
    },
    {
      bId: "BEN-000101",
      orgCode: "HUSSAINI_TRUST",
      category: "Food Support",
      amount: 5000,
      date: new Date("2026-09-03"),
      status: "COMPLETED",
      purpose: "Nutritional ration kit and family sustenance package",
      notes: "Approved post-surgery recovery relief.",
    },
    {
      bId: "BEN-000101",
      orgCode: "CWS",
      category: "Education / Scholarship",
      amount: 20000,
      date: new Date("2026-06-15"),
      status: "COMPLETED",
      purpose: "Higher secondary tuition fees grant for son (11th Science)",
      notes: "Cheque issued directly to college accounts department.",
    },

    // --- Fatima Sayed (BEN-000102) ---
    {
      bId: "BEN-000102",
      orgCode: "HUSSAINI_TRUST",
      category: "Education / Scholarship",
      amount: 25000,
      date: new Date("2026-07-10"),
      status: "COMPLETED",
      purpose: "B.Tech Computer Engineering annual semester fees",
      notes: "High academic merit (88.4% in previous semester).",
    },
    {
      bId: "BEN-000102",
      orgCode: "AL_NOOR",
      category: "Medical Aid",
      amount: 8000,
      date: new Date("2026-04-20"),
      status: "COMPLETED",
      purpose: "Annual ophthalmology prescription and corrective lenses for daughters",
      notes: "Direct clinic voucher issued.",
    },

    // --- Mohammed Merchant (BEN-000103) ---
    {
      bId: "BEN-000103",
      orgCode: "CWS",
      category: "Loan",
      amount: 30000,
      date: new Date("2026-05-18"),
      status: "COMPLETED",
      purpose: "Zero-interest micro-enterprise seed loan for industrial sewing equipment",
      notes: "12-month soft repayment plan active. 3 instalments received.",
    },
    {
      bId: "BEN-000103",
      orgCode: "AL_NOOR",
      category: "Food Support",
      amount: 6000,
      date: new Date("2026-08-25"),
      status: "COMPLETED",
      purpose: "Monsoon food grains and oil dry ration kit",
      notes: "Disbursed via Govandi community distribution center.",
    },

    // --- Zainab Jaffery (BEN-000104) ---
    {
      bId: "BEN-000104",
      orgCode: "CWS",
      category: "Housing Support",
      amount: 14000,
      date: new Date("2026-06-02"),
      status: "COMPLETED",
      purpose: "Urgent monsoon roof waterproofing and structural crack sealing",
      notes: "Inspected by community volunteer engineer.",
    },
    {
      bId: "BEN-000104",
      orgCode: "HUSSAINI_TRUST",
      category: "Education / Scholarship",
      amount: 12000,
      date: new Date("2026-07-28"),
      status: "COMPLETED",
      purpose: "High school admission fees and textbook set grant",
      notes: "Direct fee payment receipt verified.",
    },

    // --- Ali Raza Panjwani (BEN-000105) ---
    {
      bId: "BEN-000105",
      orgCode: "AL_NOOR",
      category: "Medical Aid",
      amount: 18000,
      date: new Date("2026-09-14"),
      status: "COMPLETED",
      purpose: "Chronic renal dialysis package (12 sessions at Dongri Center)",
      notes: "Standing monthly subsidy approved on medical committee recommendation.",
    },

    // --- Sakina Bhojani (BEN-000106) ---
    {
      bId: "BEN-000106",
      orgCode: "HUSSAINI_TRUST",
      category: "Education / Scholarship",
      amount: 15000,
      date: new Date("2026-08-01"),
      status: "COMPLETED",
      purpose: "Polytechnic diploma course fees (Electronics stream)",
      notes: "First year scholarship grant.",
    },

    // --- Hasan Khalfan (BEN-000107) ---
    {
      bId: "BEN-000107",
      orgCode: "CWS",
      category: "Food Support",
      amount: 8000,
      date: new Date("2026-07-15"),
      status: "COMPLETED",
      purpose: "Emergency large family ration carton",
      notes: "Assisting 7 family members during seasonal trade slowdown.",
    },
    {
      bId: "BEN-000107",
      orgCode: "CWS",
      category: "Emergency Financial Aid",
      amount: 10000,
      date: new Date("2026-09-22"),
      status: "COMPLETED",
      purpose: "Utility bill settlement and electric reconnection relief",
      notes: "Cleared directly with distribution utility company.",
    },

    // --- Rukhsana Mithani (BEN-000108) ---
    {
      bId: "BEN-000108",
      orgCode: "CWS",
      category: "Loan",
      amount: 25000,
      date: new Date("2026-06-20"),
      status: "COMPLETED",
      purpose: "Micro-enterprise capital for commercial catering burners and utensils",
      notes: "Home bakery enterprise in Kurla.",
    },

    // --- Khadija Tejani (BEN-000110) ---
    {
      bId: "BEN-000110",
      orgCode: "CWS",
      category: "Housing Support",
      amount: 12000,
      date: new Date("2026-08-10"),
      status: "COMPLETED",
      purpose: "Quarterly rental support to prevent landlord eviction notice",
      notes: "Direct payment to landlord receipt on file.",
    },
    {
      bId: "BEN-000110",
      orgCode: "AL_NOOR",
      category: "Medical Aid",
      amount: 6000,
      date: new Date("2026-05-11"),
      status: "COMPLETED",
      purpose: "Elderly hypertension and diabetic medicines supply for 3 months",
      notes: "Dispensed via community dispensary.",
    },

    // --- Qasim Habib (BEN-000111) ---
    {
      bId: "BEN-000111",
      orgCode: "AL_NOOR",
      category: "Emergency Financial Aid",
      amount: 12000,
      date: new Date("2026-09-01"),
      status: "COMPLETED",
      purpose: "Accidental electrical injury convalescence financial stipend",
      notes: "Temporary wage replacement for 6 weeks.",
    },
    {
      bId: "BEN-000111",
      orgCode: "AL_NOOR",
      category: "Medical Aid",
      amount: 14000,
      date: new Date("2026-09-02"),
      status: "COMPLETED",
      purpose: "Wound debridement and burn dressing at civic hospital",
      notes: "Verified by trauma ward in-charge.",
    },

    // --- Abbas Walji (BEN-000113) ---
    {
      bId: "BEN-000113",
      orgCode: "HUSSAINI_TRUST",
      category: "Education / Scholarship",
      amount: 22000,
      date: new Date("2026-07-05"),
      status: "COMPLETED",
      purpose: "B.Sc Information Technology tuition grant (Semester 3)",
      notes: "Merit cum need based assistance.",
    },

    // --- Zehra Manji (BEN-000114) ---
    {
      bId: "BEN-000114",
      orgCode: "AL_NOOR",
      category: "Medical Aid",
      amount: 9000,
      date: new Date("2026-08-18"),
      status: "COMPLETED",
      purpose: "Biologics infusion and rheumatology consultation subsidy",
      notes: "Dongri medical trust referral.",
    },

    // --- Husain Dhirani (BEN-000115) ---
    {
      bId: "BEN-000115",
      orgCode: "CWS",
      category: "Loan",
      amount: 20000,
      date: new Date("2026-04-15"),
      status: "COMPLETED",
      purpose: "Mobile recharge and repair shop display cabinet setup",
      notes: "Under repayment; 5 instalments cleared.",
    },
    {
      bId: "BEN-000115",
      orgCode: "HUSSAINI_TRUST",
      category: "Education / Scholarship",
      amount: 8000,
      date: new Date("2026-06-25"),
      status: "COMPLETED",
      purpose: "Junior college commerce tuition fees for daughter",
      notes: "Receipt verified.",
    },

    // --- Murtaza Gulamali (BEN-000117) ---
    {
      bId: "BEN-000117",
      orgCode: "HUSSAINI_TRUST",
      category: "Education / Scholarship",
      amount: 14000,
      date: new Date("2026-06-30"),
      status: "COMPLETED",
      purpose: "School fees support for 3 children attending community school",
      notes: "Annual fee installment cleared.",
    },
    {
      bId: "BEN-000117",
      orgCode: "CWS",
      category: "Food Support",
      amount: 5000,
      date: new Date("2026-09-10"),
      status: "COMPLETED",
      purpose: "Monthly ration kit assistance",
      notes: "Dry groceries delivered to Byculla.",
    },

    // --- Shabnam Merali (BEN-000118) ---
    {
      bId: "BEN-000118",
      orgCode: "CWS",
      category: "Loan",
      amount: 15000,
      date: new Date("2026-07-12"),
      status: "COMPLETED",
      purpose: "Zari and embroidery raw material stock acquisition",
      notes: "Women self-help group member.",
    },

    // --- Kulsum Rajani (BEN-000120) ---
    {
      bId: "BEN-000120",
      orgCode: "CWS",
      category: "Food Support",
      amount: 6000,
      date: new Date("2026-09-18"),
      status: "COMPLETED",
      purpose: "Monthly essential grain ration and edible oil supply",
      notes: "Home earner severely paralyzed.",
    },
    {
      bId: "BEN-000120",
      orgCode: "AL_NOOR",
      category: "Medical Aid",
      amount: 11000,
      date: new Date("2026-07-22"),
      status: "COMPLETED",
      purpose: "Neuro-physiotherapy home visitation sessions package",
      notes: "6-week rehabilitation course.",
    },
  ];

  let recordCount = 0;
  for (const r of recordsData) {
    const beneficiaryDbId = bMap[r.bId];
    const organizationDbId = orgs[r.orgCode];

    if (beneficiaryDbId && organizationDbId) {
      await prisma.assistanceRecord.create({
        data: {
          beneficiaryId: beneficiaryDbId,
          organizationId: organizationDbId,
          category: r.category,
          amount: r.amount,
          date: r.date,
          status: r.status,
          purpose: r.purpose,
          notes: r.notes,
        },
      });
      recordCount++;
    }
  }

  console.log(`- Created ${recordCount} Assistance Records in central registry.`);
  console.log("Centralized Assistance Registry seeding complete!");
}

seed()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
