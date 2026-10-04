import { getConversation } from "@/lib/actions/directory";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import styles from "./page.module.css";
import ChatInterface from "./ChatInterface";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Conversation | KSIJ One Directory",
};

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }
  
  const userId = (session.user as any).id;
  
  let conversation;
  try {
    conversation = await getConversation(p.id);
  } catch (error) {
    notFound();
  }

  const isOwner = conversation.ownerId === userId;
  
  let entityName = "Unknown";
  let entityLink = "#";
  let otherUser = conversation.initiatedBy; // default to initiator
  
  if (conversation.listing) {
    entityName = conversation.listing.name;
    entityLink = `/directory/${conversation.listingId}`;
    if (isOwner) otherUser = conversation.initiatedBy;
    else otherUser = conversation.listing.owner;
  } else if (conversation.marketplaceListing) {
    entityName = conversation.marketplaceListing.title;
    entityLink = `/marketplace/member-marketplace/${conversation.marketplaceListingId}`;
    if (isOwner) otherUser = conversation.initiatedBy;
    else otherUser = conversation.marketplaceListing.seller;
  } else if (conversation.communityProperty) {
    entityName = conversation.communityProperty.name;
    entityLink = `/marketplace/community-properties/${conversation.communityPropertyId}`;
    if (isOwner) otherUser = conversation.initiatedBy;
    else otherUser = conversation.communityProperty.managedBy;
  }

  if (!otherUser) {
    notFound();
  }

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <Link href="/notifications" style={{ color: 'var(--color-text-secondary)', marginRight: '8px' }}>
            <ArrowLeft size={24} />
          </Link>
          <div className={styles.avatar}>
            {otherUser?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div className={styles.listingName}>
              {isOwner ? otherUser?.name : entityName}
            </div>
            <div className={styles.status}>
              <div className={styles.statusIndicator} style={{ 
                backgroundColor: conversation.status === 'COMPLETED' ? 'var(--color-text-muted)' : 'var(--color-primary)' 
              }} />
              {conversation.status === 'COMPLETED' ? 'Completed' : 'Active conversation'}
            </div>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <Link href={entityLink} style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
            View Reference
          </Link>
        </div>
      </div>

      <ChatInterface conversation={conversation} currentUserId={userId} entityName={entityName} />

    </div>
  );
}
