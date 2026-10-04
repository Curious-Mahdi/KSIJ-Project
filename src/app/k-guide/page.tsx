'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Compass, 
  HeartHandshake, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  X,
  Download,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AIAssistantWidget } from '@/components/AIAssistantWidget';

interface GuideArticle {
  id: string;
  category: 'Scholarships' | 'Guidelines' | 'Opportunities' | 'Medical' | 'Procedures';
  title: string;
  summary: string;
  updatedDate: string;
  sections: {
    heading: string;
    points: string[];
  }[];
  actionText?: string;
  actionHref?: string;
}

const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'scholarship-rules',
    category: 'Scholarships',
    title: 'KSIJ Higher Education & Professional Degree Scholarships 2026–27',
    summary: 'Guidelines, eligibility criteria, and submission procedure for undergraduate, medical, and postgraduate educational grants.',
    updatedDate: 'Oct 01, 2026',
    sections: [
      {
        heading: 'Eligibility Criteria',
        points: [
          'Applicant must be a registered member family of KSIJ Mumbai with updated membership record.',
          'Minimum 60% aggregate score in HSC / equivalent diploma or previous university semester.',
          'Applicable for recognized degree programs including MBBS, Engineering, Law, CA/CS, and MBA.',
        ],
      },
      {
        heading: 'Required Documentation',
        points: [
          'Certified marksheets of the preceding academic year.',
          'Fee structure receipt or provisional admission letter from accredited college/institution.',
          'Family income declaration or IT returns of the earning member.',
        ],
      },
      {
        heading: 'Submission Timeline',
        points: [
          'Application cycles open twice a year: July–August and December–January.',
          'Interviews and committee review take 14 business days from deadline closing.',
        ],
      },
    ],
    actionText: 'Apply via Member Portal',
    actionHref: '/login',
  },
  {
    id: 'marriage-guidelines',
    category: 'Guidelines',
    title: 'Nikah Registration & Marriage Certification Procedure',
    summary: 'Standard operational protocol for conducting Nikah ceremonies, hall booking coordination, and obtaining official Jamaat marriage certificates.',
    updatedDate: 'Sep 15, 2026',
    sections: [
      {
        heading: 'Prior Notification & Booking',
        points: [
          'Intimate the Jamaat office at least 30 days prior to the desired wedding ceremony date.',
          'Verify membership records and clearance for both bride and groom families.',
          'Reserve marriage hall / Imambara premises through the online facility booking system.',
        ],
      },
      {
        heading: 'Required Identification',
        points: [
          'Government photo ID (Aadhar / Passport) of both parties and two adult male witnesses.',
          'Four passport-sized photographs of bride and groom.',
          'No-Objection Certificate (NOC) if either party resides in an external Jamaat jurisdiction.',
        ],
      },
      {
        heading: 'Nikahnama Issuance',
        points: [
          'Official Nikahnama is executed by an authorized Aalim in the presence of registered wakils.',
          'Formal laminated certificate is generated within 5 working days following the ceremony.',
        ],
      },
    ],
    actionText: 'View Checklist & Member Portal',
    actionHref: '/login',
  },
  {
    id: 'funeral-support',
    category: 'Procedures',
    title: 'Emergency Mayyat Assistance & Burial Ground Protocols',
    summary: '24/7 immediate assistance guidelines, ambulance coordination, Ghusl-o-Kafan facility access, and Kabristan allotment procedures.',
    updatedDate: 'Aug 20, 2026',
    sections: [
      {
        heading: 'Immediate 24/7 Helpline',
        points: [
          'Emergency Mayyat Helpline: +91 22 2345 6700 (Operational 24 hours a day).',
          'Coordinate immediate mortuary ambulance transfer to the Jamaat Ghusl Khana.',
        ],
      },
      {
        heading: 'Essential Documentation',
        points: [
          'Hospital Death Certificate / Doctor’s Declaration is mandatory prior to commencement of Ghusl.',
          'Municipal Death Pass / Cremation/Burial NOC issued by the local BMC ward office.',
        ],
      },
      {
        heading: 'Ghusl & Burial Services',
        points: [
          'Trained volunteers provide dedicated Ghusl-o-Kafan assistance with complete sharia compliance.',
          'Arambagh Kabristan allotment is managed promptly by the designated grave custodian.',
        ],
      },
    ],
    actionText: 'Call 24/7 Emergency Helpline',
    actionHref: 'tel:+912223456700',
  },
  {
    id: 'career-mentorship',
    category: 'Opportunities',
    title: 'Youth Career Incubation & Micro-Grant Initiative',
    summary: 'Assisting young professionals with seed micro-funding, technical apprenticeships, and one-on-one executive mentorship.',
    updatedDate: 'Sep 28, 2026',
    sections: [
      {
        heading: 'Mentorship Matching',
        points: [
          'Pairing final-year graduates and early-career members with seasoned community business leaders.',
          'Quarterly review sessions covering resume enhancement, networking, and career roadmaps.',
        ],
      },
      {
        heading: 'Seed Micro-Grants',
        points: [
          'Interest-free revolving financial grants up to ₹2,50,000 for verified commercial venture proposals.',
          'Evaluation by the Business Sub-Committee based on feasibility and community job creation.',
        ],
      },
    ],
    actionText: 'Explore Mentorship Programs',
    actionHref: '/k-connect',
  },
  {
    id: 'medical-subsidies',
    category: 'Medical',
    title: 'Medical Subsidies, Dialysis Relief & Emergency Treatment Fund',
    summary: 'Financial support schemes for critical hospitalization, recurring dialysis, cancer therapy, and subsidised pharmacy access.',
    updatedDate: 'Oct 02, 2026',
    sections: [
      {
        heading: 'Scope of Assistance',
        points: [
          'Dialysis session subsidies at accredited hospital partners across Mumbai.',
          'Surgeries and acute hospitalization relief grants coordinated through the Medical Welfare Committee.',
        ],
      },
      {
        heading: 'Application Process',
        points: [
          'Submit original hospital estimation letter, diagnosis summary, and income particulars.',
          'Cases are expedited for emergency approvals within 24 to 48 hours.',
        ],
      },
    ],
    actionText: 'Submit Medical Query',
    actionHref: '/login',
  },
];

