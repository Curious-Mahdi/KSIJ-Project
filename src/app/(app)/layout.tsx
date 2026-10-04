"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Grid, Users, Store, MoreHorizontal, Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import styles from "./layout.module.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const isProtectedRoute = pathname.startsWith("/profile") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/directory/list-yourself") ||
    pathname.startsWith("/directory/my-directory");

  useEffect(() => {
    if (isProtectedRoute && status === "unauthenticated") {
      router.push("/login");
    }
  }, [isProtectedRoute, status, router]);

  // Periodic refresh for authenticated active sessions (notifications, chats)
  useEffect(() => {
    if (status === "authenticated") {
      const interval = setInterval(() => {
        router.refresh();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [status, router]);


  if (isProtectedRoute && (status === "loading" || status === "unauthenticated")) {
    return null;
  }

  const user = session?.user;
  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";
  const isAdmin = (user as any)?.role === "ADMIN" || (user as any)?.isAdmin === true;

  const navRoutes = ['home', 'services', 'directory', 'marketplace', 'events', 'facilities'];

  return (
    <div className={styles.appLayout}>
      {/* Top Header */}
      <header className={styles.header}>
        {/* Desktop Logo */}
        <Link href="/home" className={styles.logo}>KSIJ One</Link>

        {/* Mobile Title */}
        <span className={styles.mobileTitle}>KSIJ One</span>

        {/* Desktop Navigation with Animated Tab Indicators */}
        <nav className={styles.desktopNav}>
          {['home', 'services', 'directory', 'venues', 'events'].map((route) => {
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
    })
  }
          {isAdmin && (
            <Link href="/admin" className={styles.navLink} style={{ color: "#d97706", fontWeight: 600 }}>
              <span style={{ position: 'relative', zIndex: 1 }}>👑 Admin</span>
            </Link>
          )}
        </nav >

    {/* Header Actions */ }
    < div className = { styles.headerActions } >
    {
      user?(
            <>
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
            </>
          ) : (
    <Link
      href="/login"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: "8px",
        backgroundColor: "#18181b",
        color: "#ffffff",
        fontSize: "0.8125rem",
        fontWeight: 500,
        textDecoration: "none"
      }}
    >
      Sign In
    </Link>
  )
}
        </div >
      </header >

  {/* Main Content with Page Transitions */ }
  < main className = { styles.mainContent } >
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
      </main >

  {/* Mobile Bottom Navigation */ }
  < nav className = { styles.bottomNav } >
        <Link href="/home" className={`${styles.bottomNavItem} ${pathname === '/home' ? styles.bottomNavActive : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link href="/services" className={`${styles.bottomNavItem} ${pathname.startsWith('/services') ? styles.bottomNavActive : ''}`}>
          <Grid size={24} />
          <span>Services</span>
        </Link>
        <Link href="/directory" className={`${styles.bottomNavItem} ${pathname.startsWith('/directory') ? styles.bottomNavActive : ''}`}>
          <Users size={24} />
          <span>Directory</span>
        </Link>
        <Link href="/venues" className={`${styles.bottomNavItem} ${pathname.startsWith('/venues') ? styles.bottomNavActive : ''}`}>
          <Store size={24} />
          <span>Venues</span>
        </Link>
        <Link href="/more" className={`${styles.bottomNavItem} ${pathname === '/more' ? styles.bottomNavActive : ''}`}>
          <MoreHorizontal size={24} />
          <span>More</span>
        </Link>
      </nav >

  {/* Site-wide Community Assistant Widget */ }
  < ChatWidget pathname = { pathname } />
    </div >
  );
}
