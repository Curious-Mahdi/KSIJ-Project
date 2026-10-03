import Link from "next/link";
import { Search, MapPin, Building, Plus } from "lucide-react";
import styles from "./page.module.css";
import { getMarketplaceListings, getCommunityProperties } from "@/lib/actions/marketplace";

export default async function MarketplacePage() {
  // Fetch a small selection of recent listings for the landing page
  const communityProperties = await getCommunityProperties();
  const memberListings = await getMarketplaceListings();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Marketplace</h1>
        <p>Discover community spaces, properties and items available within the community.</p>
        
        <div className={styles.searchContainer}>
          <form className={styles.searchBar} action="/marketplace/search">
            <input 
              type="text" 
              name="q"
              placeholder="Search properties, venues, vehicles, electronics and more..." 
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>
              <Search size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* Community Properties Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Community Properties</h2>
            <p className={styles.sectionSubtitle}>Explore venues and facilities managed by the Jamaat and community organizations.</p>
          </div>
          <Link href="/marketplace/community-properties" className={styles.viewAllBtn}>
            Explore Community Properties
          </Link>
        </div>
        
        <div className={styles.grid}>
          {communityProperties.length > 0 ? communityProperties.slice(0, 3).map((prop: any) => (
            <Link href={`/marketplace/community-properties/${prop.id}`} key={prop.id} className={styles.card}>
              <div className={styles.cardImgWrap}>
                <div className={styles.cardBadge}>COMMUNITY PROPERTY</div>
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
                  <MapPin size={14} />
                  {prop.location || prop.city || "Location not specified"}
                </div>
                <div className={styles.cardMeta}>
                  <span>{prop.propertyType}</span>
                  {prop.capacity && <span>Cap: {prop.capacity}</span>}
                </div>
              </div>
            </Link>
          )) : (
            <p className="text-muted">No community properties listed yet.</p>
          )}
        </div>
      </section>

      {/* Member Marketplace Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Member Marketplace</h2>
            <p className={styles.sectionSubtitle}>Buy, sell or rent directly with members of the community.</p>
          </div>
          <Link href="/marketplace/member-marketplace" className={styles.viewAllBtn}>
            Browse Marketplace
          </Link>
        </div>
        
        <div className={styles.grid}>
          {memberListings.length > 0 ? memberListings.slice(0, 4).map((listing: any) => (
            <Link href={`/marketplace/member-marketplace/${listing.id}`} key={listing.id} className={styles.card}>
              <div className={styles.cardImgWrap}>
                <div className={styles.cardBadge} style={{ background: 'var(--color-ink)', color: 'white' }}>
                  {listing.transactionType}
                </div>
                {listing.images?.[0]?.url ? (
                  <img src={listing.images[0].url} alt={listing.title} className={styles.cardImg} />
                ) : (
                  <div className="flex-center" style={{ height: '100%', background: '#e2e8f0', color: '#94a3b8' }}>
                    <Building size={48} />
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardPrice}>
                  {listing.price ? `${listing.currency} ${listing.price.toLocaleString()}` : "Price Not Specified"}
                </div>
                <h3 className={styles.cardTitle} style={{ fontSize: '1rem' }}>{listing.title}</h3>
                <div className={styles.cardLocation}>
                  <MapPin size={14} />
                  {listing.location || listing.city || "Mumbai"}
                </div>
                <div className={styles.cardMeta}>
                  <span>{listing.category}</span>
                  <span style={{ fontSize: '0.7rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>
                    MEMBER LISTING
                  </span>
                </div>
              </div>
            </Link>
          )) : (
            <p className="text-muted">No member listings yet.</p>
          )}
        </div>
      </section>

      <Link href="/marketplace/list-something" className={styles.floatingActionButton}>
        <Plus size={24} />
        List Something
      </Link>
    </div>
  );
}