const CATEGORIES = [
  'All',
  'Scholarships',
  'Guidelines',
  'Procedures',
  'Opportunities',
  'Medical',
];

function KGuideContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>('scholarship-rules');

  const filteredArticles = useMemo(() => {
    return GUIDE_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' || article.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.sections.some((sec) =>
          sec.points.some((p) => p.toLowerCase().includes(query))
        );

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  return (
    <div className="py-12 md:py-16">
      <Container>
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-[14px] text-[#09231F]/60">
          <Link href="/" className="hover:text-[#098231] transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Home
          </Link>
          <span>/</span>
          <span className="text-[#09231F] font-semibold">K Guide Knowledge Base</span>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#098231]" />
            <span className="text-[12px] font-bold tracking-widest text-[#098231] uppercase">
              COMMUNITY INFORMATION & GUIDANCE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-[#09231F] tracking-tight mb-4">
            K Guide
          </h1>
          <p className="text-[16px] sm:text-[17px] text-[#09231F]/70 leading-relaxed">
            Transparent institutional procedures, educational grants, welfare schemes, emergency directives, and community documentation.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="bg-white rounded-[14px] p-6 border border-[#09231F]/12 mb-10">
          <div className="relative mb-5">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#09231F]/50"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guidelines (e.g., Nikah, Scholarship, Mayyat, Medical)..."
              className="w-full pl-12 pr-10 py-3.5 bg-[#E1DFDA]/40 border border-[#09231F]/15 rounded-[10px] text-[15px] text-[#09231F] placeholder:text-[#09231F]/45 focus:outline-none focus:border-[#098231] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#09231F]/40 hover:text-[#09231F]"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-[13px] font-semibold text-[#09231F]/70 shrink-0 mr-1">
              Filter By Topic:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#098231] text-white border border-[#098231]'
                    : 'bg-[#E1DFDA]/50 text-[#09231F] border border-[#09231F]/12 hover:border-[#098231]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-5">
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-[14px] p-12 text-center border border-[#09231F]/12">
              <BookOpen size={36} className="mx-auto text-[#09231F]/30 mb-3" />
              <h3 className="text-[18px] font-bold text-[#09231F] mb-1">No articles found</h3>
              <p className="text-[14px] text-[#09231F]/60 max-w-sm mx-auto mb-6">
                No guidelines matched "{searchQuery}". Try a different keyword or reset filters.
              </p>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Reset Search
              </Button>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isExpanded = expandedArticleId === article.id;
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-[14px] border border-[#09231F]/12 overflow-hidden transition-all duration-150"
                >
                  {/* Article Accordion Header */}
                  <div
                    onClick={() => toggleExpand(article.id)}
                    className="p-6 cursor-pointer select-none flex items-start justify-between gap-4 hover:bg-[#faf9f7] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[11px] font-bold text-[#098231] bg-[#098231]/10 px-2.5 py-1 rounded-[6px] uppercase tracking-wider">
                          {article.category}
                        </span>
                        <span className="text-[12px] text-[#09231F]/50">
                          Updated: {article.updatedDate}
                        </span>
                      </div>
                      <h3 className="text-[20px] font-bold text-[#09231F] leading-snug mb-2">
                        {article.title}
                      </h3>
                      <p className="text-[14px] text-[#09231F]/70 leading-relaxed max-w-3xl">
                        {article.summary}
                      </p>
                    </div>

                    <div className="p-2 rounded-[8px] bg-[#E1DFDA]/50 text-[#09231F]/60 shrink-0">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* Expanded Sections Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#09231F]/8 bg-[#faf9f7]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                        {article.sections.map((section, idx) => (
                          <div key={idx} className="bg-white p-5 rounded-[10px] border border-[#09231F]/10">
                            <h4 className="text-[15px] font-bold text-[#09231F] mb-3 pb-2 border-b border-[#09231F]/8">
                              {section.heading}
                            </h4>
                            <ul className="space-y-2 text-[13px] text-[#09231F]/80">
                              {section.points.map((pt, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#098231] mt-1.5 shrink-0" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {article.actionText && article.actionHref && (
                        <div className="pt-3 flex items-center justify-between">
                          <Button
                            href={article.actionHref}
                            variant="primary"
                            size="md"
                            icon={<ExternalLink size={16} />}
                          >
                            {article.actionText}
                          </Button>
                          <span className="text-[12px] text-[#09231F]/60">
                            Official Jamaat Procedure • Revision 2026.3
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Container>
    </div>
  );
}

export default function KGuidePage() {
  return (
    <div className="min-h-screen bg-[#E1DFDA] text-[#09231F] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-[#09231F]">Loading K Guide...</div>}>
          <KGuideContent />
        </Suspense>
      </main>
      <Footer />
      <AIAssistantWidget />
    </div>
  );
}
