# Centralized Assistance Verification — System Architecture & Privacy Design Plan (Phase 1)

## Executive Summary

This document defines the architecture, privacy model, data ownership boundaries, API specifications, and demonstration workflows for the **Centralized Assistance Verification MVP** inside the Jamaat Community Platform.

The central problem solved:
> **Anfaal Foundation must NOT be able to access Al Qaim Foundation's private assistance records, and Al Qaim must NOT be able to access Anfaal's private records.**  
> Instead, participating organizations query a **Central Verification Service / API** that returns only the **minimum necessary information (data minimization)** to verify whether a beneficiary has previously received relevant assistance.

---

## 1. Existing Codebase Analysis & Reuse

### Current Stack & Architecture
- **Framework:** Next.js 16 (Turbopack, App Router) with React 19.
- **Database & ORM:** PostgreSQL (Supabase) via Prisma ORM (`@prisma/client`).
- **Styling:** Vanilla CSS modules adhering to the unified Emerald/Dark Slate Jamaat palette (`#075C3A`, `#043D29`, `#C8A64B`).
- **Admin Portal:** Structured under `/admin/*` with sidebar navigation in `AdminSidebar.tsx`.
- **Database Status:** Contains core platform models plus existing registry models (`Organization`, `Beneficiary`, `AssistanceRecord`).

### Components Reused Without Duplication
1. **Design System:** Reusing tokens from `admin.module.css` and `registry.module.css` (responsive layout, stat cards, data tables, alert banners, modal dialogs).
2. **Prisma Connection:** Reusing singleton Prisma client in `@/lib/prisma`.
3. **Admin Layout & Navigation:** Integrating the new privacy-preserving portal directly under `AdminSidebar.tsx` as **Assistance Verification** (`/admin/verification`).
4. **Beneficiary Core Data:** Reusing the generic non-Aadhaar identifier `BEN-XXXXXX` and verification reference `REF-KYC-XXXX`.

---

## 2. Privacy & Data Minimization Model

### The Anti-Pattern (Strictly Rejected)
```text
                    CENTRAL DATABASE
                          │
              ┌───────────┴───────────┐
              │                       │
      ANFAAL FOUNDATION       AL QAIM FOUNDATION
              │                       │
      Sees all records        Sees all records
      (Violates Privacy)      (Violates Privacy)
```

### The Approved Privacy-Preserving Architecture
```text
                 CENTRAL VERIFICATION SERVICE / API
                                │
               ┌────────────────┴────────────────┐
               │                                 │
     ANFAAL FOUNDATION                  AL QAIM FOUNDATION
     [ Private Partition ]              [ Private Partition ]
     - Private case notes               - Private case notes
     - Internal documents               - Internal documents
     - Exact grant amounts              - Exact grant amounts
     - Application details              - Application details
               │                                 │
               └──── POST /api/verification/check ┘
                      (Minimal Attestation Only)
```

### Data Minimization Specification
When Anfaal Foundation checks a beneficiary who previously received aid from Al Qaim Foundation:

| Field | Visible to Al Qaim (Owner) | Returned to Anfaal via Central API | Rationale |
|---|---|---|---|
| Beneficiary Reference | `BEN-000123` | `BEN-000123` | Required for matching identity |
| Assistance Category | `Medical Assistance` | `Medical Assistance` | Required to detect duplicate aid |
| Last Assistance Date | `12 Aug 2026` | `12 Aug 2026` | Required to assess eligibility window |
| Review Required Flag | `YES` | `YES` | Core verification output |
| Originating Foundation | `Al Qaim Foundation` | `Protected / Authorized Partner` | Minimizes competitive/donor exposure |
| Private Case Notes | *"Dialysis patient, Trustee memo #41"* | **NEVER EXPOSED** (Null / Excluded) | Confidential case worker details |
| Internal Grant Amount | `₹15,000` | **MASKED / EXCLUDED** | Organization financial privacy |
| Internal Document IDs | `DOC-MED-9921.pdf` | **NEVER EXPOSED** (Null / Excluded) | Medical record privacy |

---

## 3. Data Ownership & Relational Model

### Entity Breakdown

#### 1. `Organization`
Participating welfare foundations:
- `id` (CUID)
- `name` (e.g. "Anfaal Foundation", "Al Qaim Foundation", "Community Welfare Trust")
- `code` (e.g. "ANFAAL", "AL_QAIM", "CWT")
- `apiKey` (e.g. "ak_live_anfaal_...", hashed or tokenized for API auth)
- `status` ("ACTIVE")

#### 2. `Beneficiary`
Centralized public identity directory (No Aadhaar numbers stored):
- `id` (CUID)
- `beneficiaryId` (e.g. "BEN-000123")
- `name` (e.g. "Ahmed Khan")
- `phone` (e.g. "9820011223")
- `area` (e.g. "Kurla")
- `familySize` (5)
- `verificationStatus` ("VERIFIED")
- `verificationRef` ("REF-KYC-4819")

