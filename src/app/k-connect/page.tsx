'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  CheckCircle, 
  Phone, 
  Mail, 
  Filter, 
  Plus, 
  ArrowLeft,
  X,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AIAssistantWidget } from '@/components/AIAssistantWidget';

interface MemberProfile {
  id: string;
  name: string;
  category: string;
  specialty: string;
  organization?: string;
  experience: string;
  location: string;
  phone: string;
  email: string;
  verified: boolean;
  services: string[];
}

const DIRECTORY_MEMBERS: MemberProfile[] = [
  {
    id: '1',
    name: 'Dr. Murtaza H. Merchant',
    category: 'Doctors',
    specialty: 'Consultant Cardiologist & Physician',
    organization: 'Saifee Hospital & Private Clinic',
    experience: '16+ years experience',
    location: 'Dongri, Mumbai',
    phone: '+91 98200 12345',
    email: 'dr.murtaza@example.com',
    verified: true,
    services: ['Cardiac Consultation', 'ECG & Echo', 'Preventive Health Checks'],
  },
  {
    id: '2',
    name: 'Zahra Fatima Vakil',
    category: 'Lawyers',
    specialty: 'Corporate, Property & Family Law Advocate',
    organization: 'Vakil & Associates Law Chambers',
    experience: '11 years experience',
    location: 'Fort, Mumbai',
    phone: '+91 98201 23456',
    email: 'zahra.vakil@example.com',
    verified: true,
    services: ['Property Title Verification', 'Wills & Trust Deeds', 'Family Dispute Resolution'],
  },
  {
    id: '3',
    name: 'Ali Raza Master',
    category: 'Engineers',
    specialty: 'Senior Structural & Civil Consultant',
    organization: 'Master Consulting Engineers',
    experience: '14 years experience',
    location: 'Mazgaon, Mumbai',
    phone: '+91 98202 34567',
    email: 'ali.master@example.com',
    verified: true,
    services: ['Structural Audits', 'Building Approvals', 'Redevelopment Advisory'],
  },
  {
    id: '4',
    name: 'Fatema S. Rajani',
    category: 'Teachers',
    specialty: 'Senior Mathematics & Physics Educator',
    organization: 'Habib Educational Complex & Online Tutoring',
    experience: '9 years experience',
    location: 'Bandra, Mumbai',
    phone: '+91 98203 45678',
    email: 'fatema.rajani@example.com',
    verified: true,
    services: ['ICSE & CBSE Class 10-12 Coaching', 'Competitive Exam Prep', 'STEM Mentorship'],
  },
  {
    id: '5',
    name: 'Husain K. Panjwani',
    category: 'Businesses',
    specialty: 'Commercial Hardware & Building Materials',
    organization: 'Panjwani Metal & Hardware Stores',
    experience: '22 years in business',
    location: 'Crawford Market, Mumbai',
    phone: '+91 98204 56789',
    email: 'husain.panjwani@example.com',
    verified: true,
    services: ['Wholesale Plumbing', 'Industrial Fittings', 'Architectural Hardware'],
  },
  {
    id: '6',
    name: 'Mohamed Jaffar Tejani',
    category: 'Services & Technicians',
    specialty: 'Licensed Electrical Contractor & Solar Installer',
    organization: 'Tejani Power & Electrical Works',
    experience: '15 years experience',
    location: 'Byculla, Mumbai',
    phone: '+91 98205 67890',
    email: 'm.tejani@example.com',
    verified: true,
    services: ['Residential Rewiring', 'Solar Panel Setup', 'Emergency Electrical Repairs'],
  },
  {
    id: '7',
    name: 'Sakina B. Khalfan',
    category: 'Doctors',
    specialty: 'Pediatrician & Child Health Specialist',
    organization: 'Prince Aly Khan Hospital',
    experience: '12 years experience',
    location: 'Nesbit Road, Mazgaon',
    phone: '+91 98206 78901',
    email: 'sakina.khalfan@example.com',
    verified: true,
    services: ['Newborn Care', 'Immunization', 'Pediatric Nutrition'],
  },
  {
    id: '8',
    name: 'Abbas E. Dhanani',
    category: 'Services & Technicians',
    specialty: 'Master Plumber & Sanitary Contractor',
    organization: 'Dhanani Plumbing Solutions',
    experience: '18 years experience',
    location: 'Mohd Ali Road, Mumbai',
    phone: '+91 98207 89012',
    email: 'abbas.dhanani@example.com',
    verified: true,
    services: ['Pipe Leak Detection', 'Bathroom Renovation', 'Water Tank Cleaning'],
  },
  {
    id: '9',
    name: 'Khadija M. Sachedina',
    category: 'Students',
    specialty: 'Final Year MBBS Student & Peer Mentor',
    organization: 'Grant Government Medical College, Mumbai',
    experience: 'Final Year Student',
    location: 'Mumbai Central',
    phone: '+91 98208 90123',
    email: 'khadija.sachedina@example.com',
    verified: true,
    services: ['Medical Entrance Guidance (NEET)', 'Study Group Facilitation', 'Peer Counseling'],
  },
];

