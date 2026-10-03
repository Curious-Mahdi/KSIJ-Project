'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'K Connect', href: '/k-connect' },
  { label: 'K Guide', href: '/k-guide' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Events', href: '/#events' },
  { label: 'Contact', href: '/#contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#E1DFDA] border-b border-[#09231F]/10 transition-colors">
        <Container>
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 focus:outline-none">
              <div className="relative h-11 w-32 sm:w-36 flex items-center">
                <Image
                  src="/logo.png"
                  alt="KSIJ Mumbai Logo"
                  width={144}
                  height={44}
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative text-[15px] font-medium transition-colors py-2 ${
                      active
                        ? 'text-[#098231] font-semibold'
                        : 'text-[#09231F]/80 hover:text-[#098231]'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#098231]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="w-10 h-10 rounded-[8px] border border-[#09231F]/15 bg-white text-[#09231F] flex items-center justify-center hover:border-[#098231] hover:text-[#098231] transition-colors focus:outline-none"
              >
                <Search size={18} strokeWidth={2} />
              </button>
              
              <Button href="/login" variant="primary" size="md">
                Member Portal
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="p-2 text-[#09231F] rounded-[8px] border border-[#09231F]/15 bg-white"
              >
                <Search size={18} />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="p-2 text-[#09231F] rounded-[8px] border border-[#09231F]/15 bg-white"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Dropdown */}
          {searchOpen && (
            <div className="py-4 pb-5 border-t border-[#09231F]/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/k-connect?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="flex items-center gap-2 max-w-xl mx-auto"
              >
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#09231F]/50"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search people, services, guidelines, or scholarships..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#09231F]/20 rounded-[8px] text-[15px] text-[#09231F] placeholder:text-[#09231F]/40 focus:outline-none focus:border-[#098231]"
                    autoFocus
                  />
                </div>
                <Button type="submit" variant="primary" size="md">
                  Search
                </Button>
              </form>
            </div>
          )}
        </Container>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#09231F]/10 bg-[#E1DFDA] px-5 py-6">
            <nav className="flex flex-col space-y-3 mb-6">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-[16px] py-2 px-3 rounded-[6px] transition-colors ${
                      active
                        ? 'bg-[#098231]/10 text-[#098231] font-semibold'
                        : 'text-[#09231F] hover:bg-black/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-[#09231F]/10 flex flex-col gap-3">
              <Button
                href="/login"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Member Portal
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
