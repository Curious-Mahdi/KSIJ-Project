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
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import styles from "../../admin.module.css";
import { toggleAnnouncementPublish, deleteAnnouncement } from "@/lib/actions/announcements";

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  isImportant: boolean;
  isPublished: boolean;
  linkUrl?: string | null;
  publishedAt: Date | string;
}

export default function AnnouncementTable({
  initialAnnouncements,
}: {
  initialAnnouncements: AnnouncementItem[];
}) {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      await toggleAnnouncementPublish(id, !current);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isPublished: !current } : a))
      );
      router.refresh();
    } catch (err: any) {
      alert("Failed to toggle publish status: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setBusyId(id);
    try {
      await deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Failed to delete announcement: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.dashboardTitle}>Announcements &amp; Updates</h1>
          <p className={styles.dashboardSubtitle}>
            Broadcast official notices, scheme deadlines, and community news.
          </p>
        </div>
        <div className={styles.pageHeaderActions}>
          <Link href="/admin/announcements/new" className={styles.primaryBtn}>
            <Plus size={16} /> New Announcement
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search announcements by title or content..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Announcement</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date Posted</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      No announcements found.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((ann) => (
                  <tr key={ann.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 600, color: "var(--color-text-main)" }}>
                          {ann.title}
                        </span>
                        {ann.isImportant && (
                          <span
                            className={`${styles.badge} ${styles.badgeDanger}`}
                            title="Urgent / High Priority"
                          >
                            <AlertCircle size={10} /> Urgent
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text-muted)",
                          maxWidth: "380px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {ann.content}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeInfo}`}>
                        {ann.category}
                      </span>
                    </td>
                    <td>
                      {ann.isPublished ? (
                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                          <CheckCircle size={11} /> Published
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeMuted}`}>
                          <XCircle size={11} /> Draft / Hidden
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {new Date(ann.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          className={styles.iconActionBtn}
                          onClick={() => handleToggle(ann.id, ann.isPublished)}
                          disabled={busyId === ann.id}
                          title={ann.isPublished ? "Unpublish" : "Publish"}
                        >
                          {ann.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <Link
                          href={`/admin/announcements/${ann.id}/edit`}
                          className={styles.iconActionBtn}
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          className={`${styles.iconActionBtn} ${styles.iconActionBtnDanger}`}
                          onClick={() => handleDelete(ann.id, ann.title)}
                          disabled={busyId === ann.id}
                          title="Delete"
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
    </div>
  );
}
