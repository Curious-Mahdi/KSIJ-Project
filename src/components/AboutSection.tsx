import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Heart, Users2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#09231F] text-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (approx 55%) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#098231]" />
              <span className="text-[12px] font-bold tracking-widest text-[#098231] uppercase">
                ABOUT KSIJ MUMBAI
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-white leading-[1.15] tracking-tight mb-6">
              A legacy of faith, education and community service.
            </h2>

            <p className="text-[16px] sm:text-[17px] text-[#e0deda] leading-relaxed mb-8">
              Founded to preserve Islamic values and foster socio-economic advancement, the Khoja Shia Ithna-Asheri Jamaat of Mumbai serves thousands of families. Through educational endowments, healthcare initiatives, housing assistance, and religious assemblies, we build an interconnected, resilient community.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 pt-6 border-t border-white/15">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[#098231] mb-2 font-bold">
                  <ShieldCheck size={18} />
                  <span className="text-white text-[15px]">Integrity</span>
                </div>
                <p className="text-[13px] text-[#c0beba] leading-normal">
                  Transparent governance & institutional trust across all operations.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[#098231] mb-2 font-bold">
                  <Heart size={18} />
                  <span className="text-white text-[15px]">Compassion</span>
                </div>
                <p className="text-[13px] text-[#c0beba] leading-normal">
                  Dedicated social welfare support for vulnerable families and elders.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[#098231] mb-2 font-bold">
                  <Users2 size={18} />
                  <span className="text-white text-[15px]">Empowerment</span>
                </div>
                <p className="text-[13px] text-[#c0beba] leading-normal">
                  Higher education aid, skills training, and entrepreneurship backing.
                </p>
              </div>
            </div>

            <Button
              href="/#services"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Learn More About Our Work
            </Button>
          </div>

          {/* Right Column (approx 45%) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[16px] overflow-hidden border border-white/15 bg-[#123630]">
              <div className="aspect-[4/3] relative w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000&auto=format&fit=crop"
                  alt="KSIJ Mumbai heritage and community services"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <div className="p-5 bg-[#09231F] border-t border-white/15">
                <p className="text-[14px] font-semibold text-white">
                  Serving Mumbai Since 1899
                </p>
                <p className="text-[12px] text-[#a6a49f]">
                  Centuries of collective welfare, devotion, and community solidarity
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