#### 3. `OrganizationAssistanceRecord` (Private Ledger Partition)
Detailed private record strictly owned by the originating organization:
- `id` (CUID)
- `beneficiaryId` (FK -> Beneficiary)
- `organizationId` (FK -> Organization)
- `category` ("Medical Assistance", "Food Support", "Education / Scholarship", etc.)
- `amount` (Float)
- `date` (DateTime)
- `status` ("COMPLETED", "APPROVED")
- `privateNotes` (Text - confidential internal notes)
- `caseReference` (String - internal case ID)

#### 4. `CentralVerificationRecord` (Sanitized Attestation Layer)
Data-minimized index accessible only through the Central Verification engine:
- `id` (CUID)
- `beneficiaryReference` (String, index on `BEN-XXXXXX`)
- `category` (String, e.g. "Medical Assistance")
- `lastAssistanceDate` (DateTime)
- `status` ("ACTIVE", "EXPIRED")
- `reviewRequired` (Boolean, default true)
- `sourceAttestation` ("AUTHORIZED_MEMBER_FOUNDATION")

#### 5. `VerificationAuditLog` (Tamper-Evident Ledger)
Immutable audit trail recording all cross-organization inquiries:
- `id` (CUID)
- `organizationId` (FK -> Organization)
- `beneficiaryReference` (String)
- `category` (String)
- `action` ("VERIFICATION_CHECK", "ASSISTANCE_RECORDED", "UNAUTHORIZED_ACCESS_BLOCKED")
- `result` ("RELEVANT_ASSISTANCE_FOUND", "NO_PRIOR_ASSISTANCE", "ACCESS_DENIED")
- `reviewRequired` (Boolean)
- `timestamp` (DateTime, default now)

---

## 4. API Design & Security Boundary

### Endpoint 1: Central Verification Check
`POST /api/verification/check`

#### Request Headers
```http
Content-Type: application/json
x-organization-api-key: ak_live_anfaal_981
```

#### Request Body
```json
{
  "beneficiaryReference": "BEN-000123",
  "assistanceType": "Medical Assistance"
}
```

#### Response (200 OK)
```json
{
  "found": true,
  "beneficiaryReference": "BEN-000123",
  "category": "Medical Assistance",
  "previousAssistance": true,
  "relevantAssistance": true,
  "lastAssistanceDate": "2026-08-12",
  "reviewRequired": true,
  "verificationSource": "Central Assistance Verification Network",
  "privacyNotice": "Originating organization private notes, internal files, and grant amounts are protected under Central Privacy Policy."
}
```

### Endpoint 2: Record Assistance & Broadcast Attestation
`POST /api/verification/record`

#### Request Body
```json
{
  "organizationId": "org_alqaim_id",
  "beneficiaryReference": "BEN-000123",
  "category": "Medical Assistance",
  "amount": 15000,
  "date": "2026-08-12",
  "privateNotes": "Dialysis ongoing case; Trustee Discretion Ref #41"
}
```
*Effect:*
1. Inserts full detailed row into `OrganizationAssistanceRecord` (visible only to Al Qaim).
2. Updates `CentralVerificationRecord` with `{ category: "Medical Assistance", lastAssistanceDate: "2026-08-12", reviewRequired: true }` without storing the private note or amount.
3. Writes immutable entry into `VerificationAuditLog`.

### Endpoint 3: Security Boundary & Rejection
`GET /api/verification/records?orgId=org_alqaim_id` (Invoked by Anfaal Foundation)

#### Response (403 Forbidden)
```json
{
  "error": "Forbidden",
  "message": "Direct access to external organization private records is strictly prohibited. Please query the Central Verification API via POST /api/verification/check."
}
```

---

## 5. Verification Logic (Deterministic Matching)

No machine learning or probabilistic guesswork. Matching hierarchy:
1. **Primary Reference:** Exact match on `beneficiaryReference` (`BEN-000123`).
2. **Secondary Fallback:** Normalized 10-digit mobile number (`9820011223`).
3. **Category Evaluation:** Case-insensitive match on normalized assistance categories:
   - `Medical Assistance` (includes Medical Aid, Hospitalization)
   - `Food Support` (includes Ration, Grocery Aid)
   - `Education / Scholarship` (includes Tuition, School Books)
   - `Emergency Financial Aid`
   - `Housing Support`
4. **Time-Window Policy:** Grants within the last 365 days trigger `reviewRequired: true`.

---

## 6. User Interface Architecture (`/admin/verification`)

