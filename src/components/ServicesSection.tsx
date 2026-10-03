import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Calendar, BookOpen, MessageSquare } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  ctaText: string;
  ctaHref: string;
  icon: React.ReactNode;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'education',
    title: 'Educational Assistance',
    category: 'STUDENT SUPPORT',
    description:
      'Financial aid and scholarships for primary, secondary, and professional university programs. Apply online with supporting documents and track your application status.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
    ctaText: 'Learn More & Apply',
    ctaHref: '/login',
    icon: <GraduationCap size={20} className="text-[#098231]" />,
  },
  {
    id: 'facility',
    title: 'Facility & Event Booking',
    category: 'COMMUNITY SPACES',
    description:
      'Reserve community banquet halls, imambara premises, and conference rooms for majalis, weddings, seminars, and family gatherings with clear scheduling availability.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop',
    ctaText: 'Book a Space',
    ctaHref: '/login',
    icon: <Calendar size={20} className="text-[#098231]" />,
  },
  {
    id: 'library',
    title: 'Community Library',
    category: 'KNOWLEDGE & ARCHIVES',
    description:
      'Search our comprehensive Islamic literature, historical manuscripts, educational publications, and digital archives. Reserve titles and manage book borrowings.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop',
    ctaText: 'Explore Catalog',
    ctaHref: '/login',
    icon: <BookOpen size={20} className="text-[#098231]" />,
  },
  {
    id: 'query',
    title: 'Raise an Office Query',
    category: 'MEMBER SERVICES',
    description:
      'Direct line to the Jamaat administrative team for membership questions, welfare assistance, official certification, and general inquiries with tracking IDs.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&auto=format&fit=crop',
    ctaText: 'Submit Query',
    ctaHref: '/login',
    icon: <MessageSquare size={20} className="text-[#098231]" />,
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-white border-b border-[#09231F]/10">
      <Container>
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#098231]" />
            <span className="text-[12px] font-bold tracking-widest text-[#098231] uppercase">
              JAMAAT SERVICES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#09231F] tracking-tight mb-4">
            Services designed to support our members.
          </h2>
          <p className="text-[16px] sm:text-[17px] text-[#09231F]/70 leading-relaxed">
            Essential community utilities maintained with transparency, accountability, and accessibility.
          </p>
        </div>

        {/* 2x2 Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-[14px] border border-[#09231F]/12 overflow-hidden flex flex-col justify-between hover:border-[#098231]/40 transition-colors"
            >
              <div>
                {/* 16:10 Image container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E1DFDA]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-[8px] border border-[#09231F]/10 flex items-center gap-2 shadow-sm">
                    {service.icon}
                    <span className="text-[11px] font-bold text-[#09231F] uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  <h3 className="text-[22px] font-bold text-[#09231F] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[15px] text-[#09231F]/70 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-7 pt-0">
                <Link
                  href={service.ctaHref}
                  className="inline-flex items-center text-[14px] font-bold text-[#098231] hover:text-[#076b28] transition-colors"
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight size={16} className="ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
