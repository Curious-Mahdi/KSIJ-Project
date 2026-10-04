"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import styles from "../../admin.module.css";
import { createEvent, updateEvent } from "@/lib/actions/events";

interface EventFormProps {
  initialData?: {
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
  };
  isEdit?: boolean;
}

export default function EventForm({ initialData, isEdit }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      if (json.url) {
        setImagePreviewError(false);
        setFormData((prev) => ({ ...prev, imageUrl: json.url }));
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to upload image. You can also paste an online image link.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Safe date parser to prevent RangeError: Invalid time value
  let formattedDate = new Date().toISOString().split("T")[0];
  try {
    if (initialData?.date) {
      const parsed = new Date(initialData.date);
      if (!isNaN(parsed.getTime())) {
        formattedDate = parsed.toISOString().split("T")[0];
      }
    }
  } catch (_) {
    formattedDate = new Date().toISOString().split("T")[0];
  }

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    date: formattedDate,
    time: initialData?.time || "10:00 AM - 12:00 PM",
    location: initialData?.location || "",
    imageUrl: initialData?.imageUrl || "",
    registrationUrl: initialData?.registrationUrl || "",
    isImportant: initialData?.isImportant || false,
    status: initialData?.status || "UPCOMING",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEdit && initialData?.id) {
        await updateEvent(initialData.id, formData);
      } else {
        await createEvent(formData);
      }
      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save event");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className={styles.pageHeaderRow}>
        <div>
          <Link
            href="/admin/events"
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
            <ArrowLeft size={14} /> Back to Events
          </Link>
          <h1 className={styles.dashboardTitle}>
            {isEdit ? "Edit Event" : "Create New Event"}
          </h1>
          <p className={styles.dashboardSubtitle}>
            {isEdit
              ? "Update event schedules, location, and registration info."
              : "Schedule and announce a new community event."}
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
              Event Title <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              placeholder="e.g. Annual Community Townhall &amp; Awards"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Date <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="date"
              required
              className={styles.formInput}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Time <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              placeholder="e.g. 10:00 AM - 1:00 PM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Location / Venue <span className={styles.formLabelRequired}>*</span>
            </label>
            <input
              type="text"
              required
              className={styles.formInput}
              placeholder="e.g. Main Auditorium, Community Centre"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Status</label>
            <select
              className={styles.formSelectField}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Registration URL / RSVP Link</label>
            <input
              type="url"
              className={styles.formInput}
              placeholder="https://forms.gle/... or https://..."
              value={formData.registrationUrl}
              onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              onBlur={() => {
                if (
                  formData.registrationUrl &&
                  !formData.registrationUrl.startsWith("http://") &&
                  !formData.registrationUrl.startsWith("https://") &&
                  !formData.registrationUrl.startsWith("/")
                ) {
                  setFormData({ ...formData, registrationUrl: `https://${formData.registrationUrl.trim()}` });
                }
              }}
            />
            <span className={styles.formHelper}>Optional link to a Google Form, RSVP system, or external page.</span>
          </div>

          <div className={styles.formGroupFull}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <label className={styles.formLabel} style={{ marginBottom: 0 }}>Event Poster / Image</label>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  borderRadius: "6px",
                  border: "none",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.7 : 1,
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={14} /> Upload from Computer
                  </>
                )}
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Paste web URL (https://...) or click 'Upload from Computer'"
                value={formData.imageUrl}
                onChange={(e) => {
                  setImagePreviewError(false);
                  setFormData({ ...formData, imageUrl: e.target.value });
                }}
                onBlur={() => {
                  const val = formData.imageUrl.trim();
                  if (
                    val &&
                    !val.startsWith("http://") &&
                    !val.startsWith("https://") &&
                    !val.startsWith("/")
                  ) {
                    setFormData({ ...formData, imageUrl: `https://${val}` });
                  }
                }}
              />
              {formData.imageUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                  style={{
                    padding: "0 12px",
                    background: "#f3f4f6",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    color: "#6b7280"
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Smart detection of local path */}
            {(formData.imageUrl.includes("C:\\") || formData.imageUrl.includes("Downloads") || formData.imageUrl.startsWith("file://")) && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.8rem",
                  color: "#92400e",
                  backgroundColor: "#fef3c7",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #fde68a",
                }}
              >
                💡 <strong>Local file path detected:</strong> Web browsers cannot open files from your local disk directly. Please click the green <strong>"Upload from Computer"</strong> button above to select your WhatsApp or Downloads image!
              </div>
            )}

            {formData.imageUrl && !formData.imageUrl.includes("C:\\") && (
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                {!imagePreviewError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.imageUrl}
                    alt="Poster Preview"
                    onError={() => setImagePreviewError(true)}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#f3f4f6",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#b45309",
                      backgroundColor: "#fef3c7",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #fde68a",
                    }}
                  >
                    ⚠ Live image preview failed (broken or blocked link). A clean fallback will be used on the site.
                  </div>
                )}
              </div>
            )}
            <span className={styles.formHelper}>
              Tip: You can click <strong>"Upload from Computer"</strong> to pick any image from your PC (e.g. WhatsApp, Downloads), or paste an online image link (e.g. <code>https://images.unsplash.com/...</code>).
            </span>
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              rows={4}
              className={styles.formTextarea}
              placeholder="Provide event overview, schedule, speakers, and instructions for attendees..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                Mark as Featured / Important Event
              </span>
            </label>
            <p className={styles.formHelper}>
              Featured events are pinned prominently at the top of the events schedule.
            </p>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/events" className={styles.secondaryBtn}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
