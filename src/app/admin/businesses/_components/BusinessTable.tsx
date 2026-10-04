"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  ExternalLink,
  Building2,
  User,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import styles from "../../admin.module.css";
import { updateListingStatus, deleteListingAdmin } from "@/lib/actions/admin-directory";

interface BusinessListingItem {
  id: string;
  name: string;
  shortDescription: string;
  category: string;
  subcategory?: string | null;
  listingType: string;
  status: string;
  website?: string | null;
  location?: string | null;
  createdAt: Date | string;
  owner?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

export default function BusinessTable({
  initialListings,
}: {
  initialListings: BusinessListingItem[];
}) {
  const router = useRouter();
  const [listings, setListings] = useState<BusinessListingItem[]>(initialListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const categories = Array.from(new Set(initialListings.map((l) => l.category)));

  const filtered = listings.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.owner?.name && l.owner.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.owner?.email && l.owner.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || l.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = async (
    id: string,
    newStatus: "PUBLISHED" | "PENDING" | "REJECTED" | "ARCHIVED" | "PAUSED"
  ) => {
    setBusyId(id);
    try {
      await updateListingStatus(id, newStatus);
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
      router.refresh();
    } catch (err: any) {
      alert("Failed to update listing status: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    setBusyId(id);
    try {
      await deleteListingAdmin(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Failed to delete listing: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
            <CheckCircle size={11} /> Approved
          </span>
        );
      case "PENDING":
        return (
          <span className={`${styles.badge} ${styles.badgeWarning}`}>
            <ShieldAlert size={11} /> Pending Review
          </span>
        );
      case "REJECTED":
        return (
          <span className={`${styles.badge} ${styles.badgeDanger}`}>
            <XCircle size={11} /> Rejected
          </span>
        );
      default:
        return <span className={`${styles.badge} ${styles.badgeMuted}`}>{status}</span>;
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.dashboardTitle}>Business Directory Management</h1>
          <p className={styles.dashboardSubtitle}>
            Moderate, review, and approve community business and professional listings.
          </p>
        </div>
        <div className={styles.pageHeaderActions}>
          <Link
            href="/directory"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
          >
            <ExternalLink size={14} /> View Public Directory
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search by business name, owner, or email..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap" }}>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Approved / Published</option>
            <option value="PENDING">Pending Review</option>
            <option value="REJECTED">Rejected</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Business Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Listing / Business</th>
                <th>Category &amp; Type</th>
                <th>Submitted By</th>
                <th>Status</th>
                <th>Date Listed</th>
                <th style={{ textAlign: "right" }}>Moderation &amp; Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      No business listings found matching your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((biz) => (
                  <tr key={biz.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--color-text-main)" }}>
                        {biz.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text-muted)",
                          maxWidth: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {biz.shortDescription}
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>
                          {biz.category}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
                        {biz.listingType}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                        {biz.owner?.name || "Anonymous"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {biz.owner?.email || "—"}
                      </div>
                    </td>
                    <td>{getStatusBadge(biz.status)}</td>
                    <td>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {new Date(biz.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        {biz.status !== "PUBLISHED" && (
                          <button
                            className={styles.iconActionBtn}
                            style={{ color: "var(--color-primary)" }}
                            onClick={() => handleStatusChange(biz.id, "PUBLISHED")}
                            disabled={busyId === biz.id}
                            title="Approve / Publish"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        {biz.status !== "REJECTED" && (
                          <button
                            className={`${styles.iconActionBtn} ${styles.iconActionBtnDanger}`}
                            onClick={() => handleStatusChange(biz.id, "REJECTED")}
                            disabled={busyId === biz.id}
                            title="Reject Listing"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                        <Link
                          href={`/admin/businesses/${biz.id}/edit`}
                          className={styles.iconActionBtn}
                          title="Edit Listing"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          className={`${styles.iconActionBtn} ${styles.iconActionBtnDanger}`}
                          onClick={() => handleDelete(biz.id, biz.name)}
                          disabled={busyId === biz.id}
                          title="Delete Listing"
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
