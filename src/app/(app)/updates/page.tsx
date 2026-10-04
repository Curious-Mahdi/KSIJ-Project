import Link from "next/link";
import { ArrowLeft, AlertCircle, Calendar } from "lucide-react";
import { getAnnouncements } from "@/lib/actions/announcements";

export const metadata = {
  title: "Community Updates & Announcements | KSIJ Reload",
  description: "Stay informed with official announcements, notifications, and updates from Jamaat departments.",
};

export const revalidate = 0;

export default async function UpdatesPage() {
  const announcements = await getAnnouncements({ onlyPublished: true });

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px", minHeight: "85vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link
          href="/home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--color-primary)",
            fontWeight: 600,
            fontSize: "0.875rem",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2.25rem",
          fontWeight: 600,
          marginBottom: "12px",
          color: "var(--color-text-main)",
        }}
      >
        Community Updates &amp; Notices
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "36px", fontSize: "1rem" }}>
        Official announcements, scheme deadlines, and notifications from Jamaat administration.
      </p>

      {announcements.length === 0 ? (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <p>No active announcements posted at this time.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {announcements.map((ann) => {
            const dateStr = new Date(ann.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <article
                key={ann.id}
                style={{
                  padding: "24px",
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  border: ann.isImportant
                    ? "1px solid #F59E0B"
                    : "1px solid var(--color-border)",
                  boxShadow: ann.isImportant
                    ? "0 4px 12px rgba(245, 158, 11, 0.08)"
                    : "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: "#F3F4F6",
                        color: "#374151",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {ann.category}
                    </span>
                    {ann.isImportant && (
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          backgroundColor: "#FEF3C7",
                          color: "#B45309",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <AlertCircle size={11} /> High Priority
                      </span>
                    )}
                  </div>
                  <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                    {dateStr}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    marginBottom: "10px",
                    color: "var(--color-text-main)",
                  }}
                >
                  {ann.title}
                </h2>

                <p
                  style={{
                    color: "#4B5563",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    marginBottom: ann.linkUrl ? "14px" : "0",
                  }}
                >
                  {ann.content}
                </p>

                {ann.linkUrl && (
                  <Link
                    href={ann.linkUrl}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "var(--color-primary)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                  >
                    View Details &rarr;
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
