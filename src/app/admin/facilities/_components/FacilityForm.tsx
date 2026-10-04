"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import styles from "../../admin.module.css";
import { createFacility, updateFacility } from "@/lib/actions/facilities";

interface FacilityFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    location: string;
    capacity: number;
    amenities?: string | null;
    imageUrl?: string | null;
    isAvailable: boolean;
    contactInfo?: string | null;
    rules?: string | null;
  };
  isEdit?: boolean;
}

export default function FacilityForm({ initialData, isEdit }: FacilityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    capacity: initialData?.capacity || 50,
    amenities: initialData?.amenities || "",
    imageUrl: initialData?.imageUrl || "",
    contactInfo: initialData?.contactInfo || "",
    rules: initialData?.rules || "",
    isAvailable: initialData?.isAvailable !== undefined ? initialData.isAvailable : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEdit && initialData?.id) {
        await updateFacility(initialData.id, formData);
      } else {
        await createFacility(formData);
      }
      router.push("/admin/facilities");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save facility");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className={styles.pageHeaderRow}>
        <div>
          <Link
            href="/admin/facilities"
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
            <ArrowLeft size={14} /> Back to Facilities
          </Link>
          <h1 className={styles.dashboardTitle}>
            {isEdit ? "Edit Facility" : "Add Community Facility"}
          </h1>
          <p className={styles.dashboardSubtitle}>
            {isEdit
              ? "Update capacity, amenities, or venue guidelines."
              : "Register a new hall, meeting room, or sports facility."}
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
              Facility / Venue Name <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              placeholder="e.g. Al-Zahra Community Auditorium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Location / Floor <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              placeholder="e.g. Main Complex, 1st Floor"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Seating / Guest Capacity <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="number"
              min={1}
              required
              className={styles.formInput}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Amenities</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Central AC, Audio System, Projector, Dining Hall, Wheelchair Access"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            />
            <span className={styles.formHelper}>Comma-separated list of amenities available for attendees.</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Contact / Incharge Info</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. facilities@ksij.org | +91 98200 44551"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Image URL</label>
            <input
              type="url"
              className={styles.formInput}
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              rows={3}
              className={styles.formTextarea}
              placeholder="Overview of the facility, suitable event types, and layout..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Booking Rules &amp; Guidelines</label>
            <textarea
              rows={3}
              className={styles.formTextarea}
              placeholder="Rules regarding catering, timings, cancellation policy, deposit requirements..."
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formSwitchGroup}>
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }}
              />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-main)" }}>
                Facility Available for Booking
              </span>
            </label>
            <p className={styles.formHelper}>
              If unchecked, members will see the venue marked as &ldquo;Temporarily Unavailable / Under Maintenance&rdquo;.
            </p>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/facilities" className={styles.secondaryBtn}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? "Update Facility" : "Save Facility"}
          </button>
        </div>
      </form>
    </div>
  );
}
