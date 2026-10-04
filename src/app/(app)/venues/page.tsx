import Link from "next/link";
import * as motion from "framer-motion/client";
import { Search, MapPin, Building, Plus, ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import { getCommunityProperties } from "@/lib/actions/marketplace";

export default async function VenuesPage() {
  // Fetch a small selection of recent listings for the landing page
  const communityProperties = await getCommunityProperties();
  

  return (
    <div className="w-full">
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className={styles.heroEyebrow}>VENUES</span>
            <h1 className="h1 mb-16" style={{ color: 'var(--color-primary-dark)' }}>Community Venues</h1>
            <p className={styles.subtitle}>Explore and book official Jamaat venues, halls, and community spaces for your upcoming events.</p>
            
            <div className={styles.searchContainer}>
              <form className={styles.searchBar} action="/venues/search">
                <input 
                  type="text" 
                  name="q"
                  placeholder="Search venues, halls, and facilities..." 
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

      {/* Jamaat Venues Section */}
      <section className="section-padding bg-light-green">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className="h2 mb-8">Jamaat Venues</h2>
                <p className={styles.sectionSubtitle}>Official halls, banquets, and spaces managed by the Jamaat.</p>
              </div>
              <Link href="/venues" className="btn btn-secondary">
                Explore Jamaat Venues
              </Link>
            </div>
        
        <div className={styles.grid}>
          {communityProperties.length > 0 ? communityProperties.slice(0, 3).map((prop: any) => (
            <Link href={`/venues/${prop.id}`} key={prop.id} className={styles.card}>
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

      

      
    </div>
  );
}
