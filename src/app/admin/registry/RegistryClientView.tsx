"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Users,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  Search,
  Building2,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  X,
  FileCheck2,
  Phone,
  MapPin,
  HelpCircle,
  Eye,
} from "lucide-react";
import {
  OrganizationDTO,
  BeneficiarySummaryDTO,
  createBeneficiary,
  searchBeneficiaries,
} from "@/lib/actions/registry";
import styles from "./registry.module.css";

interface Props {
  initialOrganizations: OrganizationDTO[];
  initialBeneficiaries: BeneficiarySummaryDTO[];
  initialStats: {
    totalBeneficiaries: number;
    totalRecords: number;
    totalDisbursed: number;
    flaggedDuplicatesCount: number;
  };
}

export default function RegistryClientView({
  initialOrganizations,
  initialBeneficiaries,
  initialStats,
}: Props) {
  // Multi-organization simulator state
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    initialOrganizations[0]?.id || ""
  );

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [beneficiaries, setBeneficiaries] = useState<BeneficiarySummaryDTO[]>(initialBeneficiaries);
  const [isSearching, startSearchTransition] = useTransition();

  // New Beneficiary Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    phone: "",
    area: "Kurla",
    familySize: 4,
    verificationStatus: "VERIFIED",
    notes: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  // Current active operating organization
  const currentOrg = initialOrganizations.find((o) => o.id === selectedOrgId) || initialOrganizations[0];

  // Areas list
  const AREAS = [
    "ALL",
    "Kurla",
    "Dongri",
    "Govandi",
    "Mira Road",
    "Byculla",
    "Bandra",
    "Mumbra",
    "Jogeshwari",
  ];

  // Handle Search
  const handleSearch = (q: string, area: string, status: string) => {
    setSearchQuery(q);
    setSelectedArea(area);
    setSelectedStatus(status);

    startSearchTransition(async () => {
      const results = await searchBeneficiaries(q, area, status);
      setBeneficiaries(results);
    });
  };

  // Handle Register Beneficiary Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBeneficiary.name || !newBeneficiary.phone) return;

    setIsRegistering(true);
    setRegisterSuccess(null);

    const res = await createBeneficiary(newBeneficiary);
    setIsRegistering(false);

    if (res.success && res.formattedId) {
      setRegisterSuccess(`Registered successfully! Beneficiary ID: ${res.formattedId}`);
      // Refresh list
      const updated = await searchBeneficiaries(searchQuery, selectedArea, selectedStatus);
      setBeneficiaries(updated);

      setTimeout(() => {
        setShowRegisterModal(false);
        setRegisterSuccess(null);
        setNewBeneficiary({
          name: "",
          phone: "",
          area: "Kurla",
          familySize: 4,
          verificationStatus: "VERIFIED",
          notes: "",
        });
      }, 1500);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className={styles.container}>
      {/* ─── Page Header ────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Centralized Assistance Registry</h1>
            <p className={styles.subtitle}>
              Unified cross-organization welfare registry enabling community institutions to verify
              beneficiary eligibility, audit previous disbursements, and prevent duplicate assistance.
            </p>
          </div>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => setShowRegisterModal(true)}
          >
            <Plus size={16} />
            <span>Register Beneficiary</span>
          </button>
        </div>
      </div>

      {/* ─── Multi-Organization Simulator Selector ───────────────── */}
      <div className={styles.orgBar}>
        <div className={styles.orgBarLeft}>
          <div className={styles.orgIconWrapper}>
            <Building2 size={20} />
          </div>
          <div className={styles.orgSelectGroup}>
            <span className={styles.orgSelectLabel}>Simulating Active Organization:</span>
            <select
              className={styles.orgSelect}
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
            >
              {initialOrganizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.orgBarRight}>
          <CheckCircle2 size={14} />
          <span>Shared Ledger Synchronized</span>
        </div>
      </div>

      {/* ─── Registry Operational KPIs ───────────────────────────── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statLabel}>Total Beneficiaries</span>
            <Users size={18} color="#0B5133" />
          </div>
          <span className={styles.statValue}>{initialStats.totalBeneficiaries}</span>
          <span className={styles.statSub}>Registered across all Mumbai areas</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statLabel}>Assistance Grants Recorded</span>
            <FileCheck2 size={18} color="#0284C7" />
          </div>
          <span className={styles.statValue}>{initialStats.totalRecords}</span>
          <span className={styles.statSub}>Cross-organization historical grants</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statLabel}>Centralized Capital Tracked</span>
            <IndianRupee size={18} color="#059669" />
          </div>
          <span className={styles.statValue}>{formatINR(initialStats.totalDisbursed)}</span>
          <span className={styles.statSub}>Audit-logged community relief</span>
        </div>

        <div className={`${styles.statCard} ${styles.statCardAlert}`}>
          <div className={styles.statCardTop}>
            <span className={styles.statLabel} style={{ color: "#92400e" }}>
              Duplicate Overlaps Flagged
            </span>
            <AlertTriangle size={18} color="#D97706" />
          </div>
          <span className={styles.statValue} style={{ color: "#B45309" }}>
            {initialStats.flaggedDuplicatesCount}
          </span>
          <span className={styles.statSub} style={{ color: "#78350f" }}>
            Pre-grant duplicate alerts issued
          </span>
        </div>
      </div>

      {/* ─── Search & Filtering Controls ─────────────────────────── */}
      <div className={styles.searchSection}>
        <div className={styles.searchInputsRow}>
          <div className={styles.searchBox}>
            <Search size={18} color="#64748B" />
            <input
              type="text"
              placeholder="Search by Name (e.g. Ahmed Khan), Phone (9820011223), or ID (BEN-000101)..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value, selectedArea, selectedStatus)}
              className={styles.searchInput}
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <select
              className={styles.filterSelect}
              value={selectedArea}
              onChange={(e) => handleSearch(searchQuery, e.target.value, selectedStatus)}
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a === "ALL" ? "All Areas (Mumbai)" : a}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={selectedStatus}
              onChange={(e) => handleSearch(searchQuery, selectedArea, e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending Verification</option>
              <option value="UNVERIFIED">Unverified</option>
            </select>
          </div>
        </div>

        {isSearching && (
          <span style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600 }}>
            Querying centralized registry database...
          </span>
        )}
      </div>

      {/* ─── Beneficiaries Registry Table ────────────────────────── */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Beneficiary ID</th>
                <th>Full Name</th>
                <th>Contact & Location</th>
                <th>Family Size</th>
                <th>Identity Verification</th>
                <th>Cross-Org Assistance History</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
                    No beneficiaries found matching &quot;{searchQuery}&quot;. Try adjusting your search query or area filter.
                  </td>
                </tr>
              ) : (
                beneficiaries.map((b) => (
                  <tr key={b.id} className={styles.tableRow}>
                    <td>
                      <span className={styles.idBadge}>{b.beneficiaryId}</span>
                    </td>
                    <td>
                      <strong style={{ display: "block", color: "var(--color-text-main)" }}>
                        {b.name}
                      </strong>
                      {b.notes && (
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          {b.notes.length > 50 ? `${b.notes.substring(0, 50)}...` : b.notes}
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8125rem" }}>
                          <Phone size={12} color="#64748B" />
                          <span>{b.phone}</span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          <MapPin size={12} color="#64748B" />
                          <span>{b.area}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span>{b.familySize} members</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${
                          b.verificationStatus === "VERIFIED"
                            ? styles.statusVerified
                            : b.verificationStatus === "PENDING"
                            ? styles.statusPending
                            : styles.statusUnverified
                        }`}
                      >
                        {b.verificationStatus === "VERIFIED" && <CheckCircle2 size={12} />}
                        {b.verificationStatus === "PENDING" && <Clock size={12} />}
                        {b.verificationStatus}
                      </span>
                    </td>
                    <td>
                      {b.recordsCount > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span className={`${styles.historyBadge} ${styles.historyBadgeActive}`}>
                            {b.recordsCount} {b.recordsCount === 1 ? "grant" : "grants"} • {formatINR(b.totalAssistanceAmount)}
                          </span>
                          <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
                            {b.categoriesReceived.join(", ")}
                          </span>
                        </div>
                      ) : (
                        <span className={styles.historyBadge}>No Prior Aid</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href={`/admin/registry/${b.id}?orgId=${selectedOrgId}`}
                        className={styles.actionLink}
                      >
                        <span>Verify & Audit</span>
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal: Register Beneficiary ─────────────────────────── */}
      {showRegisterModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Register New Beneficiary</h3>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div className={styles.modalBody}>
                {registerSuccess && (
                  <div style={{ padding: "10px 14px", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, color: "#065f46", fontSize: "0.875rem" }}>
                    {registerSuccess}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yusuf Lakdawala"
                    className={styles.formInput}
                    value={newBeneficiary.name}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number e.g. 9820012345"
                    className={styles.formInput}
                    value={newBeneficiary.phone}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, phone: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Residential Area</label>
                    <select
                      className={styles.formSelect}
                      value={newBeneficiary.area}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, area: e.target.value })}
                    >
                      {AREAS.filter((a) => a !== "ALL").map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Family Size</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      className={styles.formInput}
                      value={newBeneficiary.familySize}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, familySize: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Verification Status</label>
                  <select
                    className={styles.formSelect}
                    value={newBeneficiary.verificationStatus}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, verificationStatus: e.target.value })}
                  >
                    <option value="VERIFIED">Verified (Documents Checked)</option>
                    <option value="PENDING">Pending Verification</option>
                    <option value="UNVERIFIED">Unverified Initial Intake</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Caseworker Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Household background, employment details, urgent needs..."
                    className={styles.formTextarea}
                    value={newBeneficiary.notes}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className={styles.filterSelect}
                  style={{ border: "1px solid var(--color-border)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className={styles.primaryBtn}
                >
                  {isRegistering ? "Saving..." : "Register Beneficiary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
