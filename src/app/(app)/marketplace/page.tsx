import Link from "next/link";
import * as motion from "framer-motion/client";
import { Search, MapPin, Building, Plus, ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import { getMarketplaceListings, getCommunityProperties } from "@/lib/actions/marketplace";

export default async function MarketplacePage() {
  // Fetch a small selection of recent listings for the landing page
  const communityProperties = await getCommunityProperties();
  const memberListings = await getMarketplaceListings();

  return (
    <div className="w-full">
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className={styles.heroEyebrow}>MARKETPLACE</span>
            <h1 className="h1 mb-16" style={{ color: 'var(--color-primary-dark)' }}>Discover the community.</h1>
            <p className={styles.subtitle}>Discover community spaces, properties and items available within the community.</p>
            
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
          </motion.div>
        </div>
      </section>

      {/* Community Properties Section */}
      <section className="section-padding bg-light-green">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className="h2 mb-8">Community Properties</h2>
                <p className={styles.sectionSubtitle}>Explore venues and facilities managed by the Jamaat and community organizations.</p>
              </div>
              <Link href="/marketplace/community-properties" className="btn btn-secondary">
                Explore Community Properties
              </Link>
            </div>
        
        <div className={styles.grid}>
          {communityProperties.length > 0 ? communityProperties.slice(0, 3).map((prop: any) => (
            <Link href={`/marketplace/community-properties/${prop.id}`} key={prop.id} className={styles.card}>
              <div className={styles.cardImgWrap} style={{ aspectRatio: '4/3' }}>
                <div className={styles.cardBadge} style={{ background: 'var(--color-primary)', color: 'white' }}>OFFICIAL PROPERTY</div>
                {prop.images?.[0]?.url ? (
                  <img src={prop.images[0].url} alt={prop.name} className={styles.cardImg} />
                ) : (
                  <div className="flex-center" style={{ height: '100%', background: 'var(--color-surface-success)', color: 'var(--color-primary-light)' }}>
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
                {prop.pricing && (
                  <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                    {prop.pricing}
                  </div>
                )}
                <div style={{ marginTop: 'auto', textAlign: 'center', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                  View Property
                </div>
              </div>
            </Link>
          )) : (
            <p className="text-muted">No community properties listed yet.</p>
          )}
        </div>
        </motion.div>
        </div>
      </section>

      {/* Member Marketplace Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className="h2 mb-8">Member Marketplace</h2>
                <p className={styles.sectionSubtitle}>Buy, sell or rent directly with members of the community.</p>
              </div>
              <Link href="/marketplace/member-marketplace" className="btn btn-secondary">
                Browse Marketplace
              </Link>
            </div>
        
        <div className={styles.grid}>
          {memberListings.length > 0 ? memberListings.slice(0, 4).map((listing: any) => (
            <Link href={`/marketplace/member-marketplace/${listing.id}`} key={listing.id} className={styles.card}>
              <div className={styles.cardImgWrap}>
                <div className={styles.cardBadge} style={{ background: 'var(--color-very-dark)', color: 'white' }}>
                  {listing.transactionType}
                </div>
                {listing.images?.[0]?.url ? (
                  <img src={listing.images[0].url} alt={listing.title} className={styles.cardImg} />
                ) : (
                  <div className="flex-center" style={{ height: '100%', background: 'var(--color-surface-success)', color: 'var(--color-primary-light)' }}>
                    <Building size={48} />
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardPrice} style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '4px' }}>
                  {listing.price ? `${listing.currency === 'INR' ? '₹' : listing.currency} ${listing.price.toLocaleString()}` : "Price Not Specified"}
                </div>
                <h3 className={styles.cardTitle} style={{ fontSize: '1rem' }}>{listing.title}</h3>
                <div className={styles.cardLocation}>
                  <MapPin size={14} />
                  {listing.location || listing.city || "Mumbai"}
                </div>
                <div className={styles.cardMeta} style={{ marginTop: 'auto', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{listing.category}</span>
                  <span style={{ fontSize: '0.7rem', background: 'var(--color-border)', color: 'var(--color-text-main)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    MEMBER LISTING
                  </span>
                </div>
              </div>
            </Link>
          )) : (
            <p className="text-muted">No member listings yet.</p>
          )}
        </div>
        </motion.div>
        </div>
      </section>

      <Link href="/marketplace/list-something" className={styles.floatingActionButton}>
        <Plus size={24} />
        List Something
      </Link>
    </div>
  );
}
