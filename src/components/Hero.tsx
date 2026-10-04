import React from 'react';
import Image from 'next/image';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-[#E1DFDA] text-[#09231F] border-b border-[#09231F]/10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (approx 60% -> 7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Small eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#098231]" />
              <span className="text-[13px] font-semibold tracking-wider text-[#098231] uppercase">
                COMMUNITY PLATFORM
              </span>
            </div>

            {/* Confident editorial headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#09231F] leading-[1.12] tracking-tight mb-6">
              Everything your community needs, in one place.
            </h1>

            {/* Short, clear description */}
            <p className="text-[17px] sm:text-[18px] text-[#09231F]/75 leading-relaxed max-w-xl mb-8">
              Discover people, services, resources and opportunities across KSIJ Mumbai. Connect with professionals, access facilities, and navigate community guidance.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Button
                href="/k-connect"
                variant="primary"
                size="lg"
                icon={<ArrowRight size={18} />}
              >
                Explore K Connect
              </Button>
              <Button
                href="/k-guide"
                variant="secondary"
                size="lg"
                icon={<BookOpen size={18} />}
                iconPosition="left"
              >
                Explore K Guide
              </Button>
            </div>

            {/* Trust points */}
            <div className="mt-10 pt-8 border-t border-[#09231F]/10 flex flex-wrap items-center gap-8 text-[14px] text-[#09231F]/70">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#098231]" />
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#098231]" />
                <span>Community Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#098231]" />
                <span>Office Services</span>
              </div>
            </div>
          </div>

          {/* Right Column (approx 40% -> 5 columns) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[16px] overflow-hidden border border-[#09231F]/15 bg-white shadow-sm">
              <div className="aspect-[4/3] relative w-full overflow-hidden bg-[#dcdad4]">
                <Image
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop"
                  alt="KSIJ Community gathering and collaborative initiatives"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Informative editorial caption strip */}
              <div className="p-5 bg-white border-t border-[#09231F]/10 flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[#09231F]">
                    Khoja Shia Ithna-Asheri Jamaat
                  </p>
                  <p className="text-[12px] text-[#09231F]/60">
                    Serving Mumbai with faith, unity & service
                  </p>
                </div>
                <span className="text-[12px] font-medium text-[#098231] bg-[#098231]/10 px-2.5 py-1 rounded-[6px]">
                  Official
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
