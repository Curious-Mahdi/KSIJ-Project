# Centralized Assistance Registry — MVP Implementation Plan

## Executive Overview
The **Centralized Assistance Registry** is an administrative, multi-organization verification portal designed for community and Jamaat welfare organizations (e.g., Al Noor Foundation, Hussaini Welfare Trust, Community Welfare Society).

### Core Problem Solved
Multiple welfare organizations often operate in silos, inadvertently duplicating grants to the same applicants while under-serving other eligible families. The Centralized Registry allows authorized welfare administrators to:
1. Instantly verify if a beneficiary already exists in the centralized community registry.
2. Review the applicant's complete cross-organization assistance history.
3. Receive real-time deterministic duplicate warnings before approving repetitive grants.

---

## 1. Current Architecture Findings
- **Framework & Runtime**: Next.js 16.3.8 (App Router), React 19.2.8, TypeScript 5.
- **Database & ORM**: PostgreSQL (Supabase) via Prisma ORM (`prisma/schema.prisma`). Singleton client in `@/lib/prisma`.
- **Authentication**: NextAuth with Google OAuth. Role-based admin guards (`requireAdmin()`, `getAdminSession()`) in `src/lib/auth-admin.ts` and `src/app/admin/layout.tsx`.
- **Admin Layout**: Uniform sidebar and top header in `src/app/admin/layout.tsx`.
- **Styling System**: CSS Modules adhering to the core design tokens:
  - Colors: `--color-primary` (`#0B5133`), `--color-surface` (`#ffffff`), `--color-border` (`#e2e8f0`), `--color-text-main` (`#0f172a`), `--color-accent-gold` (`#d97706`).
- **Chatbot Separation**: The public chatbot in `src/components/chatbot/` remains strictly focused on general community services, knowledge documents, and public inquiries. The assistance registry is strictly restricted to authorized administrators and welfare committee personnel.

---

## 2. Existing Components to Reuse
- **Admin Shell & Sidebar**: `src/app/admin/layout.tsx` and `src/app/admin/_components/AdminSidebar.tsx`. Add `{ label: "Assistance Registry", href: "/admin/registry", icon: ShieldCheck }`.
- **Design Tokens & Classes**: `src/app/admin/admin.module.css` (data tables, filter bars, search inputs, status badges, secondary buttons).
- **Server Action Pattern**: Modular Server Actions with `"use server"` directives, validated by Zod and executed through `prisma`.

---

## 3. Minimal Relational Database Model

To avoid unnecessary complexity, exactly three relational models are introduced:

```prisma
model Organization {
  id           String             @id @default(cuid())
  name         String             @unique // e.g. "Al Noor Foundation"
  code         String             @unique // e.g. "AL_NOOR"
  description  String?
  contactEmail String?
  contactPhone String?
  status       String             @default("ACTIVE") // ACTIVE, SUSPENDED
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt

  records      AssistanceRecord[]
}

model Beneficiary {
  id                 String             @id @default(cuid())
  beneficiaryId      String             @unique // e.g. "BEN-000101"
  name               String
  phone              String
  area               String             // e.g. "Kurla", "Dongri", "Govandi"
  familySize         Int                @default(1)
  verificationStatus String             @default("VERIFIED") // VERIFIED, PENDING, UNVERIFIED
  verificationRef    String?            // Generic reference token e.g. "VER-KYC-9421"
  notes              String?
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  assistanceRecords  AssistanceRecord[]

  @@index([phone])
  @@index([name])
  @@index([area])
  @@index([beneficiaryId])
}

model AssistanceRecord {
  id             String       @id @default(cuid())
  beneficiaryId  String
  beneficiary    Beneficiary  @relation(fields: [beneficiaryId], references: [id], onDelete: Cascade)
  
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  category       String       // "Medical Aid", "Food Support", "Education / Scholarship", "Emergency Financial Aid", "Loan", "Housing Support"
  amount         Float        // Amount in INR
  date           DateTime     @default(now())
  status         String       @default("COMPLETED") // COMPLETED, APPROVED, UNDER_REVIEW
  purpose        String?      // e.g. "Hospitalization subsidy", "Semester fee grant"
  notes          String?
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([beneficiaryId])
  @@index([organizationId])
  @@index([category])
  @@index([date])
}
```

---

## 4. Privacy & Identity Strategy
- **No Aadhaar Stored**: Aadhaar numbers are never collected, stored, or indexed.
- **Internal Identifiers**: Beneficiaries are assigned standardized sequential tokens (`BEN-000101`, `BEN-000102`).
- **Identity Verification Separation**: Verification is stored as a generic state (`VERIFIED`, `PENDING`, `UNVERIFIED`) alongside a verification token (`VER-KYC-9421`), allowing future integration with formal KYC without exposing PII.
- **Privacy-Aware Audit View**: Participating organizations can inspect assistance category, amounts, and disbursement dates without unnecessarily exposing internal caseworker commentary from other organizations.

---

