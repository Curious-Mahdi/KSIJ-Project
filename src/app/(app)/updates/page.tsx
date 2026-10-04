import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UpdatesPage() {
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/home" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600, marginBottom: '16px' }}>Community Updates</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '48px', fontSize: '1.125rem' }}>Stay informed with the latest announcements and news from across the community.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Mock Update List */}
        <article style={{ padding: '24px 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>KSIJ Management</span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>Administration &middot; Just now</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Annual membership renewal is now open</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '12px' }}>Please update your details and complete the process by the end of the month.</p>
          <Link href="/updates/membership" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>Read announcement &rarr;</Link>
        </article>

        <article style={{ padding: '24px 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>KSIJ Education Board</span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>Education &middot; 2 hours ago</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Higher Education Scholarship 2024</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '12px' }}>Applications are now open for the Higher Education Scholarship program.</p>
          <Link href="/updates/scholarship" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>Read more &rarr;</Link>
        </article>
      </div>
    </div>
  );
}
