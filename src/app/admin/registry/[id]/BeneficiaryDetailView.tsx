"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  HeartPulse,
  Utensils,
  GraduationCap,
  Banknote,
  Home,
  AlertTriangle,
  FileCheck2,
  Phone,
  MapPin,
  Users,
  ShieldCheck,
  Plus,
  Info,
} from "lucide-react";
import {
  OrganizationDTO,
  checkDuplicateAssistance,
  createAssistanceRecord,
  DuplicateCheckResult,
} from "@/lib/actions/registry";
import styles from "../registry.module.css";

interface BeneficiaryRecord {
  id: string;
  beneficiaryId: string;
  organizationId: string;
  organizationName: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  purpose: string | null;
  notes: string | null;
}

interface BeneficiaryDetail {
  id: string;
  beneficiaryId: string;
  name: string;
  phone: string;
  area: string;
  familySize: number;
  verificationStatus: string;
  verificationRef: string | null;
  notes: string | null;
  createdAt: string;
  assistanceRecords: BeneficiaryRecord[];
}

interface Props {
  beneficiary: BeneficiaryDetail;
  organizations: OrganizationDTO[];
  initialOrgId?: string;
}

const CATEGORIES = [
  "Medical Aid",
  "Food Support",
  "Education / Scholarship",
  "Emergency Financial Aid",
  "Loan",
  "Housing Support",
];

