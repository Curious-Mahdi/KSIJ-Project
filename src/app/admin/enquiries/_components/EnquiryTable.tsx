"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  MessageSquare,
  Save,
  Loader2,
} from "lucide-react";
import styles from "../../admin.module.css";
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/actions/enquiries";

interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  category: string;
  status: string;
  adminNotes: string | null;
  createdAt: Date | string;
}

export default function EnquiryTable({ initialEnquiries }: { initialEnquiries: EnquiryItem[] }) {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = enquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (
    id: string,
    newStatus: "PENDING" | "IN_PROGRESS" | "RESOLVED",
    notes?: string
  ) => {
    setBusyId(id);
    try {
      await updateEnquiryStatus(id, newStatus, notes);
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: newStatus, ...(notes ? { adminNotes: notes } : {}) } : e
        )
      );
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({
          ...selectedEnquiry,
          status: newStatus,
          ...(notes ? { adminNotes: notes } : {}),
        });
      }
      router.refresh();
    } catch (err: any) {
      alert("Failed to update enquiry status: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string, subject: string) => {
    if (!confirm(`Delete enquiry "${subject}"?`)) return;

    setBusyId(id);
    try {
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      router.refresh();
    } catch (err: any) {
      alert("Failed to delete enquiry: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.dashboardTitle}>Community Enquiries &amp; Help Desk</h1>
          <p className={styles.dashboardSubtitle}>
            Review questions, assistance queries, and grievance tickets submitted by community members.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search enquiries by name, email, or message..."
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
          <option value="PENDING">Pending Review</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Subject &amp; Category</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      No enquiries found.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--color-text-main)" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {item.email} {item.phone ? `· ${item.phone}` : ""}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>
                          {item.category}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                          {item.subject}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text-muted)",
                          maxWidth: "360px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginTop: "2px",
                        }}
                      >
                        {item.message}
                      </div>
                    </td>
                    <td>
                      {item.status === "RESOLVED" ? (
                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                          <CheckCircle size={11} /> Resolved
                        </span>
                      ) : item.status === "IN_PROGRESS" ? (
                        <span className={`${styles.badge} ${styles.badgeWarning}`}>
                          <Clock size={11} /> In Progress
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeDanger}`}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
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
                          onClick={() => {
                            setSelectedEnquiry(item);
                            setAdminNotesInput(item.adminNotes || "");
                          }}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className={`${styles.iconActionBtn} ${styles.iconActionBtnDanger}`}
                          onClick={() => handleDelete(item.id, item.subject)}
                          disabled={busyId === item.id}
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

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "28px",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEnquiry(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span className={`${styles.badge} ${styles.badgeInfo}`}>
                {selectedEnquiry.category}
              </span>
              <span
                className={`${styles.badge} ${
                  selectedEnquiry.status === "RESOLVED"
                    ? styles.badgeSuccess
                    : selectedEnquiry.status === "IN_PROGRESS"
                    ? styles.badgeWarning
                    : styles.badgeDanger
                }`}
              >
                {selectedEnquiry.status}
              </span>
            </div>

            <h2 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#122019", marginBottom: "12px" }}>
              {selectedEnquiry.subject}
            </h2>

            <div
              style={{
                backgroundColor: "#F9FAFB",
                padding: "14px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "0.8125rem",
                color: "#374151",
              }}
            >
              <p>
                <strong>Applicant:</strong> {selectedEnquiry.name}
              </p>
              <p style={{ marginTop: "4px" }}>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${selectedEnquiry.email}`} style={{ color: "var(--color-primary)" }}>
                  {selectedEnquiry.email}
                </a>
              </p>
              {selectedEnquiry.phone && (
                <p style={{ marginTop: "4px" }}>
                  <strong>Phone:</strong> {selectedEnquiry.phone}
                </p>
              )}
              <p style={{ marginTop: "4px", color: "var(--color-text-muted)" }}>
                <strong>Date:</strong> {new Date(selectedEnquiry.createdAt).toLocaleString()}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#122019", marginBottom: "6px" }}>
                Message Content:
              </h4>
              <p style={{ fontSize: "0.9375rem", color: "#4B5563", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                {selectedEnquiry.message}
              </p>
            </div>

            {/* Admin Notes & Status Updating */}
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#122019" }}>
                Admin Resolution Notes
              </label>
              <textarea
                rows={3}
                placeholder="Add internal resolution notes, action taken, or response details..."
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  marginTop: "6px",
                  outline: "none",
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedEnquiry.id, "IN_PROGRESS", adminNotesInput)
                    }
                    className={styles.secondaryBtn}
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedEnquiry.id, "RESOLVED", adminNotesInput)
                    }
                    className={styles.primaryBtn}
                  >
                    Mark Resolved
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleStatusChange(
                      selectedEnquiry.id,
                      selectedEnquiry.status as any,
                      adminNotesInput
                    )
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-primary)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
