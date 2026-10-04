import Link from "next/link";
import { Suspense } from "react";
import { getDirectoryListings } from "@/lib/actions/directory";
import styles from "./page.module.css";
import { Search, Building2, Briefcase, UserSquare2, ArrowRight } from "lucide-react";
import SearchForm from "./SearchForm";

export const metadata = {
  title: "Directory | KSIJ Reload",
  description: "Find businesses, professionals and services across the community.",
};

const CATEGORIES = [
  "Healthcare", "Education", "Technology & Digital", "Food & Dining",
  "Retail & Shopping", "Professional Services", "Home Services",
  "Travel & Transport", "Personal Services", "Other"
];

export default async function DirectoryPage() {
  const listings = await getDirectoryListings();
  const recentListings = listings.slice(0, 6); // Just take the latest 6

  return (
    <div className={styles.container}>
      
      {/* Hero & Search */}
      <div className={styles.hero}>
        <div className="animateFadeUp">
          <h1 className={styles.title}>Directory</h1>
          <p className={styles.subtitle}>Find businesses, professionals and services across the community.</p>
          
          <div className={styles.headerActions}>
            <Link href="/directory/my-directory" className={styles.secondaryBtn}>
              My Dashboard & Chats
            </Link>
            <Link href="/directory/list-yourself" className={styles.primaryBtn}>
              List Yourself <ArrowRight size={16} style={{marginLeft: '8px'}} />
            </Link>
          </div>
        </div>

        <div className={`${styles.searchContainer} animateFadeUp delay-100`}>
          <Suspense fallback={<div style={{ padding: '16px', textAlign: 'center' }}>Loading search...</div>}>
            <SearchForm />
          </Suspense>
          
          <div className={styles.searchHelpers}>
            <Link href="/directory/search?q=Web Developer" className={styles.helperTag}>Try: Web Developer</Link>
            <Link href="/directory/search?q=AC Repair" className={styles.helperTag}>Try: AC Repair</Link>
            <Link href="/directory/search?q=Dentist" className={styles.helperTag}>Try: Dentist</Link>
          </div>
        </div>
      </div>

      {/* Browse by Type */}
      <div className={`${styles.section} animateFadeUp delay-200`}>
        <h2 className={styles.sectionTitle}>Browse by type</h2>
        <div className={styles.typeGrid}>
          <Link href="/directory/search?type=Business" className={styles.typeCard}>
            <div className={styles.typeIcon}><Building2 size={32} /></div>
            <div className={styles.typeName}>Businesses</div>
            <div className={styles.typeDesc}>Shops, agencies, clinics and companies</div>
          </Link>
          
          <Link href="/directory/search?type=Service" className={styles.typeCard}>
            <div className={styles.typeIcon}><Briefcase size={32} /></div>
            <div className={styles.typeName}>Services</div>
            <div className={styles.typeDesc}>Freelancers, agencies, digital and physical services</div>
          </Link>
          
          <Link href="/directory/search?type=Professional" className={styles.typeCard}>
            <div className={styles.typeIcon}><UserSquare2 size={32} /></div>
            <div className={styles.typeName}>Professionals</div>
            <div className={styles.typeDesc}>Doctors, lawyers, engineers and consultants</div>
          </Link>
        </div>
      </div>

      {/* Popular Categories */}
      <div className={`${styles.section} animateFadeUp delay-300`}>
        <h2 className={styles.sectionTitle}>Popular categories</h2>
        <div className={styles.catGrid}>
          {CATEGORIES.map(cat => (
            <Link key={cat} href={`/directory/search?category=${encodeURIComponent(cat)}`} className={styles.catPill}>
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured / Recently Added */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recently added</h2>
        
        {recentListings.length > 0 ? (
          <div className={styles.listingGrid}>
            {recentListings.map(listing => (
              <Link href={`/directory/${listing.id}`} key={listing.id} className={styles.listingCard}>
                <div className={styles.listingMeta}>
                  {listing.listingType} &middot; {listing.category}
                </div>
                <h3 className={styles.listingName}>{listing.name}</h3>
                <p className={styles.listingDesc}>{listing.shortDescription}</p>
                <div className={styles.listingFooter}>
                  <span>{listing.location || 'Remote'}</span>
                  <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View profile <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px', backgroundColor: 'var(--color-surface)', borderRadius: '1rem', border: '1px solid var(--color-border)'}}>
            <h3 style={{fontSize: '1.25rem', marginBottom: '8px'}}>No listings yet</h3>
            <p style={{color: 'var(--color-text-secondary)'}}>Be the first to list your business, service, or profession!</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className={styles.ctaBox}>
        <h2 className={styles.ctaTitle}>Want to be listed?</h2>
        <p className={styles.ctaDesc}>Add your business, service or professional profile to the community directory to reach more people.</p>
        <Link href="/directory/list-yourself" className={styles.ctaBtn}>
          List Yourself <ArrowRight size={20} />
        </Link>
      </div>

    </div>
  );
}
