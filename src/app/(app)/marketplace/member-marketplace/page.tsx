import Link from "next/link";
import { Plus, MapPin, Building } from "lucide-react";
import styles from "./page.module.css";
import cardStyles from "../page.module.css";
import { getMarketplaceListings } from "@/lib/actions/marketplace";

export default async function MemberMarketplacePage({ searchParams }: { searchParams: any }) {
  const listings = await getMarketplaceListings(searchParams);

  const categories = [
    "PROPERTY", "VEHICLES", "ELECTRONICS", "FURNITURE", 
    "HOME_APPLIANCES", "BOOKS_EDUCATION", "CLOTHING_ACCESSORIES", "OTHER"
  ];
  const types = ["SALE", "RENT", "LEASE", "FREE", "OTHER"];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Member Marketplace</h1>
          <p className={styles.subtitle}>Buy, sell or rent directly with members of the community.</p>
        </div>
        <div className={styles.actions}>
          <Link href="/marketplace/list-something" className={styles.btnPrimary}>
            <Plus size={20} />
            List Something
          </Link>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Category</h3>
            <div className={styles.filterItem}>
              <Link href="/marketplace/member-marketplace" style={{color: 'inherit', textDecoration: 'none'}}>All Categories</Link>
            </div>
            {categories.map(c => (
              <div key={c} className={styles.filterItem}>
                <Link href={`/marketplace/member-marketplace?category=${c}`} style={{color: 'inherit', textDecoration: 'none', fontWeight: searchParams.category === c ? 'bold' : 'normal'}}>
                  {c.replace('_', ' ')}
                </Link>
              </div>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Transaction Type</h3>
            {types.map(t => (
              <div key={t} className={styles.filterItem}>
                <Link href={`/marketplace/member-marketplace?transactionType=${t}`} style={{color: 'inherit', textDecoration: 'none', fontWeight: searchParams.transactionType === t ? 'bold' : 'normal'}}>
                  {t}
                </Link>
              </div>
            ))}
          </div>
        </aside>

        <main>
          {listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-light)' }}>No listings found.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {listings.map((listing: any) => (
                <Link href={`/marketplace/member-marketplace/${listing.id}`} key={listing.id} className={cardStyles.card}>
                  <div className={cardStyles.cardImgWrap}>
                    <div className={cardStyles.cardBadge} style={{ background: 'var(--color-ink)', color: 'white' }}>
                      {listing.transactionType}
                    </div>
                    {listing.images?.[0]?.url ? (
                      <img src={listing.images[0].url} alt={listing.title} className={cardStyles.cardImg} />
                    ) : (
                      <div className="flex-center" style={{ height: '100%', background: '#e2e8f0', color: '#94a3b8' }}>
                        <Building size={48} />
                      </div>
                    )}
                  </div>
                  <div className={cardStyles.cardContent}>
                    <div className={cardStyles.cardPrice}>
                      {listing.price ? `${listing.currency} ${listing.price.toLocaleString()}` : "Price Not Specified"}
                    </div>
                    <h3 className={cardStyles.cardTitle} style={{ fontSize: '1rem' }}>{listing.title}</h3>
                    <div className={cardStyles.cardLocation}>
                      <MapPin size={14} />
                      {listing.location || listing.city || "Location not specified"}
                    </div>
                    <div className={cardStyles.cardMeta}>
                      <span>{listing.category}</span>
                      <span style={{ fontSize: '0.7rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>
                        MEMBER LISTING
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
