import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface EventItem {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

const EVENTS: EventItem[] = [
  {
    id: '1',
    category: 'COMMUNITY WELFARE',
    title: 'Health & Preventive Wellness Screening Camp',
    description:
      'Free general health evaluations, cardiovascular screenings, and consultations with community specialist doctors at the Community Centre.',
    date: 'Oct 18, 2026',
    location: 'Dongri Community Centre',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    category: 'EDUCATIONAL INITIATIVES',
    title: 'Higher Education & Scholarship Guidance Seminar',
    description:
      'An interactive orientation for students and parents on international university admissions, financial grants, and statement of purpose drafting.',
    date: 'Oct 25, 2026',
    location: 'KSIJ Conference Hall',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    category: 'MAJLIS & RELIGIOUS EVENTS',
    title: 'Wiladat-e-Imam (as) Celebrations & Lecture Series',
    description:
      'Spiritual lectures followed by community congregational dinner. Live stream will also be accessible for elder community members.',
    date: 'Nov 02, 2026',
    location: 'Mughal Masjid & Zainabia Hall',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop',
  },
];

export function EventsSection() {
  return (
    <section id="events" className="py-20 md:py-28 bg-[#E1DFDA] border-b border-[#09231F]/10">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#098231]" />
              <span className="text-[12px] font-bold tracking-widest text-[#098231] uppercase">
                CALENDAR & UPDATES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#09231F] tracking-tight mb-4">
              Events & Announcements
            </h2>
            <p className="text-[16px] sm:text-[17px] text-[#09231F]/70 leading-relaxed">
              Stay informed about upcoming majalis, youth workshops, medical drives, and community assemblies.
            </p>
          </div>

          <Link
            href="/#events"
            className="text-[15px] font-bold text-[#098231] hover:text-[#076b28] flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View Full Calendar</span>
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* 3-card layout on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-[14px] border border-[#09231F]/12 overflow-hidden flex flex-col justify-between hover:border-[#098231]/40 transition-colors"
            >
              <div>
                {/* 16:10 Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#dcdad4]">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-white/95 px-2.5 py-1 rounded-[6px] border border-[#09231F]/10">
                    <span className="text-[11px] font-bold text-[#098231] uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-[12px] text-[#09231F]/60 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-[#098231]" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#098231]" />
                      {event.location}
                    </span>
                  </div>

                  <h3 className="text-[18px] font-bold text-[#09231F] leading-snug mb-2.5">
                    {event.title}
                  </h3>

                  <p className="text-[14px] text-[#09231F]/70 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-6 pt-0">
                <Link
                  href="/login"
                  className="inline-flex items-center text-[13px] font-bold text-[#098231] hover:text-[#076b28] transition-colors"
                >
                  <span>Read More & Register</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
