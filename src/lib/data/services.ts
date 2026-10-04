export const services = [
  {
    id: "educational-scholarship",
    title: "Educational Scholarship",
    icon: "🎓",
    category: "EDUCATION",
    description: "Financial assistance intended to help eligible students continue their education.",
    smallText: "Scholarships • Education Support",
    subtitle: "Helping eligible students continue their education through community-supported assistance.",
    provides: [
      "Education-related financial support",
      "Guidance through the application process",
      "Document-based eligibility review",
      "Application status updates"
    ],
    documents: [
      { name: "Aadhaar / identity document", reason: "For identity verification", required: true },
      { name: "Recent passport-size photograph", reason: "For records", required: true },
      { name: "Current academic mark sheet / result", reason: "To review academic standing", required: true },
      { name: "Bonafide certificate", reason: "Proof of enrollment", required: true },
      { name: "Admission letter / fee structure", reason: "To verify requested amount", required: true },
      { name: "Income certificate or other income proof", reason: "To assess financial need", required: true },
      { name: "Bank account details", reason: "For funds transfer", required: true },
      { name: "Previous scholarship details, if applicable", reason: "For historical context", required: false }
    ],
    applicationFields: [
      { label: "Course / class", type: "text" },
      { label: "Institution", type: "text" },
      { label: "Academic year", type: "text" },
      { label: "Approximate annual fee", type: "number" },
      { label: "Assistance requested", type: "number" }
    ]
  },
  {
    id: "medical-assistance",
    title: "Medical Assistance",
    icon: "🏥",
    category: "HEALTHCARE",
    description: "Support for eligible medical treatment, hospital expenses and healthcare-related needs.",
    smallText: "Medical Support • Healthcare",
    subtitle: "Navigating healthcare expenses through community-based support.",
    provides: [
      "Medical assistance assessment",
      "Support documentation review",
      "Case-based assistance workflow",
      "Application progress updates"
    ],
    documents: [
      { name: "Aadhaar / identity document", reason: "For identity verification", required: true },
      { name: "Medical reports", reason: "To verify medical condition", required: true },
      { name: "Doctor's prescription / recommendation", reason: "Required by the committee", required: true },
      { name: "Hospital estimate / quotation", reason: "To determine required support", required: true },
      { name: "Hospital bills, if treatment has already started", reason: "For reimbursement/support review", required: false },
      { name: "Income proof", reason: "To assess financial eligibility", required: true },
      { name: "Bank details", reason: "For direct transfers if approved", required: true },
      { name: "Insurance details, if applicable", reason: "To check co-pay or coverage", required: false }
    ],
    applicationFields: [
      { label: "Patient name", type: "text" },
      { label: "Relationship to applicant", type: "text" },
      { label: "Treatment / hospital", type: "text" },
      { label: "Nature of treatment", type: "text" },
      { label: "Estimated expense", type: "number" },
      { label: "Assistance requested", type: "number" }
    ]
  },
  {
    id: "unnati-loan",
    title: "UNNATI Loan",
    icon: "🤝",
    category: "FINANCIAL SUPPORT",
    description: "A proposed interest-free financial assistance pathway for eligible community members.",
    smallText: "Financial Assistance • Loan Support",
    subtitle: "Empowering members through proposed interest-free community financing.",
    provides: [
      "Interest-free financial assistance pathway",
      "Application review",
      "Documentation verification",
      "Repayment-related workflow where applicable"
    ],
    documents: [
      { name: "Aadhaar / identity document", reason: "For identity verification", required: true },
      { name: "Address proof", reason: "To verify residency", required: true },
      { name: "Income / financial information", reason: "To assess ability to repay", required: true },
      { name: "Bank account details", reason: "For loan disbursement", required: true },
      { name: "Purpose of loan", reason: "Must meet programme criteria", required: true },
      { name: "Supporting quotation or business-related documents where relevant", reason: "For business/asset loans", required: false },
      { name: "Guarantor / reference information", reason: "Only if actual programme requires it", required: false }
    ],
    applicationFields: [
      { label: "Purpose of loan", type: "text" },
      { label: "Amount requested", type: "number" },
      { label: "Income information (monthly)", type: "number" },
      { label: "Proposed repayment plan", type: "textarea" }
    ]
  },
  {
    id: "housing-assistance",
    title: "Housing Assistance",
    icon: "🏠",
    category: "WELFARE",
    description: "Potential assistance for eligible families facing housing-related financial difficulty.",
    smallText: "Housing • Family Support",
    subtitle: "Providing relief for community families navigating housing challenges.",
    provides: [
      "Housing-related assistance assessment",
      "Documentation review",
      "Family circumstances assessment",
      "Application tracking"
    ],
    documents: [
      { name: "Aadhaar / identity document", reason: "For identity verification", required: true },
      { name: "Address proof", reason: "To verify current residence", required: true },
      { name: "Proof of housing situation", reason: "E.g., eviction notice or rent agreement", required: true },
      { name: "Income proof", reason: "To assess financial hardship", required: true },
      { name: "Relevant property/rent documents", reason: "To verify claims", required: true },
      { name: "Bank details", reason: "For potential transfers", required: true },
      { name: "Supporting family documents where applicable", reason: "To assess dependents", required: false }
    ],
    applicationFields: [
      { label: "Current housing situation", type: "textarea" },
      { label: "Nature of assistance required", type: "textarea" },
      { label: "Approximate expense", type: "number" }
    ]
  },
  {
    id: "general-welfare",
    title: "General Welfare Support",
    icon: "🍚",
    category: "WELFARE",
    description: "Support for essential household needs and families experiencing financial hardship.",
    smallText: "Essential Support • Family Welfare",
    subtitle: "Standing by community members during times of essential need.",
    provides: [
      "Essential welfare support",
      "Family assistance assessment",
      "Documentation review",
      "Application tracking"
    ],
    documents: [
      { name: "Aadhaar / identity document", reason: "For identity verification", required: true },
      { name: "Address proof", reason: "To verify location", required: true },
      { name: "Income / financial information", reason: "To assess need", required: true },
      { name: "Relevant supporting documents", reason: "E.g., utility bills, ration card", required: false },
      { name: "Bank details", reason: "For financial aid disbursement", required: true }
    ],
    applicationFields: [
      { label: "Type of support required", type: "text" },
      { label: "Household situation", type: "textarea" },
      { label: "Assistance requested", type: "textarea" }
    ]
  },
  {
    id: "emergency-assistance",
    title: "Emergency Assistance",
    icon: "🆘",
    category: "URGENT SUPPORT",
    description: "A proposed pathway for urgent situations requiring timely community assistance.",
    smallText: "Emergency • Immediate Support",
    subtitle: "Rapid-response workflows for critical and urgent community needs.",
    provides: [
      "Urgent assistance request",
      "Priority case review",
      "Supporting document submission",
      "Status tracking"
    ],
    documents: [
      { name: "Aadhaar / identity document", reason: "For identity verification", required: true },
      { name: "Supporting evidence of emergency", reason: "To verify urgency", required: true },
      { name: "Medical / hospital documents if medical", reason: "If health-related", required: false },
      { name: "Income / financial information where relevant", reason: "For committee review", required: false },
      { name: "Bank details", reason: "For fast disbursement", required: true },
      { name: "Any additional supporting documents", reason: "As requested by the committee", required: false }
    ],
    applicationFields: [
      { label: "Nature of emergency", type: "text" },
      { label: "Date of incident", type: "date" },
      { label: "Urgency", type: "text" },
      { label: "Support required", type: "textarea" }
    ]
  }
];
