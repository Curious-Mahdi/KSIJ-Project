/**
 * Analytics Demo Data & Type Definitions
 * 
 * NOTE: Historical assistance records are currently being digitized by the Jamaat administration.
 * The figures provided here are clearly labeled illustrative demo figures designed with strict
 * internal consistency across all KPIs, charts, categories, and monthly breakdowns.
 * 
 * When the database model `AssistanceRecord` is migrated, this structure will map 1:1 to
 * the real database aggregations.
 */

export interface ImpactKPIs {
  totalBeneficiaries: number;
  totalAssistanceAmount: number;
  thisYearAmount: number;
  thisYearBeneficiaries: number;
  thisMonthAmount: number;
  thisMonthBeneficiaries: number;
  averageAssistancePerPerson: number;
  yoyGrowthPct: number;
  momGrowthPct: number;
}

export interface CategoryBreakdown {
  category: string;
  code: string;
  amount: number;
  beneficiariesCount: number;
  percentage: number;
  color: string;
  avgPerPerson: number;
  growthPct: number;
  description: string;
  highlight: string;
}

export interface ScholarshipTier {
  tier: string;
  studentsCount: number;
  amount: number;
  avgPerStudent: number;
  percentageOfScholarships: number;
  description: string;
}

export interface MedicalSubcategory {
  type: string;
  amount: number;
  patientsCount: number;
  percentage: number;
  avgCost: number;
}

export interface MonthlyTrendPoint {
  month: string;
  monthShort: string;
  year: number;
  amount: number;
  beneficiaries: number;
  scholarshipsAmount: number;
  medicalAmount: number;
  financialAmount: number;
  otherAmount: number;
  isPeak?: boolean;
}

export interface QuarterlyTrendPoint {
  quarter: string;
  quarterShort: string;
  year: number;
  amount: number;
  beneficiaries: number;
  priorYearAmount: number;
  priorYearBeneficiaries: number;
  growthPct: number;
}

export interface AnnualComparisonPoint {
  year: number;
  label: string;
  totalAmount: number;
  totalBeneficiaries: number;
  scholarshipsAmount: number;
  medicalAmount: number;
  financialAmount: number;
  otherAmount: number;
}

export interface AreaDistribution {
  area: string;
  zone: string;
  beneficiaries: number;
  amount: number;
  percentage: number;
  topCategory: string;
}

export interface StrategicInsight {
  id: string;
  category: "funding" | "medical" | "scholarship" | "demographic";
  title: string;
  highlightMetric: string;
  observation: string;
  recommendation: string;
}

export interface AnalyticsDataset {
  isDemoData: boolean;
  disclaimer: string;
  generatedDate: string;
  kpis: ImpactKPIs;
  categories: CategoryBreakdown[];
  scholarships: {
    totalStudents: number;
    totalAmount: number;
    avgPerStudent: number;
    institutionsCount: number;
    tiers: ScholarshipTier[];
    topDisciplines: { name: string; percentage: number; students: number }[];
  };
  medical: {
    totalPatients: number;
    totalAmount: number;
    subcategories: MedicalSubcategory[];
  };
  financialAndHousing: {
    microEnterpriseAmount: number;
    microEnterpriseRecipients: number;
    sustenanceAmount: number;
    sustenanceRecipients: number;
    housingReliefAmount: number;
    housingRecipients: number;
  };
  trends: MonthlyTrendPoint[];
  quarterlyTrends: QuarterlyTrendPoint[];
  annualComparison: AnnualComparisonPoint[];
  areas: AreaDistribution[];
  insights: StrategicInsight[];
}

// -------------------------------------------------------------
// Consistently Calculated Dataset
// Total Assistance: ₹1,42,50,000 (₹1.425 Cr)
// Total Beneficiaries: 1,840
// -------------------------------------------------------------

