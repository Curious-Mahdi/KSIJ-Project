"use server";

import { prisma } from "@/lib/prisma";

export async function globalSearch(query: string) {
  if (!query || query.trim().length === 0) return { directory: [], marketplace: [] };

  const searchStr = query.trim();

  // Search Directory
  const directoryResults = await prisma.directoryListing.findMany({
    where: {
      OR: [
        { name: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
        { category: { contains: searchStr, mode: 'insensitive' } },
        { location: { contains: searchStr, mode: 'insensitive' } }
      ],
      status: "APPROVED"
    },
    take: 3,
    select: {
      id: true,
      name: true,
      category: true,
      listingType: true
    }
  });

  // Search Marketplace
  const marketplaceResults = await prisma.marketplaceListing.findMany({
    where: {
      OR: [
        { title: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
        { category: { contains: searchStr, mode: 'insensitive' } }
      ],
      status: "APPROVED"
    },
    take: 3,
    select: {
      id: true,
      title: true,
      category: true,
      transactionType: true,
      condition: true
    }
  });

  return {
    directory: directoryResults,
    marketplace: marketplaceResults
  };
}
