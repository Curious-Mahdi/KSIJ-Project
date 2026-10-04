"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from "react";

const updateData: Record<string, { title: string; category: string; author: string; date: string; content: React.ReactNode }> = {
  'hackathon': {
    title: 'Register for the Hackathon',
    category: 'Technology',
    author: 'Tech and AI Committee',
    date: '2 hours ago',
    content: (
      <>
        <p style={{ marginBottom: '24px' }}>Join the community hackathon at Khoja Masjid Imambada Hall Dongri. This is an incredible opportunity to build innovative solutions, collaborate with peers, and showcase your coding skills.</p>
        <p style={{ marginBottom: '24px' }}>The event will span 24 hours of non-stop coding, ideation, and mentoring from industry experts within our community. Whether you are a beginner or a seasoned developer, there is a place for you to learn and contribute.</p>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>What to expect</h3>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>Mentorship from senior software engineers</li>
          <li>Free meals and refreshments throughout the event</li>
          <li>Prizes for the top 3 teams</li>
        </ul>
        <p>Register your team of up to 4 members before October 1st.</p>
      </>
    )
  },
  'nasr-cup': {
    title: 'Register for the NASR Cup',
    category: 'Sports',
    author: 'Sports and Logistics Department',
    date: '1 day ago',
    content: (
      <>
        <p style={{ marginBottom: '24px' }}>Registration is now open for the upcoming NASR Football Cup. Form your teams and register before the deadline to secure your spot in this year's most anticipated sporting event.</p>
        <p style={{ marginBottom: '24px' }}>The NASR Cup brings together the best football talent from across the community for a weekend of competitive and fraternal sportsmanship. The venue is currently TBD, but matches will be scheduled over two consecutive weekends.</p>
        <p style={{ marginBottom: '24px' }}>Please ensure all team members have updated their community membership profiles before submitting the registration form.</p>
      </>
    )
  },
  'ai-bootcamp': {
    title: 'AI 2-Day Boot Camp Conclusion',
    category: 'Education',
    author: 'Education Board',
    date: '1 month ago',
    content: (
      <>
        <p style={{ marginBottom: '24px' }}>We are thrilled to announce the successful conclusion to our intensive AI 2-day boot camp, where over 50 students learned the fundamentals of machine learning and modern AI development.</p>
        <p style={{ marginBottom: '24px' }}>Hosted by the Education Board in collaboration with the Tech and AI Committee, the boot camp covered hands-on tutorials on neural networks, prompting techniques, and ethical AI usage.</p>
        <p style={{ marginBottom: '24px' }}>Certificates of completion will be emailed to all attendees by the end of the week. We look forward to hosting more advanced workshops in the near future.</p>
      </>
    )
  }
};

export default function UpdateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const data = updateData[resolvedParams.slug];
  
  const title = data?.title || resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const category = data?.category || 'Official Update';
  const author = data?.author || 'Community Administration';
  const date = data?.date || 'Recently';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/home" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Community Updates
        </Link>
      </div>

      <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>{category} &middot; Official Update</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-text-main)', lineHeight: 1.2 }}>{title}</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Published {date} by {author}</p>
      </div>

      <div style={{ fontSize: '1.125rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
        {data?.content ? (
          data.content
        ) : (
          <>
            <p style={{ marginBottom: '24px' }}>This is the full detail view for the update: <strong>{resolvedParams.slug}</strong>.</p>
            <p style={{ marginBottom: '24px' }}>This page represents the reusable update detail layout as requested. It uses the existing visual system and typography constraints. In a full implementation, this page would fetch the detailed update content by its slug from the backend.</p>
          </>
        )}
      </div>
      
      <div style={{ marginTop: '64px', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
        <Link href="/home" style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>&larr; View all updates</Link>
      </div>
    </div>
  );
}
