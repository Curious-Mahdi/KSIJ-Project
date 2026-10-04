"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Upload, File, Check } from "lucide-react";
import styles from "./page.module.css";
import { services } from "@/lib/data/services";

function ApplicationFormContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const { data: session } = useSession();
  
  const service = services.find((s) => s.id === serviceId) || services[0];

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appId, setAppId] = useState("");

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Generate a fake application ID
      const prefix = service.id.substring(0, 3).toUpperCase();
      const num = Math.floor(10000 + Math.random() * 90000);
      setAppId(`KSIJ-${prefix}-2026-${num}`);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <Check size={40} />
            </div>
            <h1 className={styles.successTitle}>Application Submitted</h1>
            <div className={styles.successId}>{appId}</div>
            <p className={styles.successText}>
              Your application for {service.title} has been successfully submitted. You can track its progress in your applications dashboard.
            </p>
            <Link href="/services/applications" className={styles.submitButton}>
              Go to My Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/services">Community Services</Link> / <Link href={`/services/${service.id}`}>{service.title}</Link> / Apply
        </div>
        
        <h1 className={styles.pageTitle}>Apply for {service.title}</h1>
        <p className={styles.subtitle}>Step {step} of 2</p>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input type="text" className={styles.input} defaultValue={session?.user?.name || ""} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input type="email" className={styles.input} defaultValue="ali.punjani@example.com" required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input type="tel" className={styles.input} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Jamaat / Centre</label>
                  <input type="text" className={styles.input} defaultValue="KSIJ Mumbai" required />
                </div>
              </div>

              <h2 className={styles.sectionTitle}>Service Information</h2>
              <div className={styles.formGrid}>
                {service.applicationFields.map((field, idx) => (
                  <div key={idx} className={styles.formGroup}>
                    <label className={styles.label}>{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea className={styles.textarea} required />
                    ) : (
                      <input type={field.type} className={styles.input} required />
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.buttonGroup}>
                <Link href={`/services/${service.id}`} className={styles.cancelButton}>
                  Cancel
                </Link>
                <button type="button" onClick={handleNext} className={styles.submitButton}>
                  Next Step
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.sectionTitle}>Upload Documents</h2>
              <p className={styles.subtitle}>Please provide the documents required for this service. (Max 10MB per file)</p>
              
              <div className={styles.uploadArea}>
                <Upload size={32} className={styles.uploadIcon} />
                <div className={styles.uploadTitle}>Click to upload or drag and drop</div>
                <div className={styles.uploadSubtitle}>PDF, JPG, PNG up to 10MB</div>
              </div>

              <div className={styles.fileList}>
                <div className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <File size={20} color="#68756F" />
                    <div>
                      <div className={styles.fileName}>Aadhaar_Card.pdf</div>
                      <div className={styles.fileSize}>1.2 MB</div>
                    </div>
                  </div>
                  <button type="button" className={styles.removeButton}>Remove</button>
                </div>
                <div className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <File size={20} color="#68756F" />
                    <div>
                      <div className={styles.fileName}>Income_Certificate.pdf</div>
                      <div className={styles.fileSize}>845 KB</div>
                    </div>
                  </div>
                  <button type="button" className={styles.removeButton}>Remove</button>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button type="button" onClick={handleBack} className={styles.cancelButton}>
                  Back
                </button>
                <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default function NewApplicationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationFormContent />
    </Suspense>
  );
}
