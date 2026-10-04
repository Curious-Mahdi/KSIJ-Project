import Link from "next/link";
import { Search, MapPin, Building, ArrowLeft } from "lucide-react";
import styles from "../page.module.css";
import { getMarketplaceListings, getCommunityProperties } from "@/lib/actions/marketplace";

export const metadata = {
  title: "Marketplace Search | KSIJ One",
  description: "Search community properties and marketplace listings.",
};

export default async function MarketplaceSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  // Execute both searches
  const communityProperties = await getCommunityProperties({ query });
  const memberListings = await getMarketplaceListings({ query });

  return (
    <div className={styles.container}>
      <section className={styles.hero} style={{ padding: '40px 16px 60px' }}>
        <Link href="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
        <h1>Search Results</h1>
        <p>Showing results for "{query}"</p>
        
        <div className={styles.searchContainer} style={{ marginTop: '24px' }}>
          <form className={styles.searchBar} action="/marketplace/search">
            <input 
              type="text" 
              name="q"
              defaultValue={query}
              placeholder="Search properties, venues, vehicles, electronics and more..." 
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>
              <Search size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* Community Properties Results */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Community Properties ({communityProperties.length})</h2>
        </div>
        
        <div className={styles.grid}>
          {communityProperties.length > 0 ? communityProperties.map((prop: any) => (
            <Link href={`/marketplace/community-properties/${prop.id}`} key={prop.id} className={styles.card}>
              <div className={styles.cardImgWrap} style={{ aspectRatio: '4/3' }}>
                <div className={styles.cardBadge} style={{ background: 'var(--color-primary)', color: 'white' }}>OFFICIAL COMMUNITY PROPERTY</div>
                {prop.images?.[0]?.url ? (
                  <img src={prop.images[0].url} alt={prop.name} className={styles.cardImg} />
                ) : (
                  <div className="flex-center" style={{ height: '100%', background: '#e2e8f0', color: '#94a3b8' }}>
                    <Building size={48} />
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{prop.name}</h3>
                <div className={styles.cardLocation}>
                  <span>{prop.propertyType}</span>
                  <span>{prop.location || prop.city || "Location not specified"}</span>
                </div>
                {prop.usageTags && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                    {prop.usageTags.split(',').join(' · ')}
                  </div>
                )}
                <div style={{ marginTop: 'auto', textAlign: 'center', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                  View Property
                </div>
              </div>
            </Link>
          )) : (
            <p className="text-muted" style={{ padding: '24px 0' }}>No community properties found matching "{query}".</p>
          )}
        </div>
      </section>

      {/* Member Marketplace Results */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Member Marketplace ({memberListings.length})</h2>
        </div>
        
        <div className={styles.grid}>
          {memberListings.length > 0 ? memberListings.map((listing: any) => (
            <Link href={`/marketplace/member-marketplace/${listing.id}`} key={listing.id} className={styles.card}>
              <div className={styles.cardImgWrap}>
                <div className={styles.cardBadge} style={{ background: 'var(--color-ink)', color: 'white' }}>
                  {listing.transactionType}
                </div>
                {listing.images?.[0]?.url ? (
                  <img src={listing.images[0].url} alt={listing.title} className={styles.cardImg} />
                ) : (
                  <div className="flex-center" style={{ height: '100%', background: '#f1f5f9', color: '#cbd5e1' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>No image</span>
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardPrice}>
                  {listing.currency || "INR"} {listing.price?.toLocaleString() || "Contact for price"}
                </div>
                <h3 className={styles.cardTitle}>{listing.title}</h3>
                <div className={styles.cardLocation}>
                  <MapPin size={14} /> {listing.location || "Location not specified"}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardCategory}>{listing.category}</span>
                  <span className={styles.cardDate}>
                    {new Date(listing.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </Link>
          )) : (
            <p className="text-muted" style={{ padding: '24px 0' }}>No member listings found matching "{query}".</p>
          )}
        </div>
      </section>

    </div>
  );
}