## 5. Routes & Pages Architecture
1. **`/admin/registry`** (Assistance Registry Dashboard & Search):
   - Multi-organization simulator dropdown (`Current Organization: [ Al Noor Foundation ▼ ]`).
   - High-leverage operational KPIs: Total Registered Beneficiaries, Total Assistance Disbursed, Flagged Duplicate Attempts, Multi-Grant Families.
   - Real-time instant search bar (searches across name, phone number, and beneficiary ID).
   - Beneficiaries ledger table with status pills, family sizes, and previous assistance counts.
   - Quick "Register Beneficiary" modal.
2. **`/admin/registry/[id]`** (Beneficiary Profile & Verification Ledger):
   - Beneficiary profile summary (Identity ID, Verification status, Family size, Area, Contact).
   - Chronological Assistance History Timeline across all participating organizations.
   - "Issue Assistance" Action form with **real-time deterministic duplicate warning** if the applicant already received assistance in that category.

---

## 6. Components Required
- `RegistryClientView.tsx`: Main registry dashboard, multi-org switcher, search filter, and registration modal.
- `BeneficiaryDetailView.tsx`: Complete profile view, assistance timeline, and new disbursement form.
- `DuplicateWarningBanner.tsx`: Reusable alert component highlighting category match, previous amount, previous date, and providing organization.
- `OrganizationSwitcher.tsx`: Dropdown that simulates switching between active welfare bodies.

---

## 7. Server Actions (`src/lib/actions/registry.ts`)
- `getOrganizations()`: Fetch active participating organizations.
- `searchBeneficiaries(query, area?, status?)`: Fast multi-column lookup (exact ID, normalized phone, fuzzy name).
- `getBeneficiaryById(id)`: Full beneficiary profile with assistance records and organization joins.
- `checkDuplicateAssistance(beneficiaryId, category, lookbackDays?)`: Returns potential matching historical records.
- `createAssistanceRecord(...)`: Validates and records assistance in the central ledger.
- `createBeneficiary(...)`: Registers a new beneficiary with auto-generated ID (`BEN-XXXXXX`).
- `getRegistryStats()`: Aggregated counts and duplicate prevention metrics.

---

## 8. Seed Data Strategy
Seeded with **20 realistic beneficiaries** and **42 assistance records** across 3 welfare organizations:
1. **Al Noor Foundation**
2. **Hussaini Welfare Trust**
3. **Community Welfare Society**

### Benchmark Demonstration Beneficiary:
- **Name**: `Ahmed Khan`
- **ID**: `BEN-000101`
- **Location**: Kurla, Mumbai (Family Size: 5, Status: `VERIFIED`, Phone: `9820011223`)
- **Existing Aid Records**:
  - Medical Aid: ₹15,000 (12 Aug 2026, Al Noor Foundation)
  - Food Support: ₹5,000 (03 Sep 2026, Hussaini Welfare Trust)
  - Scholarship: ₹20,000 (15 Jun 2026, Community Welfare Society)
- **Demonstration Flow**:
  - Search for `Ahmed Khan` or `BEN-000101` or `9820011223`.
  - Attempt to issue a new **Medical Aid** request.
  - The system detects the 12 Aug 2026 Medical Aid record and renders an immediate alert:
    > **Potential Duplicate Assistance Detected**  
    > *Ahmed Khan previously received Medical Aid of ₹15,000 on 12 Aug 2026 (Al Noor Foundation). Please review before approving duplicate disbursement.*

---

## 9. Duplicate-Detection Logic
Deterministic multi-stage matching:
1. **Tier 1 (Exact Match)**: Matches by `beneficiaryId` or exact 10-digit normalized phone number (`phone.replace(/\D/g, '')`).
2. **Tier 2 (Category Overlap Match)**: Queries all records for that beneficiary where `category == requestedCategory`.
3. **Tier 3 (Time Threshold Window)**: Overlaps within the last 180 days are flagged as `HIGH_RISK_DUPLICATE`; older records flagged as `REPEAT_BENEFICIARY`.

---

## 10. Required Demo Workflows

### Demo 1: Existing Beneficiary & Duplicate Warning
1. Navigate to `/admin/registry`.
2. Select current organization: `Al Noor Foundation`.
3. Search `Ahmed Khan` in the search box.
4. Click on Ahmed Khan's profile.
5. Review the 3 prior assistance records from Al Noor, Hussaini Trust, and Community Welfare.
6. Click "Record New Assistance" and choose "Medical Aid".
7. System immediately fires the **Duplicate Assistance Warning** with exact previous dates and amounts.

### Demo 2: Cross-Organization Verification Simulation
1. Switch current organization to `Hussaini Welfare Trust`.
2. Look up `Fatima Sayed` (`BEN-000104`).
3. Record a new Education Scholarship under `Hussaini Welfare Trust`.
4. Switch organization dropdown to `Community Welfare Society`.
5. Search `Fatima Sayed` again.
6. The record just created under Hussaini Welfare Trust is instantly visible to Community Welfare Society.

---

## 11. Future Scalability Path
- **Cryptographic Audit Log**: Append-only hash chain verifying record integrity without blockchain gas fees.
- **Zero-Knowledge Proofs (ZKP)**: Prove an applicant has received less than ₹50,000 across all charities this year without revealing which charity paid.
- **National Jamaat Federation**: Interoperable APIs linking city-wide Jamaats across Mumbai, Pune, Gujarat, and overseas.
