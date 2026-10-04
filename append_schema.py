import os

schema_append = """

// ==========================================
// OPPORTUNITIES MODELS
// ==========================================

model Opportunity {
  id                   String   @id @default(cuid())
  type                 String   // JOB, INTERNSHIP, MENTORSHIP, PROJECT, VOLUNTEERING
  title                String
  slug                 String?  @unique
  organisationName     String
  organisationId       String?  // Optional link to DirectoryListing
  postedByUserId       String
  postedByUser         User     @relation("PostedOpportunities", fields: [postedByUserId], references: [id], onDelete: Cascade)
  description          String
  category             String
  skills               String?  // JSON or CSV
  location             String?
  workMode             String?  // REMOTE, HYBRID, ONSITE
  experienceLevel      String?
  employmentType       String?  // FULL_TIME, PART_TIME, CONTRACT, etc.
  compensationMin      Float?
  compensationMax      Float?
  compensationPeriod   String?
  currency             String   @default("INR")
  duration             String?
  startDate            String?
  applicationDeadline  DateTime?
  applicationMethod    String?  // KSIJ_ONE, EXTERNAL
  externalApplicationUrl String?
  status               String   @default("PUBLISHED") // DRAFT, PENDING_REVIEW, PUBLISHED, PAUSED, CLOSED, EXPIRED
  verificationStatus   String   @default("UNVERIFIED") // UNVERIFIED, VERIFIED
  
  mentorCapacity       Int?
  timeCommitment       String?

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  applications         OpportunityApplication[]
}

model OpportunityApplication {
  id               String      @id @default(cuid())
  opportunityId    String
  opportunity      Opportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)
  userId           String
  user             User        @relation("OpportunityApplications", fields: [userId], references: [id], onDelete: Cascade)
  resumeUrl        String?
  coverMessage     String?
  status           String      @default("SUBMITTED") // SUBMITTED, UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED, WITHDRAWN
  
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}
"""

with open("prisma/schema.prisma", "a", encoding="utf-8") as f:
    f.write(schema_append)
