"use client";

import styles from "./page.module.css";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
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
