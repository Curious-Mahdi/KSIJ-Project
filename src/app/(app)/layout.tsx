"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Grid, Users, Store, Calendar, MoreHorizontal, Bell, Briefcase } from "lucide-react";
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
        <Link href="/home" className={styles.logo}>KSIJ One</Link>

        {/* Mobile Title */}
        <span className={styles.mobileTitle}>KSIJ One</span>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {['home', 'services', 'directory', 'opportunities', 'venues', 'events'].map((route) => {
            const isActive = pathname.startsWith(`/${route}`);
            return (
              <Link key={route} href={`/${route}`} className={styles.navLink}>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className={styles.activeIndicator}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1, textTransform: 'capitalize' }}>{route}</span>
              </Link>
            );
          })}
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

      {/* Main Content with Page Transitions */}
      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
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
        <Link href="/directory" className={`${styles.bottomNavItem} ${pathname.startsWith('/directory') ? styles.bottomNavActive : ''}`}>
          <Users size={24} />
          <span>Directory</span>
        </Link>
        <Link href="/opportunities" className={`${styles.bottomNavItem} ${pathname.startsWith('/opportunities') ? styles.bottomNavActive : ''}`}>
          <Briefcase size={24} />
          <span>Opportunities</span>
        </Link>
        <Link href="/venues" className={`${styles.bottomNavItem} ${pathname.startsWith('/venues') ? styles.bottomNavActive : ''}`}>
          <Store size={24} />
          <span>Venues</span>
        </Link>
        <Link href="/more" className={`${styles.bottomNavItem} ${pathname === '/more' ? styles.bottomNavActive : ''}`}>
          <MoreHorizontal size={24} />
          <span>More</span>
        </Link>
      </nav>
    </div>
  );
}
