"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Search,
  Plus,
  Clock,
  KeyRound,
  FileText,
  ShieldAlert,
} from "lucide-react";
import {
  VerificationOrgDTO,
  VerificationResultDTO,
  PrivateAssistanceRecordDTO,
  AuditLogDTO,
  verifyBeneficiaryQuery,
  getOrganizationPrivateLedger,
  recordOrganizationAssistance,
  getVerificationAuditLogs,
} from "@/lib/actions/verification";
import styles from "./verification.module.css";

interface Props {
  organizations: VerificationOrgDTO[];
  initialAuditLogs: AuditLogDTO[];
}

const CATEGORIES = [
  "Medical Assistance",
  "Food Support",
  "Education / Scholarship",
  "Emergency Financial Aid",
  "Housing Support",
  "Micro-Loan",
];

export default function VerificationClientView({ organizations, initialAuditLogs }: Props) {
  // 1. Active Organization Context
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    organizations[0]?.id || ""
  );
  const activeOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0];

  // 2. Verification Form State
  const [beneficiaryRef, setBeneficiaryRef] = useState<string>("BEN-000123");
  const [selectedCategory, setSelectedCategory] = useState<string>("Medical Assistance");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResultDTO | null>(null);

  // 3. Organization Private Ledger State
  const [privateLedger, setPrivateLedger] = useState<PrivateAssistanceRecordDTO[]>([]);
  const [isLoadingLedger, setIsLoadingLedger] = useState<boolean>(false);

  // 4. Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditLogDTO[]>(initialAuditLogs);

  // 5. Create Record Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formBenRef, setFormBenRef] = useState<string>("BEN-000123");
  const [formCategory, setFormCategory] = useState<string>("Medical Assistance");
  const [formAmount, setFormAmount] = useState<string>("10000");
  const [formCaseRef, setFormCaseRef] = useState<string>("CASE-2026-MED-99");
  const [formPrivateNotes, setFormPrivateNotes] = useState<string>(
    "Case reviewed by trustee committee; verified urgent prescription."
  );

  // Load private ledger whenever active organization changes
  useEffect(() => {
    if (!selectedOrgId) return;
    setIsLoadingLedger(true);
    getOrganizationPrivateLedger(selectedOrgId)
      .then((records) => {
        setPrivateLedger(records);
        setIsLoadingLedger(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoadingLedger(false);
      });
  }, [selectedOrgId]);

  // Execute Central Verification Check
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!beneficiaryRef.trim()) return;

    setIsVerifying(true);
    try {
      const result = await verifyBeneficiaryQuery(
        activeOrg.id,
        beneficiaryRef.trim(),
        selectedCategory
      );
      setVerificationResult(result);

      // Refresh Audit Trail
      const updatedLogs = await getVerificationAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err) {
      console.error("Verification query error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Submit New Private Assistance Record
  const handleCreateAssistance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBenRef.trim() || !formAmount) return;

    setIsSubmitting(true);
    try {
      const res = await recordOrganizationAssistance({
        organizationId: activeOrg.id,
        beneficiaryReference: formBenRef.trim(),
        category: formCategory,
        amount: Number(formAmount),
        caseReference: formCaseRef,
        privateNotes: formPrivateNotes,
      });

      if (res.success) {
        setIsModalOpen(false);
        // Refresh private ledger for active org
        const records = await getOrganizationPrivateLedger(activeOrg.id);
        setPrivateLedger(records);
        // Refresh audit logs
        const updatedLogs = await getVerificationAuditLogs();
        setAuditLogs(updatedLogs);
      } else {
        alert(res.error || "Failed to record assistance");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* ─── Header & Org Context Switcher ────────────────────────── */}
      <div className={styles.headerCard}>
        <div className={styles.titleArea}>
          <h1>
            <ShieldCheck size={28} color="#075C3A" />
            Centralized Assistance Verification
          </h1>
          <p className={styles.subtitle}>
            Privacy-preserving cross-foundation verification network with strict data minimization.
          </p>
        </div>

        <div className={styles.orgSwitcherCard}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
              Active Organization Context
            </span>
            <select
              className={styles.orgSelect}
              value={selectedOrgId}
              onChange={(e) => {
                setSelectedOrgId(e.target.value);
                setVerificationResult(null); // Clear previous check on switch
              }}
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.code})
                </option>
              ))}
            </select>
          </div>
          <span className={styles.privacyPill}>
            <Lock size={12} />
            Isolated Partition
          </span>
        </div>
      </div>

      {/* ─── Privacy Security Banner ────────────────────────────────── */}
      <div className={styles.securityBanner}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <KeyRound size={18} color="#A7F3D0" />
          <span>
            Operating as <strong>{activeOrg.name}</strong> • Direct cross-organization database queries are{" "}
            <strong>STRICTLY FORBIDDEN</strong>. Verification occurs exclusively via Central API attestation.
          </span>
        </div>
        <span className={styles.apiBadge}>API KEY: {activeOrg.apiKey || "ak_live_demo"}</span>
      </div>

      {/* ─── Verification Check Panel ────────────────────────────── */}
      <div className={styles.verifySection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              <Search size={20} color="#075C3A" />
              Privacy-Preserving Assistance Verification Query
            </h2>
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "#64748B" }}>
              Query the Central Verification Service to inspect prior aid without exposing donor foundation case files.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.primaryBtn}
          >
            <Plus size={16} />
            Record {activeOrg.code} Assistance
          </button>
        </div>

        <form onSubmit={handleVerify} className={styles.verifyForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Beneficiary Reference (Internal ID or Phone)</label>
            <input
              type="text"
              className={styles.inputField}
              placeholder="e.g. BEN-000123"
              value={beneficiaryRef}
              onChange={(e) => setBeneficiaryRef(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Requested Assistance Category</label>
            <select
              className={styles.selectField}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={styles.checkBtn}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <span>Querying Central API...</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Run Verification Check</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Select Shortcuts */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748B" }}>Demo Test Cases:</span>
          <button
            type="button"
            onClick={() => {
              setBeneficiaryRef("BEN-000123");
              setSelectedCategory("Medical Assistance");
            }}
            style={{
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Ahmed Khan (BEN-000123) • Medical Aid
          </button>
          <button
            type="button"
            onClick={() => {
              setBeneficiaryRef("BEN-000104");
              setSelectedCategory("Food Support");
            }}
            style={{
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Fatima Shaikh (BEN-000104) • Food Support
          </button>
          <button
            type="button"
            onClick={() => {
              setBeneficiaryRef("BEN-000118");
              setSelectedCategory("Medical Assistance");
            }}
            style={{
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Ibrahim Sayed (BEN-000118) • Clean Case
          </button>
        </div>

        {/* ─── Verification Result Alert Card ──────────────────────── */}
        {verificationResult && (
          <div
            className={`${styles.resultAlert} ${
              verificationResult.relevantAssistance
                ? styles.resultAlertWarning
                : styles.resultAlertClean
            }`}
          >
            <div className={styles.resultTitleRow}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {verificationResult.relevantAssistance ? (
                  <AlertTriangle size={24} color="#DC2626" />
                ) : (
                  <CheckCircle2 size={24} color="#059669" />
                )}
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 800, color: verificationResult.relevantAssistance ? "#991B1B" : "#065F46" }}>
                    {verificationResult.relevantAssistance
                      ? "PREVIOUS RELEVANT ASSISTANCE DETECTED"
                      : "NO PREVIOUS ASSISTANCE DETECTED IN THIS CATEGORY"}
                  </h3>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.8125rem", color: "#64748B" }}>
                    Verified across all participating Jamaat foundations via Central Verification Network.
                  </p>
                </div>
              </div>

              {verificationResult.relevantAssistance ? (
                <span className={styles.resultBadgeWarning}>
                  <ShieldAlert size={14} />
                  Review Required
                </span>
              ) : (
                <span className={styles.resultBadgeClean}>
                  <CheckCircle2 size={14} />
                  Cleared for Grant
                </span>
              )}
            </div>

            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultItemLabel}>Beneficiary Reference</span>
                <span className={styles.resultItemValue}>
                  {verificationResult.beneficiaryReference}
                </span>
                {verificationResult.beneficiaryName && (
                  <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                    {verificationResult.beneficiaryName} ({verificationResult.area})
                  </span>
                )}
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultItemLabel}>Queried Category</span>
                <span className={styles.resultItemValue}>{verificationResult.category}</span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultItemLabel}>Last Assistance Date</span>
                <span className={styles.resultItemValue}>
                  {verificationResult.lastAssistanceDate || "None on Record"}
                </span>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.resultItemLabel}>Protocol Recommendation</span>
                <span
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: verificationResult.relevantAssistance ? "#DC2626" : "#059669",
                  }}
                >
                  {verificationResult.relevantAssistance
                    ? "Verify with applicant before approving additional funds"
                    : "No duplication detected — Proceed with intake"}
                </span>
              </div>
            </div>

            {/* If other category exists on record */}
            {verificationResult.otherCategoryOnRecord && (
              <div style={{ background: "#FEF3C7", padding: "10px 14px", borderRadius: 6, fontSize: "0.8125rem", color: "#92400E" }}>
                ℹ️ <strong>Additional History Noted:</strong> Applicant also has prior recorded assistance in <strong>{verificationResult.otherCategoryOnRecord}</strong> on {verificationResult.otherDateOnRecord}.
              </div>
            )}

            {/* Privacy Shield Box: Demonstrating Data Minimization */}
            <div className={styles.privacyShieldBox}>
              <EyeOff size={20} color="#075C3A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Privacy Shield & Data Minimization Enforced:</strong>
                <div>
                  {activeOrg.name} is strictly restricted from viewing the donor foundation&apos;s identity,
                  exact grant amounts, private trustee notes, or confidential medical case records.
                  Only the attestation that assistance exists was transmitted.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => {
                  setFormBenRef(verificationResult.beneficiaryReference);
                  setFormCategory(verificationResult.category);
                  setIsModalOpen(true);
                }}
                className={styles.primaryBtn}
              >
                <Plus size={16} />
                {verificationResult.relevantAssistance ? "Continue & Record Grant Anyway" : "Issue New Grant Record"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Two-Column Grid: Private Ledger & Audit Trail ───────── */}
      <div className={styles.bottomGrid}>
        {/* Panel 2: Organization's Private Records Ledger */}
        <div className={styles.ledgerCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                <Lock size={16} color="#075C3A" />
                {activeOrg.name}&apos;s Confidential Private Ledger
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#64748B" }}>
                Only records created by {activeOrg.name} appear here. Other foundations cannot see these records.
              </p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Beneficiary</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Private Case Notes (Confidential)</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingLedger ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                      Loading private partition...
                    </td>
                  </tr>
                ) : privateLedger.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "28px", color: "#94A3B8" }}>
                      No private assistance records found for {activeOrg.name}.
                    </td>
                  </tr>
                ) : (
                  privateLedger.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.beneficiaryReference}</strong>
                        <div style={{ fontSize: "0.6875rem", color: "#64748B" }}>{r.beneficiaryName}</div>
                      </td>
                      <td>{r.category}</td>
                      <td>
                        <strong>₹{r.amount.toLocaleString("en-IN")}</strong>
                      </td>
                      <td>{r.date}</td>
                      <td>
                        <div style={{ fontSize: "0.75rem", color: "#334155" }}>
                          {r.privateNotes || "No notes"}
                        </div>
                        {r.caseReference && (
                          <span className={styles.privateNoteTag}>
                            REF: {r.caseReference}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel 3: Central Audit Trail */}
        <div className={styles.auditCard}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={16} color="#075C3A" />
              Central Verification Audit Trail
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#64748B" }}>
              Immutable log of cross-organization queries and record publications.
            </p>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Organization</th>
                  <th>Beneficiary</th>
                  <th>Action & Result</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "#94A3B8" }}>
                      No audit logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.slice(0, 10).map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: "0.6875rem", color: "#64748B" }} suppressHydrationWarning>
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        <br />
                        {new Date(log.createdAt).toLocaleDateString([], { day: "numeric", month: "short" })}
                      </td>
                      <td>
                        <strong>{log.organizationName}</strong>
                      </td>
                      <td>
                        <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                          {log.beneficiaryReference}
                        </span>
                        <div style={{ fontSize: "0.6875rem", color: "#64748B" }}>{log.category}</div>
                      </td>
                      <td>
                        <span
                          className={`${styles.actionPill} ${
                            log.result === "RELEVANT_ASSISTANCE_FOUND"
                              ? styles.actionPillDenied
                              : log.result === "RECORD_CREATED"
                              ? styles.actionPillRecord
                              : styles.actionPillCheck
                          }`}
                        >
                          {log.result === "RELEVANT_ASSISTANCE_FOUND" ? "DUPLICATE_FLAGGED" : log.result}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Modal: Create Private Assistance Record ─────────────── */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Record Assistance Grant — {activeOrg.name}
              </h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssistance} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Beneficiary Reference</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={formBenRef}
                  onChange={(e) => setFormBenRef(e.target.value)}
                  placeholder="e.g. BEN-000123"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Assistance Category</label>
                  <select
                    className={styles.selectField}
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Disbursed Amount (₹)</label>
                  <input
                    type="number"
                    className={styles.inputField}
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Internal Case Reference</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={formCaseRef}
                  onChange={(e) => setFormCaseRef(e.target.value)}
                  placeholder="e.g. CASE-2026-MED-99"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Private Case Worker Notes (Confidential to {activeOrg.name})
                </label>
                <textarea
                  className={styles.inputField}
                  style={{ height: 75, padding: "10px 14px", resize: "none" }}
                  value={formPrivateNotes}
                  onChange={(e) => setFormPrivateNotes(e.target.value)}
                  placeholder="Enter private notes... These will NEVER be transmitted to other foundations."
                />
              </div>

              <div style={{ background: "#F1F5F9", padding: "10px 14px", borderRadius: 8, fontSize: "0.75rem", color: "#475569" }}>
                🔒 <strong>Privacy Assurance:</strong> Detailed case notes and amount will be stored exclusively in {activeOrg.name}&apos;s database partition. Only a sanitized attestation (Beneficiary ID + Category + Date) will be published to the Central Verification Service.
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Recording..." : "Record & Broadcast Attestation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
