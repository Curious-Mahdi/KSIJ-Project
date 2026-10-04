import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="bg-[#09231F] text-white pt-16 md:pt-20 pb-10 border-t border-white/10">
      <Container>
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Col 1: Logo & Mission (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <div className="mb-5 bg-white p-3 rounded-[10px] inline-block">
              <Image
                src="/logo.png"
                alt="KSIJ Mumbai Logo"
                width={130}
                height={40}
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <p className="text-[14px] text-[#c4c2be] leading-relaxed mb-6 max-w-sm">
              Khoja Shia Ithna-Asheri Jamaat, Mumbai. Dedicated to spiritual enrichment, educational assistance, healthcare support, and unified community welfare.
            </p>
            <div className="flex items-center gap-3 text-[#c4c2be]">
              <a
                href="https://ksijmumbai.org"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-[8px] bg-white/10 flex items-center justify-center hover:bg-[#098231] hover:text-white transition-colors"
                aria-label="Official Website"
              >
                <Globe size={16} />
              </a>
              <span className="text-[13px] text-[#c4c2be]">Official Portal</span>
            </div>
          </div>

          {/* Col 2: Quick Links (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="text-[15px] font-bold uppercase tracking-wider text-white mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <Link href="/" className="text-[#c4c2be] hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/k-connect" className="text-[#c4c2be] hover:text-white transition-colors">
                  K Connect Directory
                </Link>
              </li>
              <li>
                <Link href="/k-guide" className="text-[#c4c2be] hover:text-white transition-colors">
                  K Guide Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-[#c4c2be] hover:text-white transition-colors">
                  About KSIJ Mumbai
                </Link>
              </li>
              <li>
                <Link href="/#events" className="text-[#c4c2be] hover:text-white transition-colors">
                  Events & Announcements
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#c4c2be] hover:text-white transition-colors">
                  Member Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community Services (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="text-[15px] font-bold uppercase tracking-wider text-white mb-5">
              Services
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <Link href="/login" className="text-[#c4c2be] hover:text-white transition-colors">
                  Educational Aid
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#c4c2be] hover:text-white transition-colors">
                  Hall Bookings
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#c4c2be] hover:text-white transition-colors">
                  Library Catalog
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#c4c2be] hover:text-white transition-colors">
                  Medical Subsidies
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#c4c2be] hover:text-white transition-colors">
                  Raise Office Query
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="text-[15px] font-bold uppercase tracking-wider text-white mb-5">
              Contact & Office
            </h4>
            <div className="space-y-4 text-[14px] text-[#c4c2be]">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#098231] shrink-0 mt-0.5" />
                <span>
                  KSIJ Mumbai Jamaat Office,<br />
                  Dongri, Mumbai 400 009,<br />
                  Maharashtra, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={17} className="text-[#098231] shrink-0" />
                <span>+91 22 2345 6789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-[#098231] shrink-0" />
                <span>office@ksijmumbai.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#9c9a96]">
          <p>© {new Date().getFullYear()} Khoja Shia Ithna-Asheri Jamaat Mumbai. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">
              Governance & Bylaws
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
