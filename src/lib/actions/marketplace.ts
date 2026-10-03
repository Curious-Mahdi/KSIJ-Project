"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getMarketplaceListings(params: any = {}) {
  // Build query
  const where: any = { status: "PUBLISHED" };
  
  if (params.category) {
    where.category = params.category;
  }
  if (params.transactionType) {
    where.transactionType = params.transactionType;
  }
  if (params.query) {
    where.OR = [
      { title: { contains: params.query, mode: 'insensitive' } },
      { description: { contains: params.query, mode: 'insensitive' } },
      { location: { contains: params.query, mode: 'insensitive' } }
    ];
  }

  const listings = await prisma.marketplaceListing.findMany({
    where,
    include: { images: true, seller: true },
    orderBy: { createdAt: 'desc' }
  });

  return listings;
}

export async function getCommunityProperties(params: any = {}) {
  const where: any = { status: "PUBLISHED" };
  
  if (params.query) {
    where.OR = [
      { name: { contains: params.query, mode: 'insensitive' } },
      { description: { contains: params.query, mode: 'insensitive' } },
      { location: { contains: params.query, mode: 'insensitive' } }
    ];
  }

  const properties = await prisma.communityProperty.findMany({
    where,
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  return properties;
}

export async function createMarketplaceListing(data: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const { images, ...rest } = data;

  const listing = await prisma.marketplaceListing.create({
    data: {
      ...rest,
      sellerId: userId,
      images: {
        create: images?.map((url: string, index: number) => ({ url, sortOrder: index })) || []
      }
    }
  });

  revalidatePath("/marketplace/member-marketplace");
  revalidatePath("/marketplace");
  return listing;
}

// Stub for now, can be expanded
export async function createCommunityProperty(data: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user?.isAdmin) throw new Error("Only admins can create Community Properties");

  const { images, ...rest } = data;

  const property = await prisma.communityProperty.create({
    data: {
      ...rest,
      managedById: user.id,
      images: {
        create: images?.map((url: string, index: number) => ({ url, sortOrder: index })) || []
      }
    }
  });

  revalidatePath("/marketplace/community-properties");
  revalidatePath("/marketplace");
  return property;
}

export async function getMarketplaceListingById(id: string) {
  return await prisma.marketplaceListing.findUnique({
    where: { id },
    include: { images: true, seller: true }
  });
}

export async function initiateMarketplaceConversation(listingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const listing = await prisma.marketplaceListing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error("Listing not found");

  if (listing.sellerId === userId) {
    throw new Error("Cannot start conversation with yourself");
  }

  // Check if conversation already exists
  let conversation = await prisma.conversation.findFirst({
    where: {
      marketplaceListingId: listingId,
      initiatedById: userId
    }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        marketplaceListingId: listingId,
        initiatedById: userId,
        ownerId: listing.sellerId,
        status: "NEW"
      }
    });
  }

  return conversation;
}

export async function getCommunityPropertyById(id: string) {
  return await prisma.communityProperty.findUnique({
    where: { id },
    include: { images: true, managedBy: true }
  });
}

export async function initiateCommunityPropertyConversation(propertyId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const property = await prisma.communityProperty.findUnique({ where: { id: propertyId } });
  if (!property) throw new Error("Property not found");

  if (property.managedById === userId) {
    throw new Error("Cannot start conversation with yourself");
  }

  let conversation = await prisma.conversation.findFirst({
    where: {
      communityPropertyId: propertyId,
      initiatedById: userId
    }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        communityPropertyId: propertyId,
        initiatedById: userId,
        ownerId: property.managedById,
        status: "NEW"
      }
    });
  }

  return conversation;
}
