"use server";

import { prisma } from "@/lib/prisma";
import { services } from "@/lib/data/services";

export async function globalSearch(query: string) {
  if (!query || query.trim().length === 0) return { directory: [], marketplace: [], services: [] };

  const searchStr = query.trim();

  // Search Directory
  const directoryResults = await prisma.directoryListing.findMany({
    where: {
      OR: [
        { name: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
        { category: { contains: searchStr, mode: 'insensitive' } },
        { location: { contains: searchStr, mode: 'insensitive' } }
      ]
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
      ]
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

  // Search Services
  const searchLower = searchStr.toLowerCase();
  const serviceResults = services.filter(service => 
    service.title.toLowerCase().includes(searchLower) ||
    service.description.toLowerCase().includes(searchLower) ||
    service.category.toLowerCase().includes(searchLower)
  ).map(service => ({
    id: service.id,
    title: service.title,
    category: service.category,
    description: service.description
  })).slice(0, 3);

  return {
    directory: directoryResults,
    marketplace: marketplaceResults,
    services: serviceResults
  };
}
