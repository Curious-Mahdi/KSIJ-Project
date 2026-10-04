import React from 'react';
import Link from 'next/link';
import { Users, BookOpen, Calendar, Layers, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface QuickCard {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const QUICK_CARDS: QuickCard[] = [
  {
    title: 'K Connect',
    subtitle: 'DIRECTORY',
    description: 'Find verified doctors, businesses, and professionals in the community.',
    href: '/k-connect',
    icon: <Users size={22} className="text-[#098231]" />,
  },
  {
    title: 'K Guide',
    subtitle: 'KNOWLEDGE',
    description: 'Guidelines, scholarships, opportunities, procedures, and community rules.',
    href: '/k-guide',
    icon: <BookOpen size={22} className="text-[#098231]" />,
  },
  {
    title: 'Events & News',
    subtitle: 'UPDATES',
    description: 'Stay updated with majalis, youth workshops, and community events.',
    href: '/#events',
    icon: <Calendar size={22} className="text-[#098231]" />,
  },
  {
    title: 'Community Services',
    subtitle: 'ASSISTANCE',
    description: 'Education aid, hall and facility bookings, queries, and library loans.',
    href: '/#services',
    icon: <Layers size={22} className="text-[#098231]" />,
  },
];

export function QuickAccess() {
  return (
    <section className="py-16 md:py-20 bg-[#E1DFDA] border-b border-[#09231F]/10">
      <Container>
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#098231] mb-2">
              DISCOVER & NAVIGATE
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#09231F] tracking-tight">
              What are you looking for?
            </h2>
          </div>
          <p className="text-[15px] text-[#09231F]/70 max-w-md">
            Direct access to core community utilities, knowledge bases, and member services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {QUICK_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white rounded-[14px] p-6 border border-[#09231F]/12 transition-all duration-150 hover:border-[#098231] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-[8px] bg-[#098231]/10 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <span className="text-[#09231F]/40 group-hover:text-[#098231] transition-colors">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                <p className="text-[11px] font-bold text-[#098231] uppercase tracking-wider mb-1">
                  {card.subtitle}
                </p>
                <h3 className="text-[19px] font-bold text-[#09231F] mb-2 group-hover:text-[#098231] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[14px] text-[#09231F]/70 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#09231F]/8 flex items-center text-[13px] font-semibold text-[#098231]">
                <span>Explore {card.title}</span>
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
