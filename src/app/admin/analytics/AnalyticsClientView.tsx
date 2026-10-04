"use client";

import React, { useState } from "react";
import {
  Users,
  IndianRupee,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  HeartPulse,
  Briefcase,
  ChevronDown,
  ChevronUp,
  MapPin,
  FileCode2,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  AnalyticsDataset,
  formatINR,
  formatINRFull,
  formatNumber,
} from "@/lib/data/analytics-demo";
import styles from "./analytics.module.css";

interface Props {
  initialData: AnalyticsDataset;
}

type TimeframeOption = "all" | "year" | "6m" | "month";
type TrendGranularity = "monthly" | "quarterly" | "annual";
type TrendMetric = "amount" | "beneficiaries" | "dual";
type CategorySortMetric = "amount" | "beneficiaries";

export default function AnalyticsClientView({ initialData }: Props) {
  // Global filter state
  const [timeframe, setTimeframe] = useState<TimeframeOption>("all");
  
  // Chart interaction states
  const [trendGranularity, setTrendGranularity] = useState<TrendGranularity>("monthly");
  const [trendMetric, setTrendMetric] = useState<TrendMetric>("amount");
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);
  
  const [hoveredCategoryCode, setHoveredCategoryCode] = useState<string | null>(null);
  const [categorySortMetric, setCategorySortMetric] = useState<CategorySortMetric>("amount");
  
  const [showArchBlueprint, setShowArchBlueprint] = useState(false);

  const {
    disclaimer,
    kpis,
    categories,
    scholarships,
    medical,
    financialAndHousing,
    trends,
    quarterlyTrends,
    annualComparison,
    areas,
    insights,
  } = initialData;

  // Active KPI computations based on timeframe
  const displayBeneficiaries =
    timeframe === "month"
      ? kpis.thisMonthBeneficiaries
      : timeframe === "year"
      ? kpis.thisYearBeneficiaries
      : timeframe === "6m"
      ? 1552
      : kpis.totalBeneficiaries;

  const displayAmount =
    timeframe === "month"
      ? kpis.thisMonthAmount
      : timeframe === "year"
      ? kpis.thisYearAmount
      : timeframe === "6m"
      ? 12390000
      : kpis.totalAssistanceAmount;

  // ─── 1. Donut Chart Math ──────────────────────────────────────────
  const donutRadius = 68;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedDonutPct = 0;

  const activeHoverCategory = categories.find((c) => c.code === hoveredCategoryCode);

  // ─── 2. Sorted Categories for Horizontal Comparison Bar Chart ─────
  const sortedCategories = [...categories].sort((a, b) =>
    categorySortMetric === "amount" ? b.amount - a.amount : b.beneficiariesCount - a.beneficiariesCount
  );
  const maxCategoryMetric =
    categorySortMetric === "amount"
      ? Math.max(...categories.map((c) => c.amount))
      : Math.max(...categories.map((c) => c.beneficiariesCount));

  // ─── 3. Time Series Data Processing ───────────────────────────────
  const activeTrendData =
    trendGranularity === "monthly"
      ? trends.map((t) => ({
          label: t.monthShort,
          fullLabel: t.month,
          amount: t.amount,
          beneficiaries: t.beneficiaries,
          detail: `Edu: ${formatINR(t.scholarshipsAmount)} | Med: ${formatINR(t.medicalAmount)}`,
          isPeak: t.isPeak,
        }))
      : trendGranularity === "quarterly"
      ? quarterlyTrends.map((q) => ({
          label: q.quarterShort,
          fullLabel: q.quarter,
          amount: q.amount,
          beneficiaries: q.beneficiaries,
          detail: `Prior Year: ${formatINR(q.priorYearAmount)} (+${q.growthPct}%)`,
          isPeak: false,
        }))
      : annualComparison.map((a) => ({
          label: a.label,
          fullLabel: a.label,
          amount: a.totalAmount,
          beneficiaries: a.totalBeneficiaries,
          detail: `Edu: ${formatINR(a.scholarshipsAmount)} | Med: ${formatINR(a.medicalAmount)}`,
          isPeak: false,
        }));

  const maxTrendAmount = Math.max(...activeTrendData.map((d) => d.amount));
  const maxTrendBeneficiaries = Math.max(...activeTrendData.map((d) => d.beneficiaries));

  // SVG dimensions for Time Series Chart
  const svgWidth = 720;
  const svgHeight = 220;
  const chartPadLeft = 45;
  const chartPadRight = 35;
  const chartPadTop = 25;
  const chartPadBottom = 35;
  const plotWidth = svgWidth - chartPadLeft - chartPadRight;
  const plotHeight = svgHeight - chartPadTop - chartPadBottom;

  // Active hovered trend item
  const currentHoveredTrend = hoveredTrendIdx !== null ? activeTrendData[hoveredTrendIdx] : null;

  return (
    <div className={styles.container}>
      {/* ─── Page Header & Demo Disclaimer ──────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>Community Impact & Assistance Analytics</h1>
            <p className={styles.subtitle}>
              Executive visual intelligence on Jamaat welfare disbursements, scholarship impact,
              emergency healthcare subsidies, and regional assistance demand.
            </p>
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className={styles.demoBanner}>
          <AlertCircle size={20} className={styles.demoBannerIcon} />
          <div className={styles.demoBannerContent}>
            <div className={styles.demoBannerTitle}>
              <span>{disclaimer}</span>
              <span className={styles.demoBadge}>Demo Preview</span>
            </div>
            <p className={styles.demoBannerText}>
              Historical Jamaat assistance records are currently undergoing digitization and verification.
              The numbers displayed below are internally consistent illustrative figures engineered to demonstrate
              the full reporting, visualization, and strategic audit capabilities for Jamaat trustees and administrators.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Timeframe & Scope Controls ─────────────────────────── */}
      <div className={styles.controlsBar}>
        <div className={styles.timeframeTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${timeframe === "all" ? styles.tabBtnActive : ""}`}
            onClick={() => setTimeframe("all")}
          >
            All-Time (Cumulative)
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${timeframe === "year" ? styles.tabBtnActive : ""}`}
            onClick={() => setTimeframe("year")}
          >
            Year 2026 (YTD)
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${timeframe === "6m" ? styles.tabBtnActive : ""}`}
            onClick={() => setTimeframe("6m")}
          >
            Last 6 Months
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${timeframe === "month" ? styles.tabBtnActive : ""}`}
            onClick={() => setTimeframe("month")}
          >
            Current Month (October)
          </button>
        </div>

        <div className={styles.controlsMeta}>
          <span className={styles.controlsMetaDot} />
          <span>Reporting Currency: <strong>INR (₹)</strong></span>
          <span>•</span>
          <span>Centralized Registry: <strong>Active</strong></span>
        </div>
      </div>

      {/* ─── 1. CORE HEADLINE IMPACT KPIS ───────────────────────── */}
      <section aria-label="Core Impact Metrics">
        <div className={styles.kpiGrid}>
          {/* Card 1: Total Beneficiaries */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiCardAccent} />
            <div className={styles.kpiCardHeader}>
              <div
                className={styles.kpiIconWrapper}
                style={{ backgroundColor: "rgba(11, 81, 51, 0.1)", color: "#0B5133" }}
              >
                <Users size={20} />
              </div>
              <span className={`${styles.kpiBadge} ${styles.kpiBadgePositive}`}>
                <TrendingUp size={12} />
                +{kpis.yoyGrowthPct}% YoY
              </span>
            </div>
            <div className={styles.kpiValueRow}>
              <span className={styles.kpiValue}>{formatNumber(displayBeneficiaries)}</span>
              <span className={styles.kpiLabel}>
                {timeframe === "all"
                  ? "Total Beneficiaries Supported"
                  : timeframe === "year"
                  ? "Beneficiaries in 2026 (YTD)"
                  : timeframe === "month"
                  ? "Beneficiaries This Month"
                  : "Beneficiaries (Last 6 Months)"}
              </span>
            </div>
            <div className={styles.kpiSubtext}>
              {timeframe === "all"
                ? "Unique individuals and families assisted across all programs"
                : "Active beneficiaries approved in this reporting period"}
            </div>
          </div>

          {/* Card 2: Total Assistance Amount */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiCardAccent} />
            <div className={styles.kpiCardHeader}>
              <div
                className={styles.kpiIconWrapper}
                style={{ backgroundColor: "rgba(2, 132, 199, 0.1)", color: "#0284C7" }}
              >
                <IndianRupee size={20} />
              </div>
              <span className={`${styles.kpiBadge} ${styles.kpiBadgePositive}`}>
                Disbursed
              </span>
            </div>
            <div className={styles.kpiValueRow}>
              <span className={styles.kpiValue}>{formatINR(displayAmount)}</span>
              <span className={styles.kpiLabel}>
                {timeframe === "all"
                  ? "Total Assistance Disbursed"
                  : timeframe === "year"
                  ? "Assistance Disbursed in 2026"
                  : timeframe === "month"
                  ? "Assistance Disbursed This Month"
                  : "Assistance Disbursed (6 Months)"}
              </span>
            </div>
            <div className={styles.kpiSubtext}>
              Full value: {formatINRFull(displayAmount)}
            </div>
          </div>

          {/* Card 3: Year 2026 YTD */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiCardHeader}>
              <div
                className={styles.kpiIconWrapper}
                style={{ backgroundColor: "rgba(217, 119, 6, 0.1)", color: "#D97706" }}
              >
                <Calendar size={20} />
              </div>
              <span className={`${styles.kpiBadge} ${styles.kpiBadgePositive}`}>
                69.1% of All-Time
              </span>
            </div>
            <div className={styles.kpiValueRow}>
              <span className={styles.kpiValue}>{formatINR(kpis.thisYearAmount)}</span>
              <span className={styles.kpiLabel}>Current Calendar Year (2026)</span>
            </div>
            <div className={styles.kpiSubtext}>
              {formatNumber(kpis.thisYearBeneficiaries)} families assisted across 10 months
            </div>
          </div>

          {/* Card 4: This Month */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiCardHeader}>
              <div
                className={styles.kpiIconWrapper}
                style={{ backgroundColor: "rgba(124, 58, 237, 0.1)", color: "#7C3AED" }}
              >
                <Clock size={20} />
              </div>
              <span className={`${styles.kpiBadge} ${styles.kpiBadgePositive}`}>
                +{kpis.momGrowthPct}% MoM
              </span>
            </div>
            <div className={styles.kpiValueRow}>
              <span className={styles.kpiValue}>{formatINR(kpis.thisMonthAmount)}</span>
              <span className={styles.kpiLabel}>This Month (October 2026)</span>
            </div>
            <div className={styles.kpiSubtext}>
              {formatNumber(kpis.thisMonthBeneficiaries)} approved grants cleared
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. HERO INTERACTIVE TIME-SERIES VISUALIZATION ───────── */}
      <section className={styles.sectionCard} aria-labelledby="hero-trends-heading">
        <div className={styles.sectionHeaderRow}>
          <div className={styles.sectionTitleGroup}>
            <h2 id="hero-trends-heading" className={styles.sectionHeading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={22} color="#0B5133" />
              Assistance & Beneficiary Trajectory Over Time
            </h2>
            <p className={styles.sectionSubheading}>
              Dynamic time-series tracking total disbursed capital against community beneficiary volume.
            </p>
          </div>

          <div className={styles.headerActions}>
            {/* Granularity Switcher */}
            <div className={styles.togglePillGroup}>
              <button
                type="button"
                className={`${styles.togglePillBtn} ${trendGranularity === "monthly" ? styles.togglePillBtnActive : ""}`}
                onClick={() => setTrendGranularity("monthly")}
              >
                Monthly (6M)
              </button>
              <button
                type="button"
                className={`${styles.togglePillBtn} ${trendGranularity === "quarterly" ? styles.togglePillBtnActive : ""}`}
                onClick={() => setTrendGranularity("quarterly")}
              >
                Quarterly (YoY)
              </button>
              <button
                type="button"
                className={`${styles.togglePillBtn} ${trendGranularity === "annual" ? styles.togglePillBtnActive : ""}`}
                onClick={() => setTrendGranularity("annual")}
              >
                Annual Comp
              </button>
            </div>

            {/* Metric Mode Switcher */}
            <div className={styles.togglePillGroup}>
              <button
                type="button"
                className={`${styles.togglePillBtn} ${trendMetric === "amount" ? styles.togglePillBtnActive : ""}`}
                onClick={() => setTrendMetric("amount")}
              >
                Amount (₹)
              </button>
              <button
                type="button"
                className={`${styles.togglePillBtn} ${trendMetric === "beneficiaries" ? styles.togglePillBtnActive : ""}`}
                onClick={() => setTrendMetric("beneficiaries")}
              >
                People
              </button>
              <button
                type="button"
                className={`${styles.togglePillBtn} ${trendMetric === "dual" ? styles.togglePillBtnActive : ""}`}
                onClick={() => setTrendMetric("dual")}
              >
                Dual View
              </button>
            </div>
          </div>
        </div>

        {/* SVG Time-Series Chart */}
        <div className={styles.chartBox}>
          <div className={styles.svgChartContainer}>
            {/* Floating Tooltip */}
            {currentHoveredTrend && (
              <div className={styles.chartTooltipCard}>
                <span className={styles.chartTooltipTitle}>{currentHoveredTrend.fullLabel}</span>
                <div className={styles.chartTooltipRow}>
                  <span style={{ color: "#94a3b8" }}>Assistance:</span>
                  <strong>{formatINR(currentHoveredTrend.amount)}</strong>
                </div>
                <div className={styles.chartTooltipRow}>
                  <span style={{ color: "#94a3b8" }}>Beneficiaries:</span>
                  <strong>{formatNumber(currentHoveredTrend.beneficiaries)} people</strong>
                </div>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", marginTop: 2, borderTop: "1px dashed #334155", paddingTop: 4 }}>
                  {currentHoveredTrend.detail}
                </div>
              </div>
            )}

            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className={styles.svgResponsive}
              preserveAspectRatio="none"
            >
              <defs>
                {/* Column gradient */}
                <linearGradient id="columnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B5133" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#083C26" stopOpacity="0.75" />
                </linearGradient>
                {/* Column hover gradient */}
                <linearGradient id="columnGradHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0B5133" stopOpacity="0.9" />
                </linearGradient>
                {/* Peak Column gradient */}
                <linearGradient id="peakColumnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
                </linearGradient>
                {/* Area line gradient */}
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = chartPadTop + plotHeight * (1 - pct);
                const labelVal =
                  trendMetric === "beneficiaries"
                    ? Math.round(maxTrendBeneficiaries * pct)
                    : formatINR(maxTrendAmount * pct);
                return (
                  <g key={idx}>
                    <line
                      x1={chartPadLeft}
                      y1={y}
                      x2={svgWidth - chartPadRight}
                      y2={y}
                      className={styles.chartGridLine}
                    />
                    <text
                      x={chartPadLeft - 8}
                      y={y + 4}
                      textAnchor="end"
                      className={styles.chartAxisText}
                    >
                      {labelVal}
                    </text>
                  </g>
                );
              })}

              {/* Render Columns (Assistance Amount) */}
              {(trendMetric === "amount" || trendMetric === "dual") &&
                activeTrendData.map((d, idx) => {
                  const numPoints = activeTrendData.length;
                  const colWidth = Math.min(plotWidth / numPoints - 18, 48);
                  const step = plotWidth / numPoints;
                  const xCenter = chartPadLeft + step * idx + step / 2;
                  const x = xCenter - colWidth / 2;
                  const height = (d.amount / maxTrendAmount) * plotHeight;
                  const y = chartPadTop + plotHeight - height;
                  const isHovered = hoveredTrendIdx === idx;

                  return (
                    <g
                      key={`col-${idx}`}
                      className={styles.chartInteractiveColumn}
                      onMouseEnter={() => setHoveredTrendIdx(idx)}
                      onMouseLeave={() => setHoveredTrendIdx(null)}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={colWidth}
                        height={height}
                        rx={4}
                        fill={
                          d.isPeak
                            ? "url(#peakColumnGrad)"
                            : isHovered
                            ? "url(#columnGradHover)"
                            : "url(#columnGrad)"
                        }
                      />
                      {/* Peak indicator tag on June/July */}
                      {d.isPeak && (
                        <text
                          x={xCenter}
                          y={y - 6}
                          textAnchor="middle"
                          fill="#D97706"
                          fontSize="9"
                          fontWeight="700"
                        >
                          PEAK
                        </text>
                      )}
                    </g>
                  );
                })}

              {/* Render Beneficiaries Curve / Points (Dual or Beneficiaries view) */}
              {(trendMetric === "beneficiaries" || trendMetric === "dual") && (
                <g>
                  {/* Build SVG Path */}
                  {(() => {
                    const numPoints = activeTrendData.length;
                    const step = plotWidth / numPoints;
                    const points = activeTrendData.map((d, idx) => {
                      const x = chartPadLeft + step * idx + step / 2;
                      const height = (d.beneficiaries / maxTrendBeneficiaries) * plotHeight;
                      const y = chartPadTop + plotHeight - height;
                      return { x, y };
                    });

                    // Build SVG path string with smooth bezier or line
                    const pathD = points.reduce((acc, pt, idx, arr) => {
                      if (idx === 0) return `M ${pt.x},${pt.y}`;
                      const prev = arr[idx - 1];
                      const cpX1 = prev.x + (pt.x - prev.x) / 2;
                      const cpX2 = cpX1;
                      return `${acc} C ${cpX1},${prev.y} ${cpX2},${pt.y} ${pt.x},${pt.y}`;
                    }, "");

                    const areaD = `${pathD} L ${points[points.length - 1].x},${
                      chartPadTop + plotHeight
                    } L ${points[0].x},${chartPadTop + plotHeight} Z`;

                    return (
                      <>
                        {trendMetric === "beneficiaries" && (
                          <path d={areaD} fill="url(#areaGrad)" />
                        )}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={trendMetric === "dual" ? "#D97706" : "#0284C7"}
                          strokeWidth={2.5}
                        />
                        {points.map((pt, idx) => (
                          <circle
                            key={`pt-${idx}`}
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredTrendIdx === idx ? 6 : 4}
                            fill="#FFFFFF"
                            stroke={trendMetric === "dual" ? "#D97706" : "#0284C7"}
                            strokeWidth={hoveredTrendIdx === idx ? 2.5 : 2}
                            className={styles.chartLinePoint}
                            onMouseEnter={() => setHoveredTrendIdx(idx)}
                            onMouseLeave={() => setHoveredTrendIdx(null)}
                          />
                        ))}
                      </>
                    );
                  })()}
                </g>
              )}

              {/* X-Axis Labels */}
              {activeTrendData.map((d, idx) => {
                const numPoints = activeTrendData.length;
                const step = plotWidth / numPoints;
                const xCenter = chartPadLeft + step * idx + step / 2;
                const y = chartPadTop + plotHeight + 18;
                const isHovered = hoveredTrendIdx === idx;

                return (
                  <text
                    key={`lbl-${idx}`}
                    x={xCenter}
                    y={y}
                    textAnchor="middle"
                    className={styles.chartAxisText}
                    fontWeight={isHovered ? "700" : "500"}
                    fill={isHovered ? "#0F172A" : "#64748B"}
                  >
                    {d.label}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Chart Legend & Context */}
          <div className={styles.chartLegendRow}>
            <div className={styles.chartLegendItems}>
              {(trendMetric === "amount" || trendMetric === "dual") && (
                <div className={styles.chartLegendItem}>
                  <span
                    className={styles.legendColorIndicator}
                    style={{ backgroundColor: "#0B5133" }}
                  />
                  <span>Assistance Disbursed (INR)</span>
                </div>
              )}
              {(trendMetric === "beneficiaries" || trendMetric === "dual") && (
                <div className={styles.chartLegendItem}>
                  <span
                    className={styles.legendLineIndicator}
                    style={{
                      backgroundColor: trendMetric === "dual" ? "#D97706" : "#0284C7",
                    }}
                  />
                  <span>Beneficiaries Served</span>
                </div>
              )}
            </div>

            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              {trendGranularity === "monthly"
                ? "Academic admissions cycle drives peak disbursement in June & July"
                : trendGranularity === "quarterly"
                ? "Comparing 2026 Quarters against 2025 Benchmarks"
                : "Full calendar year expansion: +14.2% YoY"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── 3. CATEGORY DISTRIBUTION (DONUT & HORIZONTAL COMPARISON) ─ */}
      <div className={styles.twoColGrid}>
        {/* Left: Donut Chart (% Distribution) */}
        <section className={styles.sectionCard} aria-labelledby="donut-heading">
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionTitleGroup}>
              <h2 id="donut-heading" className={styles.sectionHeading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PieIcon size={20} color="#0B5133" />
                Category Assistance Distribution
              </h2>
              <p className={styles.sectionSubheading}>
                Percentage share of total welfare capital allocated by committee portfolio.
              </p>
            </div>
            <span className={styles.sectionTag}>5 Portfolios</span>
          </div>

          <div className={styles.donutWrapper}>
            {/* SVG Donut Visualizer */}
            <div className={styles.donutSvgArea}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <g transform="rotate(-90 100 100)">
                  {categories.map((cat) => {
                    const sliceLength = (cat.percentage / 100) * donutCircumference;
                    const strokeDashoffset = -accumulatedDonutPct;
                    accumulatedDonutPct += sliceLength;
                    const isHovered = hoveredCategoryCode === cat.code;

                    return (
                      <circle
                        key={cat.code}
                        cx="100"
                        cy="100"
                        r={donutRadius}
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth={isHovered ? 24 : 18}
                        strokeDasharray={`${sliceLength} ${donutCircumference}`}
                        strokeDashoffset={strokeDashoffset}
                        className={styles.donutSlice}
                        onMouseEnter={() => setHoveredCategoryCode(cat.code)}
                        onMouseLeave={() => setHoveredCategoryCode(null)}
                      />
                    );
                  })}
                </g>
              </svg>

              {/* Center Readout */}
              <div className={styles.donutCenterLabel}>
                {activeHoverCategory ? (
                  <>
                    <span className={styles.donutCenterValue}>
                      {activeHoverCategory.percentage}%
                    </span>
                    <span className={styles.donutCenterSub}>
                      {formatINR(activeHoverCategory.amount)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={styles.donutCenterValue}>
                      {formatINR(kpis.totalAssistanceAmount)}
                    </span>
                    <span className={styles.donutCenterSub}>100% Disbursed</span>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Legend List */}
            <div className={styles.donutLegendList}>
              {categories.map((cat) => {
                const isActive = hoveredCategoryCode === cat.code;
                return (
                  <div
                    key={cat.code}
                    className={`${styles.donutLegendRow} ${
                      isActive ? styles.donutLegendRowActive : ""
                    }`}
                    onMouseEnter={() => setHoveredCategoryCode(cat.code)}
                    onMouseLeave={() => setHoveredCategoryCode(null)}
                  >
                    <div className={styles.donutLegendLeft}>
                      <span
                        className={styles.donutLegendDot}
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.category}</span>
                    </div>
                    <div className={styles.donutLegendRight}>
                      <span>{cat.percentage}%</span>
                      <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                        ({formatINR(cat.amount)})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right: Horizontal Category Comparison Bar Chart */}
        <section className={styles.sectionCard} aria-labelledby="cat-comparison-heading">
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionTitleGroup}>
              <h2 id="cat-comparison-heading" className={styles.sectionHeading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarChart3 size={20} color="#0B5133" />
                Category Portfolio Comparison
              </h2>
              <p className={styles.sectionSubheading}>
                Ranking welfare categories by funding volume vs. human reach.
              </p>
            </div>

            {/* Metric Toggle */}
            <div className={styles.togglePillGroup}>
              <button
                type="button"
                className={`${styles.togglePillBtn} ${categorySortMetric === "amount" ? styles.togglePillBtnActive : ""}`}
                onClick={() => setCategorySortMetric("amount")}
              >
                Sort: Funding (₹)
              </button>
              <button
                type="button"
                className={`${styles.togglePillBtn} ${categorySortMetric === "beneficiaries" ? styles.togglePillBtnActive : ""}`}
                onClick={() => setCategorySortMetric("beneficiaries")}
              >
                Sort: Beneficiaries
              </button>
            </div>
          </div>

          {/* Horizontal Comparison Bars */}
          <div className={styles.horizontalBarChart}>
            {sortedCategories.map((cat) => {
              const metricValue =
                categorySortMetric === "amount" ? cat.amount : cat.beneficiariesCount;
              const fillPct = Math.round((metricValue / maxCategoryMetric) * 100);

              return (
                <div key={cat.code} className={styles.horizontalBarItem}>
                  <div className={styles.barMetaRow}>
                    <div className={styles.barLabelGroup}>
                      <span
                        className={styles.donutLegendDot}
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.category}</span>
                    </div>
                    <div className={styles.barValueGroup}>
                      <span className={styles.barPrimaryValue}>
                        {categorySortMetric === "amount"
                          ? formatINR(cat.amount)
                          : `${formatNumber(cat.beneficiariesCount)} people`}
                      </span>
                      <span className={styles.barSecondaryValue}>
                        {categorySortMetric === "amount"
                          ? `(${formatNumber(cat.beneficiariesCount)} people)`
                          : `(${formatINR(cat.amount)})`}
                      </span>
                    </div>
                  </div>

                  <div className={styles.barTrackBg}>
                    <div
                      className={styles.barTrackFill}
                      style={{
                        width: `${fillPct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
                    <span>Avg / case: {formatINRFull(cat.avgPerPerson)}</span>
                    <span style={{ fontWeight: 600, color: cat.color }}>{cat.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ─── 4. SCHOLARSHIP & HEALTHCARE VISUAL DEEP-DIVES ───────── */}
      <div className={styles.twoColGrid}>
        {/* Left: Scholarship Analysis Visualizer */}
        <section className={styles.sectionCard} aria-labelledby="scholar-visual-heading">
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionTitleGroup}>
              <h2 id="scholar-visual-heading" className={styles.sectionHeading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GraduationCap size={22} color="#0B5133" />
                Scholarship & Educational Reach
              </h2>
              <p className={styles.sectionSubheading}>
                Multi-tier academic aid distribution and degree discipline concentration.
              </p>
            </div>
            <span className={styles.sectionTag}>₹64.12 L Disbursed</span>
          </div>

          <div className={styles.scholarVisualContainer}>
            {/* Supporting Micro-KPI Chips */}
            <div className={styles.chipsBanner}>
              <div className={styles.chipItem}>
                <span>Students:</span>
                <strong>{scholarships.totalStudents}</strong>
              </div>
              <span>•</span>
              <div className={styles.chipItem}>
                <span>Avg Scholarship:</span>
                <strong>{formatINRFull(scholarships.avgPerStudent)}</strong>
              </div>
              <span>•</span>
              <div className={styles.chipItem}>
                <span>Institutions:</span>
                <strong>{scholarships.institutionsCount}</strong>
              </div>
            </div>

            {/* Academic Tier Composition Bar */}
            <div>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
                Assistance Allocation by Academic Tier
              </span>
              <div className={styles.tierCompositionBar} role="img" aria-label="Tier Composition Bar">
                {scholarships.tiers.map((t, idx) => (
                  <div
                    key={t.tier}
                    className={styles.tierSegment}
                    style={{
                      width: `${t.percentageOfScholarships}%`,
                      backgroundColor: idx === 0 ? "#0B5133" : idx === 1 ? "#059669" : "#34D399",
                    }}
                    title={`${t.tier}: ${formatINR(t.amount)} (${t.studentsCount} scholars)`}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "var(--color-text-muted)", marginTop: 6, flexWrap: "wrap", gap: 4 }}>
                <span>Degrees (65.5% \| ₹42.0 L)</span>
                <span>Schools (22.6% \| ₹14.5 L)</span>
                <span>Skills (11.9% \| ₹7.6 L)</span>
              </div>
            </div>

            {/* Ranked Degree Disciplines Horizontal Bars */}
            <div>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }}>
                Ranked Academic Disciplines Supported
              </span>
              <div className={styles.rankedRankList}>
                {scholarships.topDisciplines.map((d) => (
                  <div key={d.name} className={styles.rankedRow}>
                    <span className={styles.rankedLabel}>{d.name}</span>
                    <div className={styles.rankedBarContainer}>
                      <div
                        className={styles.rankedBarFill}
                        style={{ width: `${d.percentage * 2.8}%` }}
                      />
                    </div>
                    <span className={styles.rankedScore}>
                      {d.percentage}% ({d.students})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Healthcare & Livelihood Relief Visualizer */}
        <section className={styles.sectionCard} aria-labelledby="healthcare-visual-heading">
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionTitleGroup}>
              <h2 id="healthcare-visual-heading" className={styles.sectionHeading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <HeartPulse size={22} color="#0284C7" />
                Medical & Livelihood Relief
              </h2>
              <p className={styles.sectionSubheading}>
                Breakdown of critical medical interventions, micro-enterprise seed capital, and shelter security.
              </p>
            </div>
            <span className={styles.sectionTag}>800+ Families Shielded</span>
          </div>

          <div className={styles.healthcareGrid}>
            {/* Medical Procedures Composition Bar */}
            <div className={styles.stackedProcedureCard}>
              <div className={styles.stackedProcedureHeader}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#0284C7" }}>
                  <HeartPulse size={16} />
                  Medical Relief Interventions
                </span>
                <span style={{ color: "var(--color-text-main)" }}>
                  {formatINR(medical.totalAmount)} ({medical.totalPatients} patients)
                </span>
              </div>

              <div className={styles.stackedProcedureBar} role="img" aria-label="Medical Subcategories Bar">
                {medical.subcategories.map((sub, idx) => (
                  <div
                    key={sub.type}
                    style={{
                      width: `${sub.percentage}%`,
                      backgroundColor: idx === 0 ? "#0284C7" : idx === 1 ? "#38BDF8" : "#BAE6FD",
                    }}
                    title={`${sub.type}: ${formatINR(sub.amount)} (${sub.patientsCount} patients)`}
                  />
                ))}
              </div>

              <div className={styles.stackedProcedureLegend}>
                <span>• Surgeries: 60% ({formatINR(medical.subcategories[0].amount)})</span>
                <span>• Dialysis & Chronic: 30% ({formatINR(medical.subcategories[1].amount)})</span>
                <span>• Diagnostics: 10% ({formatINR(medical.subcategories[2].amount)})</span>
              </div>
            </div>

            {/* Micro-Enterprise & Housing Comparative Progress */}
            <div className={styles.horizontalBarChart}>
              <div className={styles.horizontalBarItem}>
                <div className={styles.barMetaRow}>
                  <div className={styles.barLabelGroup}>
                    <Briefcase size={16} color="#D97706" />
                    <span>Micro-Enterprise Seed Grants</span>
                  </div>
                  <div className={styles.barValueGroup}>
                    <span className={styles.barPrimaryValue}>
                      {formatINR(financialAndHousing.microEnterpriseAmount)}
                    </span>
                    <span className={styles.barSecondaryValue}>
                      ({financialAndHousing.microEnterpriseRecipients} businesses)
                    </span>
                  </div>
                </div>
                <div className={styles.barTrackBg}>
                  <div
                    className={styles.barTrackFill}
                    style={{ width: "70%", backgroundColor: "#D97706" }}
                  />
                </div>
                <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
                  Tools, inventory, and equipment funding for self-reliant livelihoods
                </span>
              </div>

              <div className={styles.horizontalBarItem}>
                <div className={styles.barMetaRow}>
                  <div className={styles.barLabelGroup}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#7C3AED" }} />
                    <span>Housing Repair & Rental Relief</span>
                  </div>
                  <div className={styles.barValueGroup}>
                    <span className={styles.barPrimaryValue}>
                      {formatINR(financialAndHousing.housingReliefAmount)}
                    </span>
                    <span className={styles.barSecondaryValue}>
                      ({financialAndHousing.housingRecipients} families)
                    </span>
                  </div>
                </div>
                <div className={styles.barTrackBg}>
                  <div
                    className={styles.barTrackFill}
                    style={{ width: "55%", backgroundColor: "#7C3AED" }}
                  />
                </div>
                <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
                  Emergency rent arrears clearance and monsoon roof waterproofing
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── 5. GEOGRAPHIC ASSISTANCE DEMAND CHART ───────────────── */}
      <section className={styles.sectionCard} aria-labelledby="geographic-chart-heading">
        <div className={styles.sectionHeaderRow}>
          <div className={styles.sectionTitleGroup}>
            <h2 id="geographic-chart-heading" className={styles.sectionHeading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={22} color="#0B5133" />
              Geographic Assistance Distribution (Mumbai Clusters)
            </h2>
            <p className={styles.sectionSubheading}>
              Regional concentration of community beneficiaries and funding disbursement across Mumbai residential clusters.
            </p>
          </div>
          <span className={styles.sectionTag}>Top: Dongri & Kurla (66%)</span>
        </div>

        {/* Ranked Horizontal Area Distribution Bars */}
        <div className={styles.areaChartWrapper}>
          {areas.map((a) => (
            <div key={a.area} className={styles.areaBarRow}>
              <div className={styles.areaBarHeader}>
                <div className={styles.areaBarLeft}>
                  <MapPin size={16} color="#0B5133" />
                  <span>{a.area}</span>
                  <span style={{ fontSize: "0.6875rem", color: "#64748b", backgroundColor: "#f1f5f9", padding: "1px 6px", borderRadius: 4 }}>
                    {a.zone} Zone
                  </span>
                </div>
                <div className={styles.areaBarRight}>
                  <strong>{formatINR(a.amount)}</strong>
                  <span>({a.percentage}% Share)</span>
                  <span>•</span>
                  <span>{formatNumber(a.beneficiaries)} beneficiaries</span>
                </div>
              </div>

              <div className={styles.areaBarTrack}>
                <div
                  className={styles.areaBarFill}
                  style={{ width: `${a.percentage * 2.2}%` }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
                <span>Primary Community Request: <strong>{a.topCategory}</strong></span>
                <span>Avg assistance: {formatINRFull(Math.round(a.amount / a.beneficiaries))} / case</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. KEY STRATEGIC INSIGHTS ───────────────────────────── */}
      <section className={styles.sectionCard} aria-labelledby="insights-heading">
        <div className={styles.sectionHeaderRow}>
          <div className={styles.sectionTitleGroup}>
            <h2 id="insights-heading" className={styles.sectionHeading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={22} color="#D97706" />
              Key Executive Insights & Strategic Observations
            </h2>
            <p className={styles.sectionSubheading}>
              Data-backed patterns and actionable policy recommendations for KSIJ administrative leadership.
            </p>
          </div>
          <span className={styles.sectionTag}>Audit Summary</span>
        </div>

        <div className={styles.insightsGrid}>
          {insights.map((ins) => (
            <div key={ins.id} className={styles.insightCard}>
              <div>
                <div className={styles.insightCardHeader}>
                  <span className={styles.insightTitle}>{ins.title}</span>
                  <span className={styles.insightMetricBadge}>{ins.highlightMetric}</span>
                </div>
                <p className={styles.insightObservation}>{ins.observation}</p>
              </div>

              <div className={styles.insightRecBox}>
                <span className={styles.insightRecLabel}>Administrative Action</span>
                <span>{ins.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. FUTURE DATA ARCHITECTURE BLUEPRINT ───────────────── */}
      <section className={styles.futureArchCard}>
        <div
          className={styles.futureArchHeader}
          onClick={() => setShowArchBlueprint(!showArchBlueprint)}
          role="button"
          tabIndex={0}
          aria-expanded={showArchBlueprint}
        >
          <div className={styles.futureArchTitleGroup}>
            <FileCode2 size={20} color="#0B5133" />
            <div>
              <span className={styles.futureArchTitle}>
                Future Database Architecture Blueprint (Prisma Schema)
              </span>
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", margin: 0 }}>
                Click to inspect the proposed database model structure required for live real-time queries.
              </p>
            </div>
          </div>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
            }}
          >
            {showArchBlueprint ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {showArchBlueprint && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              This Analytics module was built using a decoupled architecture. Currently,{" "}
              <code>src/lib/actions/analytics.ts</code> serves internally consistent demo figures.
              When Jamaat digitization is ready to commit historical assistance data, add the following model to{" "}
              <code>prisma/schema.prisma</code>:
            </p>
            <pre className={styles.codeSnippet}>
{`// Proposed Prisma Schema Model for Real Assistance Analytics
model AssistanceRecord {
  id                    String    @id @default(cuid())
  beneficiaryReference  String    // e.g. "KS-BEN-2026-0842"
  beneficiaryId         String?   // Relation to User model
  beneficiary           User?     @relation(fields: [beneficiaryId], references: [id])
  serviceId             String?   // Relation to Service model
  service               Service?  @relation(fields: [serviceId], references: [id])
  
  category              String    // "SCHOLARSHIP", "MEDICAL", "FINANCIAL", "HOUSING", "WELFARE"
  subCategory           String?   // "DEGREE_TUITION", "EMERGENCY_SURGERY", "MICRO_ENTERPRISE", etc.
  amount                Float     // Disbursed INR amount
  disbursedAt           DateTime  // Timestamp of grant disbursement
  status                String    @default("DISBURSED") // PENDING, APPROVED, DISBURSED, REJECTED
  
  // Geographic tracking
  area                  String    // "Dongri", "Kurla", "Govandi", "Mira Road", etc.
  zone                  String?   // "South", "Central", "East", "West"
  
  // Optional Academic & Medical details
  academicYear          String?   // e.g. "2026-2027"
  institution           String?   // College or school name
  course                String?   // Degree or stream
  hospitalName          String?   // Hospital for direct medical settlement
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([category, status])
  @@index([disbursedAt])
  @@index([area])
}`}
            </pre>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Once migrated, <code>getAnalyticsData()</code> in <code>src/lib/actions/analytics.ts</code> can replace demo calculations with <code>prisma.assistanceRecord.aggregate()</code> and <code>prisma.assistanceRecord.groupBy()</code> without modifying this page component.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
