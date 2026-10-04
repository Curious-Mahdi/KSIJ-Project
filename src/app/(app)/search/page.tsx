"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/home" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Search size={24} color="var(--color-primary)" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Search Results</h1>
      </div>

      {query ? (
        <div style={{ padding: '32px', backgroundColor: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            Showing MVP search results for: <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>"{query}"</span>
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            This is the foundational search page. In production, this will query across Services, Directory, Events, Resources, and Community Updates.
          </p>
        </div>
      ) : (
        <div style={{ padding: '32px', backgroundColor: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>Please enter a search term on the homepage to see results.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: "48px 24px", textAlign: "center", color: "var(--color-text-secondary)" }}>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