The UI is structured into 4 cohesive, professional panels:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  ACTIVE ORGANIZATION CONTEXT: [ Anfaal Foundation ▼ ]                  │
│  🔒 Privacy Shield Active | API Key: ak_live_anfaal_*** | Isolated DB  │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  PANEL 1: PRIVACY-PRESERVING ASSISTANCE VERIFICATION                   │
│                                                                        │
│  Beneficiary ID: [ BEN-000123              ]                           │
│  Assistance Type: [ Medical Assistance   ▼ ]                           │
│                                                                        │
│                       [ CHECK VERIFICATION ]                           │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ⚠️ PREVIOUS RELEVANT ASSISTANCE DETECTED                         │  │
│  │ Beneficiary: BEN-000123 • Category: Medical Assistance           │  │
│  │ Last Recorded Assistance: 12 Aug 2026                            │  │
│  │ Review Required: YES                                             │  │
│  │                                                                  │  │
│  │ 🛡️ DATA MINIMIZATION ACTIVE:                                     │  │
│  │ Originating organization private notes, case worker memos, and   │  │
│  │ internal financial files are withheld under Privacy Protocol.    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┬────────────────────────────────────┐
│ PANEL 2: ANFAAL'S PRIVATE LEDGER  │ PANEL 3: CENTRAL AUDIT TRAIL       │
│ (Only Anfaal's own grants shown)  │ (Immutable log of all API checks)  │
│ - BEN-000104 Food Support ₹4,000  │ - 19:34 Anfaal checked BEN-000123  │
│ - Private Notes Visible to Anfaal │ - 19:30 Al Qaim created record     │
│ [ + Issue New Anfaal Grant ]      │ - 19:25 Anfaal checked BEN-000108  │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 7. Demo Data Profile

### Participating Organizations (3)
1. **Anfaal Foundation** (`ANFAAL`) — Focus: Food distribution & family welfare
2. **Al Qaim Foundation** (`AL_QAIM`) — Focus: Medical aid & emergency healthcare
3. **Community Welfare Trust** (`CWT`) — Focus: Higher education scholarships & housing

### Beneficiaries (20 Seeded Profiles)
- Benchmark Demo Case: **Ahmed Khan** (`BEN-000123`)
  - Phone: `9820011223` | Area: `Kurla` | Family: 5 | Status: `VERIFIED`
- Range of scenarios:
  - 5 Beneficiaries with zero prior assistance (Clean verification result: `CLEARED`).
  - 8 Beneficiaries with single-category assistance.
  - 7 Beneficiaries with multi-organization cross-aid records.

### Benchmark Privacy Test Case
1. **Al Qaim's Private Record for `BEN-000123`:**
   - Category: `Medical Assistance`
   - Amount: `₹15,000`
   - Date: `12 Aug 2026`
   - Private Notes: *"Internal case file #MED-2026-88. Dialysis recurring patient, approved via trustee discretion."*
2. **Anfaal's Verification Outcome for `BEN-000123`:**
   - Detects Medical Assistance on 12 Aug 2026.
   - Triggers `Review Required: YES`.
   - **Confirmed Isolation:** Anfaal cannot view Al Qaim's name, ₹15,000, or the private dialysis note.

---

## 8. Exact 2-Minute Presentation Demo Script

### Step 1 — Log in as Al Qaim Foundation
- In the organization switcher, select **Al Qaim Foundation**.
- Note Al Qaim's private ledger displaying their Medical Grant of ₹15,000 for `BEN-000123` with full private notes (*"Dialysis recurring patient, approved via trustee discretion"*).

### Step 2 — Switch to Anfaal Foundation
- Switch the organization dropdown to **Anfaal Foundation**.
- Demonstrate that Anfaal's private ledger does **not** contain Al Qaim's records.

### Step 3 — Anfaal Verifies BEN-000123
- In the Assistance Verification panel, enter `BEN-000123`.
- Select Category: **Medical Assistance**.
- Click **"Run Privacy-Preserving Check"**.

### Step 4 — Inspect Minimal Response & Privacy Shield
- Central API returns:
  - `Previous relevant assistance detected: YES`
  - `Category: Medical Assistance`
  - `Last assistance date: 12 Aug 2026`
  - `Review Required: YES`
- Point out the **Privacy Shield Banner**: Anfaal is prevented from reading Al Qaim's private notes or financial documents.

### Step 5 — Verify Audit Log
- Scroll to the **Central Audit Trail**.
- Point out the new immutable entry: `Anfaal Foundation verified BEN-000123 for Medical Assistance -> RESULT: DUPLICATE_FLAGGED`.

---

## 9. Limitations & Phase 2 Scalability Path

### Current MVP Scope & Simulated Boundaries
- **In-Memory / Single DB Partitioning:** Organizations are partitioned within the PostgreSQL instance with strict Server Action / API route ACL rather than separate physical VPS servers.
- **Header-Based Organization Context:** The organization switcher simulates multi-tenant authentication for rapid presentation.

### Future Phase 2 Evolution
1. **Zero-Knowledge Proofs (ZKP):** Cryptographic proofs verifying "assistance received in category X within Y days" without revealing the date or exact category.
2. **Federated Inter-NGO API:** Direct mTLS-authenticated endpoints between independent NGO servers.
3. **Decentralized Consent Gate:** SMS/OTP consent sent to the beneficiary before an external foundation can verify assistance history.
4. **Tamper-Evident Merkle Trees:** Cryptographically chained audit logs for non-repudiation across community organizations.
