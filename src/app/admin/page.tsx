import Link from "next/link";
import {
  Grid3X3,
  Calendar,
  Building2,
  Landmark,
  FileText,
  BookOpen,
  Megaphone,
  Inbox,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

// Fetch live counts from the database with individual fail-safes
async function getDashboardStats() {
  try {
    const [
      serviceCount,
      eventCount,
      businessCount,
      facilityCount,
      announcementCount,
      enquiryCount,
      pendingBookingCount,
      documentCount,
    ] = await Promise.all([
      prisma.service.count().catch(() => 0),
      prisma.event.count().catch(() => 0),
      prisma.directoryListing.count().catch(() => 0),
      prisma.facility.count().catch(() => 0),
      prisma.announcement.count().catch(() => 0),
      prisma.enquiry.count({ where: { status: "PENDING" } }).catch(() => 0),
      prisma.facilityBooking.count({ where: { status: "PENDING" } }).catch(() => 0),
      prisma.knowledgeDocument.count({ where: { status: "active" } }).catch(() => 0),
    ]);

    return {
      services: serviceCount,
      events: eventCount,
      businesses: businessCount,
      facilities: facilityCount,
      announcements: announcementCount,
      pendingEnquiries: enquiryCount,
      pendingBookings: pendingBookingCount,
      documents: documentCount,
    };
  } catch (err) {
    console.error("Dashboard stats query error:", err);
    return {
      services: 0,
      events: 0,
      businesses: 0,
      facilities: 0,
      announcements: 0,
      pendingEnquiries: 0,
      pendingBookings: 0,
      documents: 0,
    };
  }
}

const QUICK_ACTIONS = [
  {
    label: "Add Service",
    href: "/admin/services/new",
    icon: Grid3X3,
    description: "Create a community scheme",
  },
  {
    label: "Add Event",
    href: "/admin/events/new",
    icon: Calendar,
    description: "Schedule a program",
  },
  {
    label: "Add Facility",
    href: "/admin/facilities/new",
    icon: Landmark,
    description: "Register a venue",
  },
  {
    label: "Post Announcement",
    href: "/admin/announcements/new",
    icon: Megaphone,
    description: "Broadcast an update",
  },
  {
    label: "Moderate Businesses",
    href: "/admin/businesses",
    icon: Building2,
    description: "Review directory listings",
  },
  {
    label: "Help Desk Enquiries",
    href: "/admin/enquiries",
    icon: Inbox,
    description: "Review member queries",
  },
];

export const metadata = {
  title: "Dashboard | Admin | KSIJ Reload",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Page Header */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Administration Overview</h1>
        <p className={styles.dashboardSubtitle}>
          Complete central control for KSIJ community services, venues, programs, and member inquiries.
        </p>
        <p className={styles.dashboardDate}>{today}</p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={<Grid3X3 size={20} color="#0B5133" />}
          iconBg="#EEF6F1"
          value={stats.services}
          label="Active Services"
          meta="Schemes &amp; community support"
        />
        <StatCard
          icon={<Calendar size={20} color="#0284C7" />}
          iconBg="#E0F2FE"
          value={stats.events}
          label="Community Events"
          meta="Scheduled programs &amp; sessions"
        />
        <StatCard
          icon={<Building2 size={20} color="#D97706" />}
          iconBg="#FEF3C7"
          value={stats.businesses}
          label="Directory Listings"
          meta="Businesses &amp; professionals"
        />
        <StatCard
          icon={<Landmark size={20} color="#7C3AED" />}
          iconBg="#EDE9FE"
          value={stats.facilities}
          label="Venues &amp; Spaces"
          meta={`${stats.pendingBookings} pending booking requests`}
        />
        <StatCard
          icon={<Megaphone size={20} color="#059669" />}
          iconBg="#ECFDF5"
          value={stats.announcements}
          label="Announcements"
          meta="Broadcast updates &amp; notices"
        />
        <StatCard
          icon={<Inbox size={20} color="#DC2626" />}
          iconBg="#FEF2F2"
          value={stats.pendingEnquiries}
          label="Pending Enquiries"
          meta="Questions awaiting response"
        />
      </div>

      {/* Quick Actions */}
      <h2 className={styles.sectionTitle}>Quick Actions</h2>
      <div className={styles.quickActionsGrid}>
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={styles.quickActionBtn}
          >
            <span className={styles.quickActionBtnIcon}>
              <action.icon size={16} color="#0B5133" />
            </span>
            <div>
              <div style={{ fontWeight: 600 }}>{action.label}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                {action.description}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Info Panels */}
      <div className={styles.twoCol}>
        {/* Content Status */}
        <div className={styles.panelCard}>
          <p className={styles.panelCardTitle}>Platform System Status</p>
          <ContentStatusRow label="Community Services" count={stats.services} status="live" note="Live in DB · Synced with Chatbot" />
          <ContentStatusRow label="Events Management" count={stats.events} status="live" note="Live in DB · Public RSVP links" />
          <ContentStatusRow label="Business Directory" count={stats.businesses} status="live" note="User-submitted · Moderation active" />
          <ContentStatusRow label="Facilities & Halls" count={stats.facilities} status="live" note="Spaces & online reservation flow" />
          <ContentStatusRow label="Announcements" count={stats.announcements} status="live" note="Broadcast feed on website" />
          <ContentStatusRow label="Help Desk Enquiries" count={stats.pendingEnquiries} status="live" note="Member query resolution queue" />
        </div>

        {/* Integration Status */}
        <div className={styles.panelCard}>
          <p className={styles.panelCardTitle}>AI Chatbot &amp; Grounding</p>
          <div style={{ padding: "12px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
                }}
              />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-main)" }}>
                Real-Time RAG Grounding Active
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#4B5563", lineHeight: 1.6, marginBottom: "16px" }}>
              The community AI assistant queries live database content directly. Any changes made to Services, Events, Facilities, or Announcements in this admin portal are instantly reflected in chatbot responses with source citations.
            </p>
            <div
              style={{
                backgroundColor: "#F9FAFB",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "0.75rem",
                color: "#6B7280",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div>✔ No retraining or manual embeddings required</div>
              <div>✔ Grounded citations with direct public page links</div>
              <div>✔ Real-time synchronization across all devices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function StatCard({
  icon,
  iconBg,
  value,
  label,
  meta,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  label: string;
  meta: string;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statCardTop}>
        <div className={styles.statCardIcon} style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
      </div>
      <div>
        <div className={styles.statCardValue}>{value}</div>
        <div className={styles.statCardLabel}>{label}</div>
        <div className={styles.statCardMeta}>{meta}</div>
      </div>
    </div>
  );
}

function ContentStatusRow({
  label,
  count,
  status,
  note,
}: {
  label: string;
  count: number;
  status: "live" | "static";
  note: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "var(--space-16)",
        padding: "var(--space-10) 0",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div>
        <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-main)" }}>
          {label}
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
          {note}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8)", flexShrink: 0 }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-main)" }}>
          {count}
        </span>
        <span
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: "var(--radius-full)",
            backgroundColor: status === "live" ? "var(--color-surface-success)" : "var(--color-surface-alt)",
            color: status === "live" ? "var(--color-primary)" : "var(--color-text-secondary)",
            border: status === "live" ? "1px solid rgba(11,81,51,0.15)" : "1px solid var(--color-border)",
          }}
        >
          {status === "live" ? "Live" : "Static"}
        </span>
      </div>
    </div>
  );
}
