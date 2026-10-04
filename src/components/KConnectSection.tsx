'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  'Doctors',
  'Engineers',
  'Businesses',
  'Teachers',
  'Lawyers',
  'Services & Technicians',
  'Students',
  'Other',
];

const SAMPLE_PROFILES = [
  {
    name: 'Dr. Murtaza H. Merchant',
    role: 'Cardiologist & Physician',
    category: 'Doctors',
    experience: '16+ yrs exp',
    location: 'Dongri, Mumbai',
    verified: true,
  },
  {
    name: 'Zahra Fatima Vakil',
    role: 'Corporate & Real Estate Lawyer',
    category: 'Lawyers',
    experience: '10+ yrs exp',
    location: 'Fort, Mumbai',
    verified: true,
  },
  {
    name: 'Ali Raza Master',
    role: 'Structural Engineer & Consultant',
    category: 'Engineers',
    experience: '12+ yrs exp',
    location: 'Mazgaon, Mumbai',
    verified: true,
  },
];

export function KConnectSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/k-connect?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/k-connect');
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white border-y border-[#09231F]/10">
      <Container>
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#098231]" />
            <span className="text-[12px] font-bold tracking-widest text-[#098231] uppercase">
              COMMUNITY DIRECTORY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#09231F] tracking-tight mb-4">
            Find someone from your community.
          </h2>
          <p className="text-[16px] sm:text-[17px] text-[#09231F]/70 leading-relaxed">
            Search verified community members across healthcare, engineering, legal practice, trade, education, and skilled technical services.
          </p>
        </div>

        {/* Directory Search Box */}
        <div className="bg-[#E1DFDA] rounded-[14px] p-6 sm:p-8 border border-[#09231F]/12 mb-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#09231F]/50"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people, professions or services (e.g. Doctor, Electrician, Vakil)..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#09231F]/15 rounded-[10px] text-[15px] text-[#09231F] placeholder:text-[#09231F]/45 focus:outline-none focus:border-[#098231]"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="shrink-0">
              Search Directory
            </Button>
          </form>

          {/* Popular Categories */}
          <div>
            <p className="text-[13px] font-semibold text-[#09231F]/80 mb-3 uppercase tracking-wider">
              Popular Categories:
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/k-connect?category=${encodeURIComponent(cat)}`}
                  className="px-3.5 py-1.5 bg-white border border-[#09231F]/15 hover:border-[#098231] hover:text-[#098231] rounded-[8px] text-[13px] font-medium text-[#09231F] transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Preview Cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[20px] font-bold text-[#09231F]">
              Recently Verified Members
            </h3>
            <Link
              href="/k-connect"
              className="text-[14px] font-semibold text-[#098231] hover:underline flex items-center gap-1"
            >
              <span>View all directory members</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_PROFILES.map((profile) => (
              <div
                key={profile.name}
                className="bg-white rounded-[14px] p-6 border border-[#09231F]/12 flex flex-col justify-between hover:border-[#098231]/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[12px] font-semibold text-[#098231] bg-[#098231]/10 px-2.5 py-1 rounded-[6px]">
                      {profile.category}
                    </span>
                    {profile.verified && (
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#098231]">
                        <CheckCircle size={14} /> Verified
                      </span>
                    )}
                  </div>

                  <h4 className="text-[18px] font-bold text-[#09231F] mb-1">
                    {profile.name}
                  </h4>
                  <p className="text-[14px] font-medium text-[#09231F]/75 mb-3 flex items-center gap-1.5">
                    <Briefcase size={14} className="text-[#098231]" />
                    {profile.role}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#09231F]/8 flex items-center justify-between text-[13px] text-[#09231F]/60">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {profile.location}
                  </span>
                  <span className="font-medium text-[#09231F]/80">{profile.experience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
          <Button
            href="/k-connect"
            variant="outline"
            size="lg"
            icon={<ArrowRight size={18} />}
          >
            Explore Complete K Connect Directory
          </Button>
        </div>
      </Container>
    </section>
  );
}
