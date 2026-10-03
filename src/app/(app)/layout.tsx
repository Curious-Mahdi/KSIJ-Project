"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Grid, Users, Calendar, MoreHorizontal, Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import styles from "./layout.module.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !session?.user?.jamaat) {
      router.push("/onboarding");
    }
  }, [status, session, router]);

  // Global polling to refresh Server Components (like Notifications and Chats)
  useEffect(() => {
    if (status === "authenticated") {
      const interval = setInterval(() => {
        router.refresh();
      }, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated" || (status === "authenticated" && !session?.user?.jamaat)) {
    return null; // or a loading spinner
  }

  const user = session?.user;
  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className={styles.appLayout}>
      {/* Top Header */}
      <header className={styles.header}>
        {/* Desktop Logo */}
        <Link href="/home" className={styles.logo}>KSIJ Reload</Link>

        {/* Mobile Title */}
        <span className={styles.mobileTitle}>KSIJ Reload</span>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link href="/home" className={`${styles.navLink} ${pathname === '/home' ? styles.navLinkActive : ''}`}>Home</Link>
          <Link href="/services" className={`${styles.navLink} ${pathname === '/services' ? styles.navLinkActive : ''}`}>Services</Link>
          <Link href="/directory" className={`${styles.navLink} ${pathname === '/directory' ? styles.navLinkActive : ''}`}>Directory</Link>
          <Link href="/events" className={`${styles.navLink} ${pathname === '/events' ? styles.navLinkActive : ''}`}>Events</Link>
        </nav>

        {/* Header Actions */}
        <div className={styles.headerActions}>
          <Link href="/notifications" className={styles.iconBtn}>
            <Bell size={20} />
            <span className={styles.badge}></span>
          </Link>
          <div className="flex-center gap-8">
            <Link href="/profile" className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}>
              {user?.image ? (
                <img src={user.image} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                avatarInitial
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <Link href="/home" className={`${styles.bottomNavItem} ${pathname === '/home' ? styles.bottomNavActive : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link href="/services" className={`${styles.bottomNavItem} ${pathname === '/services' ? styles.bottomNavActive : ''}`}>
          <Grid size={24} />
          <span>Services</span>
        </Link>
        <Link href="/directory" className={`${styles.bottomNavItem} ${pathname === '/directory' ? styles.bottomNavActive : ''}`}>
          <Users size={24} />
          <span>Directory</span>
        </Link>
        <Link href="/events" className={`${styles.bottomNavItem} ${pathname === '/events' ? styles.bottomNavActive : ''}`}>
          <Calendar size={24} />
          <span>Events</span>
        </Link>
        <Link href="/more" className={`${styles.bottomNavItem} ${pathname === '/more' ? styles.bottomNavActive : ''}`}>
          <MoreHorizontal size={24} />
          <span>More</span>
        </Link>
      </nav>
    </div>
  );
}
