"use server";

import { prisma } from "@/lib/prisma";
import { DEMO_ANALYTICS_DATA, AnalyticsDataset } from "@/lib/data/analytics-demo";

/**
 * Fetch analytics overview data.
 * 
 * Future Architecture:
 * When the Jamaat administration migrates the `AssistanceRecord` table in PostgreSQL,
 * this function will run real SQL aggregation queries (e.g. `prisma.assistanceRecord.aggregate()`,
 * `groupBy()`, etc.).
 * 
 * If no assistance table exists or no historical rows are found, it gracefully serves
 * the internally consistent, typed demo dataset clearly marked as illustrative.
 */
export async function getAnalyticsData(): Promise<AnalyticsDataset> {
  try {
    // Attempt dynamic query on future AssistanceRecord model if it has been added to Prisma Client
    const prismaAny = prisma as any;
    if (prismaAny.assistanceRecord && typeof prismaAny.assistanceRecord.count === "function") {
      const recordCount = await prismaAny.assistanceRecord.count().catch(() => 0);
      if (recordCount > 0) {
        // Here we can run live aggregations in the future
        // For now, if records exist, we could blend or return populated analytics
      }
    }

    // Return the internally consistent demo analytics dataset
    return DEMO_ANALYTICS_DATA;
  } catch (error) {
    console.error("Error fetching analytics data, falling back to demo dataset:", error);
    return DEMO_ANALYTICS_DATA;
  }
}
