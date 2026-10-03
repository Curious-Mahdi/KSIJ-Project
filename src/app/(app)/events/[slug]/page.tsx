import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>

      <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>OCTOBER 2024</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
          {resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Main Centre &middot; Open to all members</p>
      </div>

      <div style={{ fontSize: '1.125rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
        <p style={{ marginBottom: '24px' }}>This is the detail view for the event: <strong>{resolvedParams.slug}</strong>.</p>
        <p style={{ marginBottom: '24px' }}>In the complete production implementation, this page will show RSVP options, map locations, full schedules, and contact information for the event organizers.</p>
      </div>
    </div>
  );
}
