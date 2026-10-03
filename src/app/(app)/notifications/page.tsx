import styles from "./page.module.css";
import { Bell, MessageCircle } from "lucide-react";
import { getMyDirectory } from "@/lib/actions/directory";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function NotificationsPage() {
  let activeConversations: any[] = [];
  let userId = "";
  try {
    const session = await getServerSession(authOptions);
    userId = (session?.user as any)?.id || "";
    
    const data = await getMyDirectory();
    // Only show notifications for conversations where we are the OWNER and it's a NEW inquiry
    // or if we want to show all active chats, we should format the text correctly based on role.
    activeConversations = data.activeConversations;
  } catch (e) {}

  return (
    <div className={styles.container}>
      <h1 className="h2 mb-24">Notifications</h1>
      
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.activeTab}`}>All</button>
        <button className={styles.tab}>Important</button>
        <button className={styles.tab}>Events</button>
        <button className={styles.tab}>Services</button>
      </div>

      <div className={styles.notificationList}>
        {activeConversations.filter(c => c.ownerId === userId && c.status === 'NEW').map(conv => {
          const entityName = conv.listing?.name || conv.marketplaceListing?.title || conv.communityProperty?.name || "a listing";
          return (
            <Link href={`/directory/chat/${conv.id}`} key={conv.id} style={{textDecoration: 'none', color: 'inherit'}}>
              <div className={`${styles.notificationCard} ${styles.unread}`}>
                <div className={styles.iconWrapper} style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  <MessageCircle size={20} />
                </div>
                <div className={styles.content}>
                  <h4 className="h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>
                    New Inquiry from {conv.initiatedBy?.name || "Someone"}
                  </h4>
                  <p className="small-text">You have a new inquiry regarding your listing: {entityName}</p>
                  <span className={styles.time}>Just now</span>
                </div>
                <div className={styles.unreadDot}></div>
              </div>
            </Link>
          );
        })}

        {/* Sample Notification 1 */}
        <div className={`${styles.notificationCard} ${styles.unread}`}>
          <div className={styles.iconWrapper}>
            <Bell size={20} className="text-primary" />
          </div>
          <div className={styles.content}>
            <h4 className="h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>New community announcement</h4>
            <p className="small-text">Annual membership renewal is now open. Please update your details.</p>
            <span className={styles.time}>2 hours ago</span>
          </div>
          <div className={styles.unreadDot}></div>
        </div>

        {/* Sample Notification 2 */}
        <div className={styles.notificationCard}>
          <div className={styles.iconWrapper}>
            <Bell size={20} className="text-primary" />
          </div>
          <div className={styles.content}>
            <h4 className="h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>Upcoming event reminder</h4>
            <p className="small-text">Community Townhall is happening tomorrow at 8:00 PM.</p>
            <span className={styles.time}>Yesterday</span>
          </div>
        </div>

        {/* Sample Notification 3 */}
        <div className={styles.notificationCard}>
          <div className={styles.iconWrapper}>
            <Bell size={20} className="text-primary" />
          </div>
          <div className={styles.content}>
            <h4 className="h3" style={{ fontSize: '1rem', marginBottom: '4px' }}>Service update</h4>
            <p className="small-text">Higher Education Scholarship applications are now open.</p>
            <span className={styles.time}>2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
