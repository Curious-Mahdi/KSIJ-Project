"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import styles from "../../admin.module.css";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions/announcements";

interface AnnouncementFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    category: string;
    isImportant: boolean;
    isPublished: boolean;
    linkUrl?: string | null;
  };
  isEdit?: boolean;
}

const CATEGORIES = ["General", "Urgent", "Education", "Health", "Religious", "Youth", "Welfare"];

export default function AnnouncementForm({ initialData, isEdit }: AnnouncementFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || "General",
    isImportant: initialData?.isImportant || false,
    isPublished: initialData?.isPublished !== undefined ? initialData.isPublished : true,
    linkUrl: initialData?.linkUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEdit && initialData?.id) {
        await updateAnnouncement(initialData.id, formData);
      } else {
        await createAnnouncement(formData);
      }
      router.push("/admin/announcements");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save announcement");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className={styles.pageHeaderRow}>
        <div>
          <Link
            href="/admin/announcements"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--color-primary)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              marginBottom: "8px",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> Back to Announcements
          </Link>
          <h1 className={styles.dashboardTitle}>
            {isEdit ? "Edit Announcement" : "Create Announcement"}
          </h1>
          <p className={styles.dashboardSubtitle}>
            Broadcast important updates, scheme deadlines, or community notices.
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            marginBottom: "20px",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGrid}>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>
              Announcement Title <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              placeholder="e.g. Higher Education Scholarship 2024 Deadline"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <select
              className={styles.formSelectField}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Related Link URL (Optional)</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. /services or https://..."
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>
              Announcement Content / Message <span className={styles.formLabelRequired}>*</span>
            </label>
            <textarea
              required
              rows={5}
              className={styles.formTextarea}
              placeholder="Detailed announcement text..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formSwitchGroup}>
              <input
                type="checkbox"
                checked={formData.isImportant}
                onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }}
              />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-main)" }}>
                Mark as High Priority / Urgent Notice
              </span>
            </label>
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formSwitchGroup}>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }}
              />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-main)" }}>
                Publish Immediately to Public Website
              </span>
            </label>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/announcements" className={styles.secondaryBtn}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? "Update Announcement" : "Post Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