export const DEMO_ANALYTICS_DATA: AnalyticsDataset = {
  isDemoData: true,
  disclaimer: "Demo Analytics — Illustrative figures for demonstration. Historical Jamaat records are undergoing digitization.",
  generatedDate: "October 2026",
  kpis: {
    totalBeneficiaries: 1840,
    totalAssistanceAmount: 14250000, // ₹1,42,50,000
    thisYearAmount: 9840000,        // ₹98,40,000 (CY 2026)
    thisYearBeneficiaries: 1230,
    thisMonthAmount: 1120000,       // ₹11,20,000 (Current Month)
    thisMonthBeneficiaries: 142,
    averageAssistancePerPerson: 7745, // ₹7,745
    yoyGrowthPct: 14.2,             // +14.2% YoY
    momGrowthPct: 8.5,              // +8.5% MoM
  },
  categories: [
    {
      category: "Education & Scholarships",
      code: "SCHOLARSHIP",
      amount: 6412500, // 45.0%
      beneficiariesCount: 620,
      percentage: 45.0,
      color: "#0B5133", // Primary Jamaat Emerald
      avgPerPerson: 10343,
      growthPct: 18.5,
      description: "College tuition, university degree grants, school fees, and vocational training support.",
      highlight: "Highest funding allocation",
    },
    {
      category: "Medical & Critical Care",
      code: "MEDICAL",
      amount: 3847500, // 27.0%
      beneficiariesCount: 490,
      percentage: 27.0,
      color: "#0284C7", // Sky Blue
      avgPerPerson: 7852,
      growthPct: 12.1,
      description: "Hospitalization subsidies, life-saving surgery aid, dialysis, and chronic prescription assistance.",
      highlight: "Critical emergency response",
    },
    {
      category: "Financial Aid & Micro-Enterprise",
      code: "FINANCIAL",
      amount: 2280000, // 16.0%
      beneficiariesCount: 310,
      percentage: 16.0,
      color: "#D97706", // Warm Amber
      avgPerPerson: 7355,
      growthPct: 6.8,
      description: "Micro-business seed capital, equipment loans, family sustenance, and hardship grants.",
      highlight: "Livelihood empowerment",
    },
    {
      category: "Housing & Rental Relief",
      code: "HOUSING",
      amount: 1140000, // 8.0%
      beneficiariesCount: 180,
      percentage: 8.0,
      color: "#7C3AED", // Violet
      avgPerPerson: 6333,
      growthPct: 4.2,
      description: "Tenant eviction prevention, essential monsoon roof repairs, and emergency relocation subsidies.",
      highlight: "Community shelter stability",
    },
    {
      category: "Emergency & General Welfare",
      code: "WELFARE",
      amount: 570000, // 4.0%
      beneficiariesCount: 240,
      percentage: 4.0,
      color: "#059669", // Teal
      avgPerPerson: 2375,
      growthPct: -2.4,
      description: "Seasonal food ration kits, disaster relief, winter utility aid, and emergency bereavement support.",
      highlight: "Rapid welfare distribution",
    },
  ],
  scholarships: {
    totalStudents: 620,
    totalAmount: 6412500,
    avgPerStudent: 10343,
    institutionsCount: 48,
    tiers: [
      {
        tier: "Undergraduate & Professional Degrees",
        studentsCount: 210,
        amount: 4200000,
        avgPerStudent: 20000,
        percentageOfScholarships: 65.5,
        description: "B.Tech, MBBS, B.Com, LLB, BCA and polytechnic tuition subsidies.",
      },
      {
        tier: "Primary & Secondary School Support",
        studentsCount: 290,
        amount: 1450000,
        avgPerStudent: 5000,
        percentageOfScholarships: 22.6,
        description: "Annual school fee grants, textbooks, uniforms, and digital learning aid.",
      },
      {
        tier: "Vocational & Specialized Skills",
        studentsCount: 120,
        amount: 762500,
        avgPerStudent: 6354,
        percentageOfScholarships: 11.9,
        description: "Data analytics, coding bootcamps, refrigeration tech, and graphic design certifications.",
      },
    ],
    topDisciplines: [
      { name: "Engineering & Technology", percentage: 34, students: 211 },
      { name: "Commerce, Accounts & CA", percentage: 26, students: 161 },
      { name: "Medicine & Health Sciences", percentage: 21, students: 130 },
      { name: "Computer Science & IT", percentage: 12, students: 74 },
      { name: "Vocational & Others", percentage: 7, students: 44 },
    ],
  },
  medical: {
    totalPatients: 490,
    totalAmount: 3847500,
    subcategories: [
      {
        type: "Emergency Surgeries & Hospitalization",
        amount: 2308500,
        patientsCount: 115,
        percentage: 60.0,
        avgCost: 20074,
      },
      {
        type: "Chronic Disease & Dialysis Support",
        amount: 1154250,
        patientsCount: 275,
        percentage: 30.0,
        avgCost: 4197,
      },
      {
        type: "Diagnostic Scans & Lab Investigations",
        amount: 384750,
        patientsCount: 100,
        percentage: 10.0,
        avgCost: 3848,
      },
    ],
  },
  financialAndHousing: {
    microEnterpriseAmount: 1420000,
    microEnterpriseRecipients: 130,
    sustenanceAmount: 860000,
    sustenanceRecipients: 180,
    housingReliefAmount: 1140000,
    housingRecipients: 180,
  },
  trends: [
    {
      month: "May 2026",
      monthShort: "May",
      year: 2026,
      amount: 1850000,
      beneficiaries: 225,
      scholarshipsAmount: 620000,
      medicalAmount: 610000,
      financialAmount: 380000,
      otherAmount: 240000,
    },
    {
      month: "June 2026",
      monthShort: "Jun",
      year: 2026,
      amount: 2680000,
      beneficiaries: 340,
      scholarshipsAmount: 1450000,
      medicalAmount: 580000,
      financialAmount: 410000,
      otherAmount: 240000,
      isPeak: true, // Academic cycle commencement
    },
    {
      month: "July 2026",
      monthShort: "Jul",
      year: 2026,
      amount: 2940000,
      beneficiaries: 370,
      scholarshipsAmount: 1680000,
      medicalAmount: 620000,
      financialAmount: 420000,
      otherAmount: 220000,
      isPeak: true, // Degree tuition disbursement peak
    },
    {
      month: "August 2026",
      monthShort: "Aug",
      year: 2026,
      amount: 2160000,
      beneficiaries: 265,
      scholarshipsAmount: 940000,
      medicalAmount: 640000,
      financialAmount: 360000,
      otherAmount: 220000,
    },
    {
      month: "September 2026",
      monthShort: "Sep",
      year: 2026,
      amount: 1640000,
      beneficiaries: 210,
      scholarshipsAmount: 680000,
      medicalAmount: 520000,
      financialAmount: 310000,
      otherAmount: 130000,
    },
    {
      month: "October 2026 (MTD)",
      monthShort: "Oct",
      year: 2026,
      amount: 1120000,
      beneficiaries: 142,
      scholarshipsAmount: 480000,
      medicalAmount: 360000,
      financialAmount: 180000,
      otherAmount: 100000,
    },
  ],
  quarterlyTrends: [
    {
      quarter: "Q1 2026 (Jan–Mar)",
      quarterShort: "Q1 '26",
      year: 2026,
      amount: 2210000,
      beneficiaries: 280,
      priorYearAmount: 1920000,
      priorYearBeneficiaries: 245,
      growthPct: 15.1,
    },
    {
      quarter: "Q2 2026 (Apr–Jun)",
      quarterShort: "Q2 '26",
      year: 2026,
      amount: 3380000,
      beneficiaries: 415,
      priorYearAmount: 2950000,
      priorYearBeneficiaries: 365,
      growthPct: 14.6,
    },
    {
      quarter: "Q3 2026 (Jul–Sep)",
      quarterShort: "Q3 '26",
      year: 2026,
      amount: 3130000,
      beneficiaries: 393,
      priorYearAmount: 2740000,
      priorYearBeneficiaries: 340,
      growthPct: 14.2,
    },
    {
      quarter: "Q4 2026 (Oct MTD)",
      quarterShort: "Q4 '26",
      year: 2026,
      amount: 1120000,
      beneficiaries: 142,
      priorYearAmount: 1000000,
      priorYearBeneficiaries: 135,
      growthPct: 12.0,
    },
  ],
  annualComparison: [
    {
      year: 2025,
      label: "Full Year 2025",
      totalAmount: 8610000,
      totalBeneficiaries: 1085,
      scholarshipsAmount: 3874500,
      medicalAmount: 2324700,
      financialAmount: 1377600,
      otherAmount: 1033200,
    },
    {
      year: 2026,
      label: "Year 2026 (YTD)",
      totalAmount: 9840000,
      totalBeneficiaries: 1230,
      scholarshipsAmount: 4428000,
      medicalAmount: 2656800,
      financialAmount: 1574400,
      otherAmount: 1180800,
    },
  ],
  areas: [
    {
      area: "Dongri & South Mumbai",
      zone: "South",
      beneficiaries: 773,
      amount: 5985000, // 42%
      percentage: 42.0,
      topCategory: "Education & Scholarships",
    },
    {
      area: "Kurla & Central Suburbs",
      zone: "Central",
      beneficiaries: 442,
      amount: 3420000, // 24%
      percentage: 24.0,
      topCategory: "Medical Assistance",
    },
    {
      area: "Govandi & Eastern Corridor",
      zone: "East",
      beneficiaries: 294,
      amount: 2280000, // 16%
      percentage: 16.0,
      topCategory: "Financial Aid",
    },
    {
      area: "Mira Road & Western Belt",
      zone: "West",
      beneficiaries: 202,
      amount: 1567500, // 11%
      percentage: 11.0,
      topCategory: "Education & Scholarships",
    },
    {
      area: "Navi Mumbai & Other Jamats",
      zone: "Suburban",
      beneficiaries: 129,
      amount: 997500, // 7%
      percentage: 7.0,
      topCategory: "Emergency Welfare",
    },
  ],
  insights: [
    {
      id: "insight-1",
      category: "funding",
      title: "Education is Community's Top Funding Priority",
      highlightMetric: "45.0% of all aid",
      observation: "Higher education and school assistance accounted for ₹64.12 Lakhs disbursed across 620 students, making it the single largest welfare initiative.",
      recommendation: "Introduce early-bird scholarship verification in April to ease the peak demand surge experienced in June-July.",
    },
    {
      id: "insight-2",
      category: "medical",
      title: "High-Leverage Medical Emergency Relief",
      highlightMetric: "115 surgeries funded",
      observation: "A total of 115 critical surgeries and ICU admissions were subsidized with an average grant of ₹20,074, directly preventing acute debt for families.",
      recommendation: "Partner with community diagnostic clinics to negotiate 25% lower group rates on scans and pathology.",
    },
    {
      id: "insight-3",
      category: "demographic",
      title: "Geographic Clustering in Dongri & Kurla",
      highlightMetric: "66.0% combined share",
      observation: "Two-thirds of all assistance disbursements flow to families located in South Mumbai (Dongri) and Kurla.",
      recommendation: "Establish localized community help desk hours at Dongri and Kurla Jamat offices for faster in-person document clearance.",
    },
    {
      id: "insight-4",
      category: "scholarship",
      title: "Engineering & Healthcare Lead Academic Ambition",
      highlightMetric: "55.0% of degree aid",
      observation: "More than half of undergraduate scholarship recipients are enrolled in Engineering, Technology, or Healthcare degree disciplines.",
      recommendation: "Build a community mentorship network pairing current scholarship recipients with senior professionals in the directory.",
    },
  ],
};

// -------------------------------------------------------------
// Formatters & Utility Helpers
// -------------------------------------------------------------

export function formatINR(val: number): string {
  if (val >= 10000000) {
    const cr = val / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    const l = val / 100000;
    return `₹${l.toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatINRFull(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat("en-IN").format(val);
}
