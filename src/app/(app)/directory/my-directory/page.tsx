import { getMyDirectory } from "@/lib/actions/directory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { MessageCircle } from "lucide-react";

export const metadata = {
  title: "My Directory | KSIJ Reload",
};

export default async function MyDirectoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const { listings, activeConversations } = await getMyDirectory();

  return (
    <div className={styles.container}>
      
      <div className="animateFadeUp">
        <h1 className={styles.title}>My Directory</h1>
        <p className={styles.subtitle}>Manage your listings and active conversations.</p>
      </div>

      <div className={styles.grid}>
        
        {/* Listings Column */}
        <div className="animateFadeUp delay-100">
          <h2 className={styles.sectionTitle}>My Listings</h2>
          
          {listings.length > 0 ? (
            <div className={styles.list}>
              {listings.map(listing => (
                <Link href={`/directory/${listing.id}`} key={listing.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardMeta}>{listing.listingType} &middot; {listing.category}</span>
                    <span className={styles.cardStatus}>{listing.status}</span>
                  </div>
                  <div className={styles.cardTitle}>{listing.name}</div>
                  <div className={styles.cardStat}>
                    <MessageCircle size={14} /> 
                    {listing._count.conversations} {listing._count.conversations === 1 ? 'conversation' : 'conversations'}
                  </div>
                </Link>
              ))}
              
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Link href="/directory/list-yourself" className={styles.actionBtn}>+ Add Another Listing</Link>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyText}>You haven't created any listings yet.</div>
              <Link href="/directory/list-yourself" className={styles.actionBtn}>List Yourself</Link>
            </div>
          )}
        </div>

        {/* Conversations Column */}
        <div className="animateFadeUp delay-200">
          <h2 className={styles.sectionTitle}>Active Conversations</h2>
          
          {activeConversations.length > 0 ? (
            <div className={styles.list}>
              {activeConversations.map(conv => {
                const isOwner = conv.ownerId === userId;
                const otherParty = isOwner ? conv.initiatedBy.name : conv.listing?.name || "Unknown Listing";
                
                return (
                  <Link href={`/directory/chat/${conv.id}`} key={conv.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardMeta}>{isOwner ? "Inquiry Received" : "Inquiry Sent"}</span>
                      {conv.status === 'NEW' && (
                        <span style={{ fontSize: '0.75rem', color: 'red', fontWeight: 700 }}>NEW</span>
                      )}
                    </div>
                    <div className={styles.cardTitle}>{otherParty}</div>
                    <div className={styles.cardStat} style={{ color: conv.status === 'CONTACT_SHARED' ? 'var(--color-primary)' : 'inherit' }}>
                      Status: {conv.status.replace('_', ' ')}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyText}>No active conversations right now.</div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
