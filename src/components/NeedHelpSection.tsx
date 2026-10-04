import React from 'react';
import { ArrowRight, HelpCircle, Phone, Mail } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function NeedHelpSection() {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#09231F]/10">
      <Container>
        <div className="bg-[#E1DFDA] rounded-[16px] p-8 sm:p-12 border border-[#09231F]/12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[8px] bg-white text-[#098231] flex items-center justify-center border border-[#09231F]/10">
                <HelpCircle size={20} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#09231F] tracking-tight">
                Need help?
              </h3>
            </div>
            <p className="text-[16px] text-[#09231F]/75 leading-relaxed mt-2">
              Can't find what you're looking for? Our administrative team and helpdesk are available to assist you with applications, verifications, and queries.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-6 text-[13px] text-[#09231F]/70">
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-[#098231]" />
                +91 22 2345 6789 (Mon–Sat 9AM–6PM)
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-[#098231]" />
                helpdesk@ksijmumbai.org
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Button
              href="/login"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Raise a Query
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
