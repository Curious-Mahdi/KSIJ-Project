"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function ApplicationsDashboardPage() {
  // Demo applications array
  const applications = [
    {
      id: "KSIJ-EDU-2026-00421",
      serviceId: "educational-scholarship",
      title: "Educational Scholarship",
      status: "Under Review",
      statusCode: "review",
      submittedAt: "02 Oct 2026",
    },
    {
      id: "KSIJ-MED-2026-00318",
      serviceId: "medical-assistance",
      title: "Medical Assistance",
      status: "Additional Information Required",
      statusCode: "action",
      submittedAt: "28 Sep 2026",
    },
    {
      id: "KSIJ-UNN-2026-00107",
      serviceId: "unnati-loan",
      title: "UNNATI Loan",
      status: "Committee Review",
      statusCode: "review",
      submittedAt: "15 Sep 2026",
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>My Applications</h1>
            <p className={styles.subtitle}>Track and manage your community service applications.</p>
          </div>
          <Link href="/services" className={styles.exploreButton}>
            Explore Services
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className={styles.grid}>
            {applications.map((app) => (
              <Link key={app.id} href={`/services/applications/${app.id}`} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.serviceTitle}>{app.title}</div>
                    <div className={styles.appId}>{app.id}</div>
                  </div>
                  <div className={`${styles.statusBadge} ${app.statusCode === 'review' ? styles.statusReview : app.statusCode === 'action' ? styles.statusAction : ''}`}>
                    {app.status}
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  Submitted {app.submittedAt}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>You haven't started an application yet.</div>
            <div className={styles.emptyText}>Discover services and apply for community support when you need it.</div>
            <Link href="/services" className={styles.exploreButton}>
              Explore Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
