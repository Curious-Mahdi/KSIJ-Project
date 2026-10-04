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
  Filter,
} from "lucide-react";
import styles from "../../admin.module.css";
import { toggleServiceStatus, deleteService } from "@/lib/actions/services";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  eligibility: string | null;
  requiredDocuments: string | null;
  contactInfo: string | null;
  isActive: boolean;
  createdAt: Date | string;
}

export default function ServiceTable({ initialServices }: { initialServices: ServiceItem[] }) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const categories = Array.from(new Set(initialServices.map((s) => s.category)));

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "ALL" || s.category === categoryFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && s.isActive) ||
      (statusFilter === "INACTIVE" && !s.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggle = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      await toggleServiceStatus(id, !current);
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !current } : s))
      );
      router.refresh();
    } catch (err: any) {
      alert("Failed to toggle status: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    setBusyId(id);
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Failed to delete service: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Top Action Row */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.dashboardTitle}>Community Services</h1>
          <p className={styles.dashboardSubtitle}>
            Manage community schemes, eligibility requirements, and guidelines.
          </p>
        </div>
        <div className={styles.pageHeaderActions}>
          <Link href="/admin/services/new" className={styles.primaryBtn}>
            <Plus size={16} /> Add Service
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search by title, description or category..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap" }}>
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

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Date Added</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      No services found matching your criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--color-text-main)" }}>
                        {service.title}
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
                        {service.description}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeInfo}`}>
                        {service.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                        {service.contactInfo || "—"}
                      </span>
                    </td>
                    <td>
                      {service.isActive ? (
                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                          <CheckCircle size={11} /> Active
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeMuted}`}>
                          <XCircle size={11} /> Inactive
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {new Date(service.createdAt).toLocaleDateString("en-IN", {
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
                          onClick={() => handleToggle(service.id, service.isActive)}
                          disabled={busyId === service.id}
                          title={service.isActive ? "Hide from public" : "Publish to public"}
                        >
                          {service.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className={styles.iconActionBtn}
                          title="Edit Service"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          className={`${styles.iconActionBtn} ${styles.iconActionBtnDanger}`}
                          onClick={() => handleDelete(service.id, service.title)}
                          disabled={busyId === service.id}
                          title="Delete Service"
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
