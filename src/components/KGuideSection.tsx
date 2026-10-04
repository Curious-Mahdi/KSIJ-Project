import React from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, FileText, Compass, HeartHandshake } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface GuideCategory {
  title: string;
  category: string;
  description: string;
  highlights: string[];
  href: string;
  icon: React.ReactNode;
}

const GUIDE_ITEMS: GuideCategory[] = [
  {
    title: 'Scholarships & Higher Education',
    category: 'EDUCATION AID',
    description: 'Guidelines and criteria for merit and need-based undergraduate and postgraduate scholarships.',
    highlights: ['Application criteria & deadlines', 'Domestic & overseas funding', 'Required certificates'],
    href: '/k-guide?category=Scholarships',
    icon: <GraduationCap size={22} className="text-[#098231]" />,
  },
  {
    title: 'Community Procedures & Guidelines',
    category: 'PROCEDURES',
    description: 'Official protocols for marriage registration, NOC issuance, funeral assistance, and hall reservations.',
    highlights: ['Step-by-step checklists', 'Jamaat office timings', 'Standard documentation'],
    href: '/k-guide?category=Guidelines',
    icon: <FileText size={22} className="text-[#098231]" />,
  },
  {
    title: 'Career Opportunities & Grants',
    category: 'OPPORTUNITIES',
    description: 'Curated job openings, business incubation programs, micro-finance, and vocational training.',
    highlights: ['Community startup grants', 'Internships for youth', 'Professional mentoring'],
    href: '/k-guide?category=Opportunities',
    icon: <Compass size={22} className="text-[#098231]" />,
  },
  {
    title: 'Medical Aid & Healthcare Relief',
    category: 'WELFARE',
    description: 'Medical subsidy guidelines, panel doctor schedules, and emergency health support applications.',
    highlights: ['Hospital empanelment list', 'Reimbursement guidelines', 'Emergency contacts'],
    href: '/k-guide?category=Medical',
    icon: <HeartHandshake size={22} className="text-[#098231]" />,
  },
];

export function KGuideSection() {
  return (
    <section className="py-20 md:py-28 bg-[#E1DFDA] border-b border-[#09231F]/10">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#098231]" />
              <span className="text-[12px] font-bold tracking-widest text-[#098231] uppercase">
                INFORMATION & GUIDANCE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#09231F] tracking-tight mb-4">
              Everything you need to know.
            </h2>
            <p className="text-[16px] sm:text-[17px] text-[#09231F]/70 leading-relaxed">
              Clear, transparent documentation on community procedures, educational grants, welfare schemes, and opportunities.
            </p>
          </div>

          <Button
            href="/k-guide"
            variant="secondary"
            size="lg"
            icon={<ArrowRight size={18} />}
          >
            Browse All Guides
          </Button>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDE_ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-[14px] p-7 border border-[#09231F]/12 flex flex-col justify-between hover:border-[#098231]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-[8px] bg-[#098231]/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#098231] bg-[#098231]/10 px-2.5 py-1 rounded-[6px]">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-[20px] font-bold text-[#09231F] mb-2">
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#09231F]/70 leading-relaxed mb-5">
                  {item.description}
                </p>

                <div className="space-y-2 mb-6">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center text-[13px] text-[#09231F]/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#098231] mr-2.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#09231F]/8 flex items-center justify-between">
                <Link
                  href={item.href}
                  className="text-[14px] font-semibold text-[#098231] hover:underline flex items-center gap-1.5"
                >
                  <span>Read Full Guideline</span>
                  <ArrowRight size={15} />
                </Link>
                <span className="text-[12px] text-[#09231F]/50">Updated Oct 2026</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
