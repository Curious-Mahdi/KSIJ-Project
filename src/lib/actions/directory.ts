"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createListing(data: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  
  const userId = (session.user as any).id;
  
  // Transform data
  const servicesJson = JSON.stringify(data.services || []);
  const skillsJson = JSON.stringify(data.skills || []);

  const listing = await prisma.directoryListing.create({
    data: {
      ownerId: userId,
      listingType: data.listingType,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      services: servicesJson,
      skills: skillsJson,
      location: data.location,
      serviceArea: data.serviceArea,
      serviceMode: data.serviceMode,
      website: data.website,
      image: data.image,
      status: "PUBLISHED",
      contact: {
        create: {
          phone: data.phone || null,
          whatsapp: data.whatsapp || null,
          email: data.email || null,
          phoneVisibility: data.phoneVisibility || "CHAT_ONLY",
          whatsappVisibility: data.whatsappVisibility || "CHAT_ONLY",
          emailVisibility: data.emailVisibility || "CHAT_ONLY",
        }
      }
    }
  });

  revalidatePath('/directory');
  revalidatePath('/directory/my-directory');
  
  return listing;
}

export async function getDirectoryListings(searchParams?: { 
  q?: string; 
  type?: string; 
  category?: string;
}) {
  let whereClause: any = {
    status: "PUBLISHED"
  };

  if (searchParams?.q) {
    // Format for Postgres full-text search (web development -> web | development)
    const formattedQuery = searchParams.q
      .trim()
      .split(/\s+/)
      .map(word => word.replace(/[^a-zA-Z0-9]/g, '')) // basic sanitization
      .filter(word => word.length > 0)
      .join(' | ');

    if (formattedQuery) {
      whereClause.OR = [
        { name: { search: formattedQuery } },
        { shortDescription: { search: formattedQuery } },
        { description: { search: formattedQuery } },
        { category: { search: formattedQuery } },
        { subcategory: { search: formattedQuery } },
        { services: { search: formattedQuery } },
        { skills: { search: formattedQuery } },
        { keywords: { search: formattedQuery } },
        { tags: { search: formattedQuery } },
        { area: { search: formattedQuery } },
        { city: { search: formattedQuery } },
        { serviceArea: { search: formattedQuery } },
      ];
    }
  }

  if (searchParams?.type && searchParams.type !== 'All') {
    whereClause.listingType = searchParams.type;
  }

  if (searchParams?.category && searchParams.category !== 'All') {
    whereClause.category = searchParams.category;
  }

  const listings = await prisma.directoryListing.findMany({
    where: whereClause,
    include: {
      owner: {
        select: {
          name: true,
          profilePhoto: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return listings;
}

export async function getListingById(id: string) {
  const listing = await prisma.directoryListing.findUnique({
    where: { id, status: "PUBLISHED" },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          profilePhoto: true
        }
      }
    }
  });
  return listing;
}

export async function startConversation(listingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  const listing = await prisma.directoryListing.findUnique({
    where: { id: listingId }
  });

  if (!listing) throw new Error("Listing not found");
  if (listing.ownerId === userId) throw new Error("Cannot start conversation with yourself");

  // Check if conversation already exists
  const existing = await prisma.conversation.findFirst({
    where: {
      listingId,
      initiatedById: userId
    }
  });

  if (existing) {
    return existing.id;
  }

  // Create new conversation
  const newConversation = await prisma.conversation.create({
    data: {
      listingId,
      ownerId: listing.ownerId,
      initiatedById: userId,
      status: "NEW"
    }
  });

  return newConversation.id;
}

export async function getConversation(conversationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      listing: {
        include: {
          owner: { select: { id: true, name: true, profilePhoto: true } },
          contact: true
        }
      },
      marketplaceListing: {
        include: { seller: { select: { id: true, name: true, profilePhoto: true } } }
      },
      communityProperty: {
        include: { managedBy: { select: { id: true, name: true, profilePhoto: true } } }
      },
      initiatedBy: { select: { id: true, name: true, profilePhoto: true } },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true } } }
      },
      contactShares: true
    }
  });

  if (!conversation) throw new Error("Conversation not found");
  if (conversation.initiatedById !== userId && conversation.ownerId !== userId) {
    throw new Error("Unauthorized access to conversation");
  }

  return conversation;
}

export async function sendMessage(conversationId: string, text: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  if (!text || !text.trim()) return null;

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: (session.user as any).id,
      message: text.trim()
    }
  });

  // Update conversation status if it's new
  await prisma.conversation.updateMany({
    where: { id: conversationId, status: "NEW" },
    data: { status: "IN_CONVERSATION" }
  });

  revalidatePath(`/directory/chat/${conversationId}`);
  return message;
}

export async function shareContact(conversationId: string, shareOptions: { phone: boolean, whatsapp: boolean, email: boolean }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) throw new Error("Conversation not found");

  // Only listing owner should share contact in this context, but technically anyone can.
  // We'll record who shared it.
  await prisma.contactShare.create({
    data: {
      conversationId,
      sharedById: userId,
      phoneShared: shareOptions.phone,
      whatsappShared: shareOptions.whatsapp,
      emailShared: shareOptions.email
    }
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: "CONTACT_SHARED" }
  });

  revalidatePath(`/directory/chat/${conversationId}`);
}

export async function markConversationCompleted(conversationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation || (conversation.initiatedById !== userId && conversation.ownerId !== userId)) {
    throw new Error("Unauthorized");
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: "COMPLETED" }
  });

  revalidatePath(`/directory/chat/${conversationId}`);
}

export async function markConversationReopened(conversationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation || (conversation.initiatedById !== userId && conversation.ownerId !== userId)) {
    throw new Error("Unauthorized");
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: "IN_CONVERSATION" }
  });

  revalidatePath(`/directory/chat/${conversationId}`);
}

export async function getMyDirectory() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const listings = await prisma.directoryListing.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { conversations: true }
      }
    }
  });

  const activeConversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { initiatedById: userId },
        { ownerId: userId }
      ],
      NOT: { status: "COMPLETED" }
    },
    include: {
      listing: { select: { name: true } },
      marketplaceListing: { select: { title: true } },
      communityProperty: { select: { name: true } },
      initiatedBy: { select: { name: true } },
      owner: { select: { name: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return { listings, activeConversations };
}
