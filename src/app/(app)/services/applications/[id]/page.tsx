"use client";

import { useSession } from "next-auth/react";
import { use } from "react";

import Link from "next/link";
import { Check, FileText, Upload } from "lucide-react";
import styles from "./page.module.css";

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const { id } = use(params);
  // Demo application data
  const isActionRequired = id === "KSIJ-MED-2026-00318";
  
  const appData = {
    id: id,
    title: id.includes("EDU") ? "Educational Scholarship" : id.includes("MED") ? "Medical Assistance" : "UNNATI Loan",
    status: isActionRequired ? "Additional Information Required" : "Under Review",
    statusCode: isActionRequired ? "action" : "review",
    submittedAt: "02 Oct 2026",
    applicantName: session?.user?.name || "Applicant",
    documents: [
      { name: "Aadhaar_Card.pdf" },
      { name: "Income_Certificate.pdf" },
    ]
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/services/applications">My Applications</Link> / {appData.id}
        </div>

        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className={styles.serviceName}>{appData.title}</h1>
            <div className={styles.appId}>{appData.id}</div>
          </div>
          <div className={`${styles.statusBadge} ${appData.statusCode === 'review' ? styles.statusReview : appData.statusCode === 'action' ? styles.statusAction : ''}`}>
            {appData.status}
          </div>
        </div>

        {isActionRequired && (
          <div className={styles.actionBox}>
            <div className={styles.actionTitle}>Action Required</div>
            <div className={styles.actionText}>Please upload the latest academic mark sheet to continue the review.</div>
            <button className={styles.uploadButton}>
              <Upload size={16} /> Upload Document
            </button>
          </div>
        )}

        <div className={styles.grid}>
          <div className={styles.mainColumn}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Application Progress</h2>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div className={`${styles.timelineIcon} ${styles.iconDone}`}>
                    <Check size={14} />
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Application Submitted</div>
                    <div className={styles.timelineDate}>{appData.submittedAt}</div>
                  </div>
                </div>
                
                <div className={styles.timelineItem}>
                  <div className={`${styles.timelineIcon} ${isActionRequired ? styles.iconDone : styles.iconCurrent}`}>
                    {isActionRequired && <Check size={14} />}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Documents Under Review</div>
                    <div className={styles.timelineDate}>03 Oct 2026</div>
                  </div>
                </div>
                
                <div className={styles.timelineItem}>
                  <div className={`${styles.timelineIcon} ${isActionRequired ? styles.iconCurrent : styles.iconPending}`}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Additional Information Required</div>
                    <div className={styles.timelineDate}>{isActionRequired ? "Current phase" : "Pending"}</div>
                  </div>
                </div>

                <div className={styles.timelineItem}>
                  <div className={`${styles.timelineIcon} ${styles.iconPending}`}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Committee Review</div>
                    <div className={styles.timelineDate}>Pending</div>
                  </div>
                </div>

                <div className={styles.timelineItem}>
                  <div className={`${styles.timelineIcon} ${styles.iconPending}`}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Decision</div>
                    <div className={styles.timelineDate}>Pending</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Uploaded Documents</h2>
              <div className={styles.docList}>
                {appData.documents.map((doc, idx) => (
                  <div key={idx} className={styles.docItem}>
                    <FileText size={20} className={styles.docIcon} />
                    <div className={styles.docName}>{doc.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Application Summary</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Applicant</span>
                  <span className={styles.summaryValue}>{appData.applicantName}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Submitted</span>
                  <span className={styles.summaryValue}>{appData.submittedAt}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Status</span>
                  <span className={styles.summaryValue}>{appData.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
