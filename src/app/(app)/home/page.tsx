"use client";

import Link from "next/link";
import { Search, Grid, Users, Calendar, Folder, BellRing } from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  const user = {
    name: "Ali"
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={`h2 ${styles.greeting}`}>Good morning, {user.name}</h1>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input 
            type="text" 
            placeholder="What are you looking for?" 
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.announcementCard}>
        <div className="flex-center gap-8 text-primary" style={{ justifyContent: 'flex-start' }}>
          <BellRing size={20} />
          <h3 className="h3">Important Community Update</h3>
        </div>
        <p className="body-text">
          Annual membership renewal is now open. Please update your details and complete the process by the end of the month.
        </p>
        <Link href="#" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
          Read More
        </Link>
      </div>

      <div className={styles.quickAccess}>
        <h2 className="h3">Quick Access</h2>
        <div className={styles.quickAccessGrid}>
          <Link href="/services" className={styles.quickAction}>
            <div className={styles.quickActionIcon}><Grid size={24} /></div>
            <span>Services</span>
          </Link>
          <Link href="/directory" className={styles.quickAction}>
            <div className={styles.quickActionIcon}><Users size={24} /></div>
            <span>Directory</span>
          </Link>
          <Link href="/events" className={styles.quickAction}>
            <div className={styles.quickActionIcon}><Calendar size={24} /></div>
            <span>Events</span>
          </Link>
          <Link href="/resources" className={styles.quickAction}>
            <div className={styles.quickActionIcon}><Folder size={24} /></div>
            <span>Resources</span>
          </Link>
        </div>
      </div>

      <h2 className="h3 sectionTitle">Community Updates</h2>
      <div className={styles.feed}>
        {/* Sample Post 1 */}
        <article className={styles.postCard}>
          <div className={styles.postHeader}>
            <div className={styles.postAvatar}>K</div>
            <div className={styles.postMeta}>
              <span className={styles.postAuthor}>KSIJ Education Board</span>
              <span className={styles.postTime}>2 hours ago</span>
            </div>
          </div>
          <h3 className={styles.postTitle}>Higher Education Scholarship 2024</h3>
          <p className={styles.postContent}>
            Applications are now open for the 2024 Higher Education Scholarship program. We encourage all eligible students to apply before the deadline. [Sample Content]
          </p>
          <Link href="#" className={styles.readMore}>Read More &rarr;</Link>
        </article>

        {/* Sample Post 2 */}
        <article className={styles.postCard}>
          <div className={styles.postHeader}>
            <div className={styles.postAvatar} style={{ backgroundColor: 'var(--color-info)' }}>M</div>
            <div className={styles.postMeta}>
              <span className={styles.postAuthor}>Medical Committee</span>
              <span className={styles.postTime}>Yesterday</span>
            </div>
          </div>
          <h3 className={styles.postTitle}>Upcoming Health Camp</h3>
          <p className={styles.postContent}>
            Join us for a free general health checkup camp this weekend at the main medical wing. Special consultations for optometry and dental care will be available. [Sample Content]
          </p>
          <Link href="#" className={styles.readMore}>Read More &rarr;</Link>
        </article>

        {/* Sample Post 3 */}
        <article className={styles.postCard}>
          <div className={styles.postHeader}>
            <div className={styles.postAvatar} style={{ backgroundColor: 'var(--color-warning)' }}>Y</div>
            <div className={styles.postMeta}>
              <span className={styles.postAuthor}>Youth Affairs</span>
              <span className={styles.postTime}>2 days ago</span>
            </div>
          </div>
          <h3 className={styles.postTitle}>Mentorship Registration Open</h3>
          <p className={styles.postContent}>
            Looking for career guidance? Register for our upcoming mentorship cycle to connect with established professionals in your field of interest. [Sample Content]
          </p>
          <Link href="#" className={styles.readMore}>Read More &rarr;</Link>
        </article>
      </div>

      <h2 className="h3 sectionTitle mt-32">Upcoming Events</h2>
      <div className={styles.eventsGrid}>
        <div className={styles.eventCard}>
          <div className="badge" style={{ alignSelf: 'flex-start' }}>Oct 15, 2024</div>
          <h3 className="h3">Community Townhall</h3>
          <div className="small-text mt-8">
            <p>8:00 PM</p>
            <p>Main Centre</p>
          </div>
          <Link href="#" className="btn btn-secondary mt-16">View Event</Link>
        </div>
        
        <div className={styles.eventCard}>
          <div className="badge" style={{ alignSelf: 'flex-start' }}>Oct 22, 2024</div>
          <h3 className="h3">Youth Career Seminar</h3>
          <div className="small-text mt-8">
            <p>10:00 AM</p>
            <p>Community Hall</p>
          </div>
          <Link href="#" className="btn btn-secondary mt-16">View Event</Link>
        </div>
      </div>
    </div>
  );
}
