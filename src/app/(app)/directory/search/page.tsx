import Link from "next/link";
import { Suspense } from "react";
import { getDirectoryListings } from "@/lib/actions/directory";
import styles from "./page.module.css";
import { Search as SearchIcon, ArrowRight, MapPin } from "lucide-react";
import SearchForm from "../SearchForm";

export const metadata = {
  title: "Search Results | KSIJ One Directory",
};

const CATEGORIES = [
  "Healthcare", "Construction & Real Estate", "Events & Decor", "Travel & Transport",
  "Hospitality & Food", "Retail & Shopping", "Technology & Digital", "Education",
  "Professional Services", "Import & Export", "Manufacturing & Industrial", "Media & Publishing", "Other"
];

// Note: In Next.js 15, searchParams is a Promise. We need to await it.
// Next.js 14 it's sync, but to be safe we type it accordingly or use React.use() if needed.
// Based on the version "16.3.8", it's definitely async.
export default async function DirectorySearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const type = params.type || "All";
  const category = params.category || "All";

  const listings = await getDirectoryListings({ q, type, category });

  return (
    <div className={styles.container}>
      
      <div className={`${styles.header} animateFadeUp`}>
        <h1 className={styles.title}>Directory Search</h1>
        <div style={{ maxWidth: '600px' }}>
          <Suspense fallback={<div className={styles.searchInput}>Loading search...</div>}>
            <SearchForm initialQuery={q} />
          </Suspense>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar Filters */}
        <div className={`${styles.sidebar} animateFadeUp delay-100`}>
          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>Listing Type</div>
            <Link 
              href={`/directory/search?q=${q}&category=${category}&type=All`} 
              className={`${styles.filterLink} ${type === 'All' ? styles.filterLinkActive : ''}`}
            >
              All Types
            </Link>
            <Link 
              href={`/directory/search?q=${q}&category=${category}&type=Business`} 
              className={`${styles.filterLink} ${type === 'Business' ? styles.filterLinkActive : ''}`}
            >
              Business
            </Link>
            <Link 
              href={`/directory/search?q=${q}&category=${category}&type=Service`} 
              className={`${styles.filterLink} ${type === 'Service' ? styles.filterLinkActive : ''}`}
            >
              Service
            </Link>
            <Link 
              href={`/directory/search?q=${q}&category=${category}&type=Professional`} 
              className={`${styles.filterLink} ${type === 'Professional' ? styles.filterLinkActive : ''}`}
            >
              Professional
            </Link>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>Category</div>
            <Link 
              href={`/directory/search?q=${q}&type=${type}&category=All`} 
              className={`${styles.filterLink} ${category === 'All' ? styles.filterLinkActive : ''}`}
            >
              All Categories
            </Link>
            {CATEGORIES.map(cat => (
              <Link 
                key={cat}
                href={`/directory/search?q=${q}&type=${type}&category=${encodeURIComponent(cat)}`} 
                className={`${styles.filterLink} ${category === cat ? styles.filterLinkActive : ''}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className={`${styles.results} animateFadeUp delay-200`}>
          <div className={styles.resultsHeader}>
            <div>
              {q ? (
                <>Search results for <strong>&quot;{q}&quot;</strong></>
              ) : (
                <>Showing all listings</>
              )}
            </div>
            <div>{listings.length} results</div>
          </div>

          {listings.length > 0 ? (
            <div className={styles.listingList}>
              {listings.map(listing => {
                let services = [];
                try {
                  services = JSON.parse(listing.services);
                } catch(e){}
                
                return (
                  <Link href={`/directory/${listing.id}`} key={listing.id} className={styles.listingCard}>
                    
                    <div className={styles.cardHeader}>
                      <div className={styles.avatar}>
                        {listing.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.cardMeta}>
                        <div className={styles.cardType}>{listing.listingType} &middot; {listing.category}</div>
                        <div className={styles.cardTitle}>{listing.name}</div>
                        {listing.subcategory && <div className={styles.cardSubcat}>{listing.subcategory}</div>}
                      </div>
                    </div>

                    {services.length > 0 && (
                      <div className={styles.cardTags}>
                        {services.slice(0, 5).map((s: string, i: number) => (
                          <span key={i} className={styles.tag}>{s}</span>
                        ))}
                        {services.length > 5 && <span className={styles.tag}>+{services.length - 5}</span>}
                      </div>
                    )}

                    <div className={styles.cardDesc}>
                      {listing.shortDescription}
                    </div>

                    <div className={styles.cardFooter}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={16} /> {listing.location || 'Remote'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600 }}>
                        View profile 
                        <div className={styles.linkArrow}>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>

                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <SearchIcon size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No matching listings found</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your filters or search keyword.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
