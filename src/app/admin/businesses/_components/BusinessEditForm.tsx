"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import styles from "../../admin.module.css";
import { updateListingAdmin } from "@/lib/actions/admin-directory";

interface BusinessEditFormProps {
  listing: {
    id: string;
    name: string;
    shortDescription: string;
    description?: string | null;
    category: string;
    subcategory?: string | null;
    status: string;
    website?: string | null;
    location?: string | null;
  };
}

export default function BusinessEditForm({ listing }: BusinessEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: listing.name,
    shortDescription: listing.shortDescription,
    description: listing.description || "",
    category: listing.category,
    subcategory: listing.subcategory || "",
    status: listing.status,
    website: listing.website || "",
    location: listing.location || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await updateListingAdmin(listing.id, formData);
      router.push("/admin/businesses");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to update listing");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className={styles.pageHeaderRow}>
        <div>
          <Link
            href="/admin/businesses"
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
            <ArrowLeft size={14} /> Back to Directory Management
          </Link>
          <h1 className={styles.dashboardTitle}>Edit Business Listing</h1>
          <p className={styles.dashboardSubtitle}>
            Update listing details or change moderation status.
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
              Business / Listing Name <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <input
              type="text"
              required
              className={styles.formInput}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Moderation Status</label>
            <select
              className={styles.formSelectField}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="PUBLISHED">Published / Approved</option>
              <option value="PENDING">Pending Review</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
              <option value="PAUSED">Paused</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Website</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="https://..."
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Location</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Mumbai, Maharashtra"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>
              Short Description <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Full Description</label>
            <textarea
              rows={4}
              className={styles.formTextarea}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/businesses" className={styles.secondaryBtn}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
