"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import styles from "../../admin.module.css";
import { createService, updateService } from "@/lib/actions/services";

interface ServiceFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    category: string;
    eligibility?: string | null;
    requiredDocuments?: string | null;
    process?: string | null;
    contactInfo?: string | null;
    faqs?: string | null;
    isActive: boolean;
  };
  isEdit?: boolean;
}

const CATEGORIES = [
  "Education",
  "Health",
  "Housing",
  "Welfare",
  "Employment",
  "Legal",
  "General",
  "Financial",
];

export default function ServiceForm({ initialData, isEdit }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "General",
    eligibility: initialData?.eligibility || "",
    requiredDocuments: initialData?.requiredDocuments || "",
    process: initialData?.process || "",
    contactInfo: initialData?.contactInfo || "",
    faqs: initialData?.faqs || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEdit && initialData?.id) {
        await updateService(initialData.id, formData);
      } else {
        await createService(formData);
      }
      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save service");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className={styles.pageHeaderRow}>
        <div>
          <Link
            href="/admin/services"
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
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <h1 className={styles.dashboardTitle}>
            {isEdit ? "Edit Service" : "Add New Service"}
          </h1>
          <p className={styles.dashboardSubtitle}>
            {isEdit
              ? "Update service details and community guidelines."
              : "Create a new community service scheme or program."}
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
              Service Title <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              placeholder="e.g. Higher Education Support Scheme"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Category <span className={styles.formLabelRequired}>*</span>
            </label>
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
            <label className={styles.formLabel}>Contact Information</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. education@ksij.org | +91 98200 12345"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>
              Description <span className={styles.formLabelRequired}>*</span>
            </label>
            <textarea
              required
              rows={3}
              className={styles.formTextarea}
              placeholder="Summary of what this service offers and whom it benefits..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Eligibility Criteria</label>
            <textarea
              rows={3}
              className={styles.formTextarea}
              placeholder="Who is eligible to apply? (e.g. Income thresholds, enrollment criteria...)"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Required Documents</label>
            <textarea
              rows={3}
              className={styles.formTextarea}
              placeholder="Documents needed (e.g. Marksheets, Fee receipts, Identity proof, Income slip...)"
              value={formData.requiredDocuments}
              onChange={(e) => setFormData({ ...formData, requiredDocuments: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Application Process / Procedure</label>
            <textarea
              rows={3}
              className={styles.formTextarea}
              placeholder="Step-by-step application instructions..."
              value={formData.process}
              onChange={(e) => setFormData({ ...formData, process: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Frequently Asked Questions (FAQs)</label>
            <textarea
              rows={3}
              className={styles.formTextarea}
              placeholder="Q: Can postgraduate students apply?&#10;A: Yes, all higher education levels are covered."
              value={formData.faqs}
              onChange={(e) => setFormData({ ...formData, faqs: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formSwitchGroup}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }}
              />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-main)" }}>
                Active &amp; Visible to Public
              </span>
            </label>
            <p className={styles.formHelper}>
              If unchecked, this service will be hidden from the public website but preserved in the admin dashboard.
            </p>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/services" className={styles.secondaryBtn}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? "Update Service" : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