export default function BeneficiaryDetailView({
  beneficiary,
  organizations,
  initialOrgId,
}: Props) {
  // Current operating organization
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    initialOrgId && organizations.some((o) => o.id === initialOrgId)
      ? initialOrgId
      : organizations[0]?.id || ""
  );

  // Assistance History state
  const [records, setRecords] = useState<BeneficiaryRecord[]>(beneficiary.assistanceRecords);

  // New Assistance Form state
  const [category, setCategory] = useState<string>("Medical Aid");
  const [amount, setAmount] = useState<number | "">("");
  const [purpose, setPurpose] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Duplicate Check State
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Live duplicate check whenever category changes
  useEffect(() => {
    let isMounted = true;
    checkDuplicateAssistance(beneficiary.id, category).then((result) => {
      if (isMounted) {
        setDuplicateCheck(result);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [category, beneficiary.id, records]);

  // Current organization
  const currentOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0];

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setSubmissionError("Please enter a valid disbursement amount.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    const res = await createAssistanceRecord({
      beneficiaryId: beneficiary.id,
      organizationId: selectedOrgId,
      category,
      amount: Number(amount),
      date,
      purpose,
      notes,
    });

    setIsSubmitting(false);

    if (res.success) {
      setSubmissionSuccess(`Assistance grant of ${formatINR(Number(amount))} successfully recorded in centralized registry!`);
      
      // Update timeline locally
      const newRec: BeneficiaryRecord = {
        id: res.recordId || String(Date.now()),
        beneficiaryId: beneficiary.id,
        organizationId: selectedOrgId,
        organizationName: currentOrg?.name || "Assistance Organization",
        category,
        amount: Number(amount),
        date: new Date(date).toISOString(),
        status: "COMPLETED",
        purpose: purpose || null,
        notes: notes || null,
      };

      setRecords([newRec, ...records]);
      setAmount("");
      setPurpose("");
      setNotes("");

      setTimeout(() => {
        setSubmissionSuccess(null);
      }, 4000);
    } else {
      setSubmissionError(res.error || "Failed to record assistance grant.");
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Medical Aid":
        return <HeartPulse size={18} color="#0284C7" />;
      case "Food Support":
        return <Utensils size={18} color="#059669" />;
      case "Education / Scholarship":
        return <GraduationCap size={18} color="#0B5133" />;
      case "Loan":
      case "Emergency Financial Aid":
        return <Banknote size={18} color="#D97706" />;
      case "Housing Support":
        return <Home size={18} color="#7C3AED" />;
      default:
        return <FileCheck2 size={18} color="#64748B" />;
    }
  };

  const totalAssistanceSum = records.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className={styles.container}>
      {/* ─── Breadcrumb Navigation ───────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/admin/registry" className={styles.actionLink} style={{ fontSize: "0.875rem" }}>
          <ArrowLeft size={16} />
          <span>Back to Assistance Registry</span>
        </Link>

        {/* Multi-Org Simulator Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
            Current Organization:
          </span>
          <select
            className={styles.orgSelect}
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Profile & Record Grid ──────────────────────────────── */}
      <div className={styles.profileGrid}>
        {/* Left: Beneficiary Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <span className={styles.idBadge} style={{ width: "fit-content", marginBottom: 4 }}>
              {beneficiary.beneficiaryId}
            </span>
            <h1 className={styles.profileName}>{beneficiary.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span
                className={`${styles.statusPill} ${
                  beneficiary.verificationStatus === "VERIFIED"
                    ? styles.statusVerified
                    : beneficiary.verificationStatus === "PENDING"
                    ? styles.statusPending
                    : styles.statusUnverified
                }`}
              >
                {beneficiary.verificationStatus === "VERIFIED" && <CheckCircle2 size={12} />}
                {beneficiary.verificationStatus === "PENDING" && <Clock size={12} />}
                {beneficiary.verificationStatus}
              </span>
              {beneficiary.verificationRef && (
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  ({beneficiary.verificationRef})
                </span>
              )}
            </div>
          </div>

          <div className={styles.profileFields}>
            <div className={styles.profileFieldItem}>
              <span className={styles.fieldLabel}>Mobile Phone</span>
              <span className={styles.fieldVal} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Phone size={14} color="#64748B" />
                {beneficiary.phone}
              </span>
            </div>

            <div className={styles.profileFieldItem}>
              <span className={styles.fieldLabel}>Residential Area</span>
              <span className={styles.fieldVal} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} color="#64748B" />
                {beneficiary.area}, Mumbai
              </span>
            </div>

            <div className={styles.profileFieldItem}>
              <span className={styles.fieldLabel}>Family Size</span>
              <span className={styles.fieldVal} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={14} color="#64748B" />
                {beneficiary.familySize} Members
              </span>
            </div>

            <div className={styles.profileFieldItem}>
              <span className={styles.fieldLabel}>Total Cumulative Aid Received</span>
              <span className={styles.fieldVal} style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-primary)" }}>
                {formatINR(totalAssistanceSum)}
              </span>
            </div>

            {beneficiary.notes && (
              <div className={styles.profileFieldItem} style={{ marginTop: 8, paddingTop: 10, borderTop: "1px solid var(--color-border)" }}>
                <span className={styles.fieldLabel}>Caseworker Notes</span>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", lineHeight: 1.45, margin: 0 }}>
                  {beneficiary.notes}
                </p>
              </div>
            )}
          </div>

          {/* Privacy & Anti-Fraud Notice */}
          <div style={{ marginTop: 12, padding: "10px 12px", backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid var(--color-border)", fontSize: "0.75rem", color: "var(--color-text-muted)", display: "flex", gap: 8 }}>
            <ShieldCheck size={16} color="#0B5133" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Identity protected under Jamaat Registry Guidelines. No government identity numbers (Aadhaar) are stored.
            </span>
          </div>
        </div>

        {/* Right: Issue Assistance Form & Cross-Org Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Issue New Assistance Card */}
          <div className={styles.timelineCard}>
            <div className={styles.timelineHeader}>
              <div>
                <h2 className={styles.timelineTitle} style={{ fontSize: "1.125rem" }}>
                  Record New Assistance Grant
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", margin: 0 }}>
                  Issuing grant under: <strong>{currentOrg.name}</strong>
                </p>
              </div>
            </div>

            {/* DUPLICATE WARNING ALERT */}
            {duplicateCheck && duplicateCheck.hasDuplicate && (
              <div className={styles.duplicateAlertBox} role="alert">
                <div className={styles.duplicateAlertTop}>
                  <AlertTriangle size={20} color="#D97706" />
                  <span>Potential Duplicate Assistance Detected</span>
                </div>
                <p className={styles.duplicateAlertText}>
                  {duplicateCheck.warningMessage}
                </p>
                <div className={styles.duplicateHistoryList}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#92400e" }}>
                    Previous {category} records found in registry ({duplicateCheck.duplicateCount}):
                  </span>
                  {duplicateCheck.previousRecords.map((rec) => (
                    <div key={rec.id} className={styles.duplicateHistoryItem}>
                      <div>
                        <strong>{formatINR(rec.amount)}</strong>
                        <span style={{ color: "#64748B", marginLeft: 8 }}>
                          on {new Date(rec.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span style={{ marginLeft: 8, color: "#0369a1", fontWeight: 600 }}>
                          ({rec.organizationName})
                        </span>
                      </div>
                      {rec.purpose && (
                        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          {rec.purpose}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#b45309", marginTop: 4 }}>
                  ⚠️ Recommendation: Verify whether this is a legitimate continuation of ongoing care or an unauthorized duplicate application across charities.
                </div>
              </div>
            )}

            {submissionSuccess && (
              <div style={{ padding: "12px 16px", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, color: "#065f46", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={18} />
                <span>{submissionSuccess}</span>
              </div>
            )}

            {submissionError && (
              <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#b91c1c", fontSize: "0.875rem" }}>
                {submissionError}
              </div>
            )}

            <form onSubmit={handleRecordSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Assistance Category *</label>
                  <select
                    className={styles.formSelect}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Disbursed Value (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    placeholder="e.g. 15000"
                    className={styles.formInput}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || "")}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Disbursement Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Providing Organization</label>
                  <input
                    type="text"
                    disabled
                    className={styles.formInput}
                    value={`${currentOrg.name} (${currentOrg.code})`}
                    style={{ backgroundColor: "#f8fafc", color: "#64748B" }}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Purpose / Specific Use Case</label>
                <input
                  type="text"
                  placeholder="e.g. Hospitalization medical pharmacy bills, university fee installment"
                  className={styles.formInput}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.primaryBtn}
                  style={{
                    backgroundColor: duplicateCheck?.hasDuplicate ? "#d97706" : "var(--color-primary)",
                  }}
                >
                  <Plus size={16} />
                  <span>
                    {isSubmitting
                      ? "Recording Grant..."
                      : duplicateCheck?.hasDuplicate
                      ? "Acknowledge Warning & Record Grant"
                      : "Record Grant in Central Ledger"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Cross-Organization Assistance Timeline */}
          <div className={styles.timelineCard}>
            <div className={styles.timelineHeader}>
              <div>
                <h2 className={styles.timelineTitle}>
                  Centralized Assistance History Ledger
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", margin: 0 }}>
                  Chronological record of all assistance approved across participating community organizations.
                </p>
              </div>
              <span className={styles.historyBadge} style={{ fontWeight: 700 }}>
                {records.length} Total Grants
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {records.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "var(--color-text-muted)" }}>
                  No previous assistance records found in the centralized registry for this beneficiary.
                </div>
              ) : (
                records.map((r) => (
                  <div key={r.id} className={styles.recordItem}>
                    <div className={styles.recordItemLeft}>
                      <div className={styles.recordIconBox} style={{ backgroundColor: "#f1f5f9" }}>
                        {getCategoryIcon(r.category)}
                      </div>
                      <div className={styles.recordContent}>
                        <div className={styles.recordCategory}>
                          <span>{r.category}</span>
                          <span className={styles.recordOrgBadge}>
                            {r.organizationName}
                          </span>
                        </div>
                        {r.purpose && <p className={styles.recordPurpose}>{r.purpose}</p>}
                        <div className={styles.recordMeta}>
                          <span>Disbursed on {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <span>•</span>
                          <span style={{ color: "#065f46", fontWeight: 600 }}>{r.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.recordAmountGroup}>
                      <span className={styles.recordAmount}>{formatINR(r.amount)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