const CATEGORIES = [
  'All',
  'Doctors',
  'Engineers',
  'Lawyers',
  'Businesses',
  'Teachers',
  'Services & Technicians',
  'Students',
];

function KConnectContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    return DIRECTORY_MEMBERS.filter((member) => {
      const matchesCategory =
        selectedCategory === 'All' || member.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.specialty.toLowerCase().includes(query) ||
        member.location.toLowerCase().includes(query) ||
        member.category.toLowerCase().includes(query) ||
        member.services.some((s) => s.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleShare = (member: MemberProfile) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${member.name} (${member.specialty}) - Location: ${member.location}. Phone: ${member.phone}`
      );
      setCopiedId(member.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="py-12 md:py-16">
      <Container>
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center gap-2 text-[14px] text-[#09231F]/60">
          <Link href="/" className="hover:text-[#098231] transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Home
          </Link>
          <span>/</span>
          <span className="text-[#09231F] font-semibold">K Connect Directory</span>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#098231]" />
            <span className="text-[12px] font-bold tracking-widest text-[#098231] uppercase">
              COMMUNITY DIRECTORY
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-[#09231F] tracking-tight mb-4">
            K Connect Directory
          </h1>
          <p className="text-[16px] sm:text-[17px] text-[#09231F]/70 leading-relaxed">
            Discover verified doctors, lawyers, engineers, tradespeople, and local community service providers across Mumbai.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-[14px] p-6 border border-[#09231F]/12 mb-10">
          {/* Search Input */}
          <div className="relative mb-5">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#09231F]/50"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, profession, medical specialty, or service..."
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

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-[13px] font-semibold text-[#09231F]/70 shrink-0 flex items-center gap-1.5 mr-1">
              <Filter size={15} /> Categories:
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

        {/* Directory Count */}
        <div className="flex items-center justify-between mb-6 text-[14px] text-[#09231F]/70">
          <span>
            Showing <strong className="text-[#09231F]">{filteredMembers.length}</strong> verified professionals
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </span>
          <Button href="/login" variant="outline" size="sm" icon={<Plus size={15} />} iconPosition="left">
            Register as a Professional
          </Button>
        </div>

        {/* Directory Grid */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-[14px] p-12 text-center border border-[#09231F]/12">
            <Briefcase size={36} className="mx-auto text-[#09231F]/30 mb-3" />
            <h3 className="text-[18px] font-bold text-[#09231F] mb-1">No community profiles found</h3>
            <p className="text-[14px] text-[#09231F]/60 max-w-sm mx-auto mb-6">
              We couldn't find any profiles matching "{searchQuery}". Try selecting a different category or clearing search filters.
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-[14px] p-6 border border-[#09231F]/12 flex flex-col justify-between hover:border-[#098231]/40 transition-colors"
              >
                <div>
                  {/* Category and Verification */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#098231] bg-[#098231]/10 px-2.5 py-1 rounded-[6px] uppercase tracking-wider">
                      {member.category}
                    </span>
                    {member.verified && (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#098231]">
                        <CheckCircle size={14} /> Verified Member
                      </span>
                    )}
                  </div>

                  {/* Name and Specialty */}
                  <h3 className="text-[19px] font-bold text-[#09231F] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[14px] font-medium text-[#09231F]/80 mb-2">
                    {member.specialty}
                  </p>
                  {member.organization && (
                    <p className="text-[13px] text-[#09231F]/60 mb-4">
                      {member.organization}
                    </p>
                  )}

                  {/* Service Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {member.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="text-[11.5px] bg-[#E1DFDA]/60 text-[#09231F]/80 px-2 py-0.5 rounded-[4px]"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with details */}
                <div className="pt-4 border-t border-[#09231F]/8 space-y-2.5 text-[13px] text-[#09231F]/70">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#098231]" />
                      {member.location}
                    </span>
                    <span className="font-medium text-[#09231F]/80">{member.experience}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${member.phone}`}
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#098231] hover:underline"
                      >
                        <Phone size={14} /> {member.phone}
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-[#09231F]/50 hover:text-[#098231] transition-colors"
                        title={`Email ${member.email}`}
                      >
                        <Mail size={14} />
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleShare(member)}
                      className="p-1.5 rounded-[6px] hover:bg-[#E1DFDA] text-[#09231F]/60 hover:text-[#09231F] transition-colors"
                      title="Copy details"
                    >
                      {copiedId === member.id ? (
                        <span className="text-[11px] font-bold text-[#098231]">Copied!</span>
                      ) : (
                        <Share2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default function KConnectPage() {
  return (
    <div className="min-h-screen bg-[#E1DFDA] text-[#09231F] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-[#09231F]">Loading K Connect Directory...</div>}>
          <KConnectContent />
        </Suspense>
      </main>
      <Footer />
      <AIAssistantWidget />
    </div>
  );
}
