"use client";

import styles from "./page.module.css";
import { ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const user = {
    name: "Ali",
    email: "user@example.com",
    avatarInitial: "A"
  };

  return (
    <div className={styles.container}>
      <h1 className="h2 mb-24">Profile</h1>
      
      <div className={styles.headerCard}>
        <div className={styles.avatarLarge}>
          {user.avatarInitial}
        </div>
        <div className={styles.userInfo}>
          <h2 className="h2">{user.name}</h2>
          <p className="text-secondary">{user.email}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className="h3 mb-16">Personal Information</h3>
        <div className="card" style={{ padding: 0 }}>
          <div className={styles.listItem}>
            <span>Full Name</span>
            <span className="text-secondary">{user.name}</span>
          </div>
          <div className={styles.listItem}>
            <span>Email</span>
            <span className="text-secondary">{user.email}</span>
          </div>
          <div className={styles.listItem}>
            <span>Jamaat/Centre</span>
            <span className="text-secondary">Main Centre (Sample)</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className="h3 mb-16">My Activity</h3>
        <div className="card" style={{ padding: 0 }}>
          <button className={styles.actionItem}>
            <span>Event Registrations</span>
            <ChevronRight size={20} className="text-secondary" />
          </button>
          <button className={styles.actionItem}>
            <span>Service Applications</span>
            <ChevronRight size={20} className="text-secondary" />
          </button>
          <button className={styles.actionItem}>
            <span>Saved Items</span>
            <ChevronRight size={20} className="text-secondary" />
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className="h3 mb-16">Settings</h3>
        <div className="card" style={{ padding: 0 }}>
          <button className={styles.actionItem}>
            <span>Account Settings</span>
            <ChevronRight size={20} className="text-secondary" />
          </button>
          <button className={styles.actionItem}>
            <span>Notification Preferences</span>
            <ChevronRight size={20} className="text-secondary" />
          </button>
        </div>
      </div>

      <button className="btn btn-secondary w-full" style={{ marginTop: 'var(--space-24)' }}>
        Sign Out
      </button>
    </div>
  );
}
