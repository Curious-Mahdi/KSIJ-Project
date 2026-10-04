"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Users,
  MapPin,
  Calendar,
  Clock,
  Check,
  X,
  Building,
} from "lucide-react";
import styles from "../../admin.module.css";
import {
  toggleFacilityAvailability,
  deleteFacility,
  updateBookingStatus,
} from "@/lib/actions/facilities";

interface FacilityItem {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  amenities: string | null;
  isAvailable: boolean;
  contactInfo: string | null;
  createdAt: Date | string;
  bookings: BookingItem[];
}

interface BookingItem {
  id: string;
  facilityId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  eventDate: Date | string;
  timeSlot: string;
  purpose: string;
  status: string;
  notes: string | null;
  createdAt: Date | string;
  facility?: { name: string; location: string };
}

export default function FacilityTable({
  initialFacilities,
  allBookings,
}: {
  initialFacilities: FacilityItem[];
  allBookings: BookingItem[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"facilities" | "bookings">("facilities");
  const [facilities, setServices] = useState<FacilityItem[]>(initialFacilities);
  const [bookings, setBookings] = useState<BookingItem[]>(allBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const pendingBookingsCount = bookings.filter((b) => b.status === "PENDING").length;

  const filteredFacilities = facilities.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.facility?.name && b.facility.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = bookingStatusFilter === "ALL" || b.status === bookingStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleToggle = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      await toggleFacilityAvailability(id, !current);
      setServices((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isAvailable: !current } : f))
      );
      router.refresh();
    } catch (err: any) {
      alert("Failed to update availability: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setBusyId(id);
    try {
      await deleteFacility(id);
      setServices((prev) => prev.filter((f) => f.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Failed to delete facility: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleBookingAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setBusyId(id);
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      router.refresh();
    } catch (err: any) {
      alert("Failed to update booking status: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.dashboardTitle}>Facilities &amp; Hall Bookings</h1>
          <p className={styles.dashboardSubtitle}>
            Manage community venues, capacity, rules, and review reservation requests.
          </p>
        </div>
        <div className={styles.pageHeaderActions}>
          <Link href="/admin/facilities/new" className={styles.primaryBtn}>
            <Plus size={16} /> Add Facility
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => {
            setActiveTab("facilities");
            setSearchTerm("");
          }}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "1px solid",
            borderColor: activeTab === "facilities" ? "var(--color-primary)" : "var(--color-border)",
            backgroundColor: activeTab === "facilities" ? "var(--color-primary)" : "var(--color-surface)",
            color: activeTab === "facilities" ? "#FFFFFF" : "var(--color-text-secondary)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Venues &amp; Spaces ({facilities.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("bookings");
            setSearchTerm("");
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "1px solid",
            borderColor: activeTab === "bookings" ? "var(--color-primary)" : "var(--color-border)",
            backgroundColor: activeTab === "bookings" ? "var(--color-primary)" : "var(--color-surface)",
            color: activeTab === "bookings" ? "#FFFFFF" : "var(--color-text-secondary)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Booking Requests ({bookings.length})
          {pendingBookingsCount > 0 && (
            <span
              style={{
                backgroundColor: activeTab === "bookings" ? "#FFFFFF" : "#D97706",
                color: activeTab === "bookings" ? "var(--color-primary)" : "#FFFFFF",
                fontSize: "0.6875rem",
                fontWeight: 700,
                padding: "1px 7px",
                borderRadius: "9999px",
              }}
            >
              {pendingBookingsCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder={
              activeTab === "facilities"
                ? "Search venues by name or location..."
                : "Search bookings by name, email or purpose..."
            }
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === "bookings" && (
          <select
            className={styles.filterSelect}
            value={bookingStatusFilter}
            onChange={(e) => setBookingStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        )}
      </div>

      {/* Tab 1: Facilities List */}
      {activeTab === "facilities" && (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Facility / Venue</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Upcoming Bookings</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                        No facilities found matching your search.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredFacilities.map((facility) => (
                    <tr key={facility.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--color-text-main)" }}>
                          {facility.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--color-text-muted)",
                            maxWidth: "320px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {facility.description}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                          {facility.location}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                          {facility.capacity} guests
                        </span>
                      </td>
                      <td>
                        {facility.isAvailable ? (
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            <CheckCircle size={11} /> Available
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeMuted}`}>
                            <XCircle size={11} /> Unavailable
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                          {facility.bookings.filter((b) => b.status === "APPROVED").length} confirmed
                        </span>
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <button
                            className={styles.iconActionBtn}
                            onClick={() => handleToggle(facility.id, facility.isAvailable)}
                            disabled={busyId === facility.id}
                            title={facility.isAvailable ? "Mark Unavailable" : "Mark Available"}
                          >
                            {facility.isAvailable ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <Link
                            href={`/admin/facilities/${facility.id}/edit`}
                            className={styles.iconActionBtn}
                            title="Edit Facility"
                          >
                            <Edit2 size={15} />
                          </Link>
                          <button
                            className={`${styles.iconActionBtn} ${styles.iconActionBtnDanger}`}
                            onClick={() => handleDelete(facility.id, facility.name)}
                            disabled={busyId === facility.id}
                            title="Delete Facility"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bookings List */}
      {activeTab === "bookings" && (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Venue</th>
                  <th>Date &amp; Time Slot</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Moderation</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                        No booking requests found matching your filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const dateObj = new Date(b.eventDate);
                    return (
                      <tr key={b.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--color-text-main)" }}>
                            {b.userName}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                            {b.userEmail} · {b.userPhone}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: "0.8125rem" }}>
                            {b.facility?.name || "Community Venue"}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                            {b.facility?.location}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                            {dateObj.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                            {b.timeSlot}
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              fontSize: "0.8125rem",
                              color: "var(--color-text-main)",
                              maxWidth: "240px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={b.purpose}
                          >
                            {b.purpose}
                          </div>
                        </td>
                        <td>
                          {b.status === "APPROVED" ? (
                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                              <CheckCircle size={11} /> Approved
                            </span>
                          ) : b.status === "REJECTED" ? (
                            <span className={`${styles.badge} ${styles.badgeDanger}`}>
                              <XCircle size={11} /> Rejected
                            </span>
                          ) : (
                            <span className={`${styles.badge} ${styles.badgeWarning}`}>
                              Pending Review
                            </span>
                          )}
                        </td>
                        <td>
                          <div className={styles.tableActions}>
                            {b.status !== "APPROVED" && (
                              <button
                                className={styles.iconActionBtn}
                                style={{ color: "var(--color-primary)" }}
                                onClick={() => handleBookingAction(b.id, "APPROVED")}
                                disabled={busyId === b.id}
                                title="Approve Booking"
                              >
                                <Check size={15} />
                              </button>
                            )}
                            {b.status !== "REJECTED" && (
                              <button
                                className={`${styles.iconActionBtn} ${styles.iconActionBtnDanger}`}
                                onClick={() => handleBookingAction(b.id, "REJECTED")}
                                disabled={busyId === b.id}
                                title="Reject Booking"
                              >
                                <X size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
