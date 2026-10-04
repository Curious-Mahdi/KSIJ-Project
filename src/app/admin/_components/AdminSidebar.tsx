"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Grid3X3,
  Calendar,
  Building2,
  Landmark,
  Megaphone,
  Inbox,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import styles from "../admin.module.css";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  comingSoon?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Assistance Registry",
    href: "/admin/registry",
    icon: ShieldCheck,
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Grid3X3,
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    label: "Businesses",
    href: "/admin/businesses",
    icon: Building2,
  },
  {
    label: "Facilities",
    href: "/admin/facilities",
    icon: Landmark,
  },
  {
    label: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
  },
  {
    label: "Enquiries",
    href: "/admin/enquiries",
    icon: Inbox,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.sidebarLogo}>
        <span className={styles.sidebarLogoText}>KSIJ Reload</span>
        <span className={styles.sidebarLogoSub}>Admin Portal</span>
      </div>

      {/* Nav */}
      <nav className={styles.sidebarNav}>
        <div className={styles.sidebarSection}>
          <p className={styles.sidebarSectionLabel}>Management</p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`}
              >
                <item.icon size={16} className={styles.sidebarLinkIcon} />
                {item.label}
                {item.comingSoon && (
                  <span className={styles.sidebarLinkDot} title="Coming soon" />
                )}
              </Link>
            );
          })}
        </div>

        <div className={styles.sidebarSection}>
          <p className={styles.sidebarSectionLabel}>Site</p>
          <Link
            href="/home"
            className={styles.sidebarLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LayoutDashboard size={16} className={styles.sidebarLinkIcon} />
            View Public Site
          </Link>
        </div>
      </nav>

      <div className={styles.sidebarFooter}>
        <p className={styles.sidebarFooterText}>KSIJ Reload v1.0 · Admin</p>
      </div>
    </aside>
  );
}
