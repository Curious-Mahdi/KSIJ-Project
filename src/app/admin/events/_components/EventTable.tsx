"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Star,
  ExternalLink,
} from "lucide-react";
import styles from "../../admin.module.css";
import { deleteEvent, updateEvent } from "@/lib/actions/events";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  time: string;
  location: string;
  imageUrl?: string | null;
  registrationUrl?: string | null;
  isImportant: boolean;
  status: string;
  createdAt: Date | string;
}

export default function EventTable({ initialEvents }: { initialEvents: EventItem[] }) {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || ev.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setBusyId(id);
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Failed to delete event: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setBusyId(id);
    try {
      await updateEvent(id, { status: newStatus });
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      router.refresh();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Upcoming</span>;
      case "ONGOING":
        return <span className={`${styles.badge} ${styles.badgeWarning}`}>Ongoing</span>;
      case "COMPLETED":
        return <span className={`${styles.badge} ${styles.badgeMuted}`}>Completed</span>;
      case "CANCELLED":
        return <span className={`${styles.badge} ${styles.badgeDanger}`}>Cancelled</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgeInfo}`}>{status}</span>;
    }
  };

  return (
    <div>
      {/* Top Action Row */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.dashboardTitle}>Community Events</h1>
          <p className={styles.dashboardSubtitle}>
            Schedule, manage, and publish community programs and sessions.
          </p>
        </div>
        <div className={styles.pageHeaderActions}>
          <Link href="/admin/events/new" className={styles.primaryBtn}>
            <Plus size={16} /> Create Event
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search by title, location or keywords..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Events Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date &amp; Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Registration</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      No events found matching your criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((event) => {
                  const evDate = new Date(event.date);
                  const formattedDate = !isNaN(evDate.getTime())
                    ? evDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date TBA";

                  return (
                    <tr key={event.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {event.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              onError={(e) => {
                                // Fallback: hide broken image without throwing or crashing
                                e.currentTarget.style.display = "none";
                              }}
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "6px",
                                objectFit: "cover",
                                border: "1px solid var(--color-border)",
                                flexShrink: 0,
                                backgroundColor: "#f3f4f6",
                              }}
                            />
                          ) : null}
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontWeight: 600, color: "var(--color-text-main)" }}>
                                {event.title}
                              </span>
                              {event.isImportant && (
                                <span
                                  className={`${styles.badge} ${styles.badgeWarning}`}
                                  title="Featured Event"
                                >
                                  <Star size={10} /> Featured
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--color-text-muted)",
                                maxWidth: "340px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {event.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                          {formattedDate}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          {event.time}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                          {event.location}
                        </div>
                      </td>
                      <td>
                        <select
                          value={event.status}
                          onChange={(e) => handleStatusChange(event.id, e.target.value)}
                          disabled={busyId === event.id}
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border)",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <option value="UPCOMING">Upcoming</option>
                          <option value="ONGOING">Ongoing</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        {event.registrationUrl ? (
                          <a
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "0.75rem",
                              color: "var(--color-primary)",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >
                            RSVP Link <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                            Open Access
                          </span>
                        )}
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className={styles.iconActionBtn}
                            title="Edit Event"
                          >
                            <Edit2 size={15} />
                          </Link>
                          <button
                            className={`${styles.iconActionBtn} ${styles.iconActionBtnDanger}`}
                            onClick={() => handleDelete(event.id, event.title)}
                            disabled={busyId === event.id}
                            title="Delete Event"
                          >
                            <Trash2 size={15} />
                          </button>
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
    </div>
  );
}
