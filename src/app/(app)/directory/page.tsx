import Link from "next/link";
import { Suspense } from "react";
import * as motion from "framer-motion/client";
import { getDirectoryListings } from "@/lib/actions/directory";
import styles from "./page.module.css";
import { Search, Building2, Briefcase, UserSquare2, ArrowRight, Phone, MessageCircle } from "lucide-react";
import SearchForm from "./SearchForm";

export const metadata = {
  title: "Directory | KSIJ One",
  description: "Find businesses, professionals and services across the community.",
};

const CATEGORIES = [
  "Healthcare", "Construction & Real Estate", "Events & Decor", "Travel & Transport",
  "Hospitality & Food", "Retail & Shopping", "Technology & Digital", "Education",
  "Professional Services", "Import & Export", "Manufacturing & Industrial", "Media & Publishing", "Other"
];

export default async function DirectoryPage() {
  const listings = await getDirectoryListings();
  const recentListings = listings.slice(0, 6); // Just take the latest 6

  return (
    <div className="w-full">
      
      {/* Hero & Search (Full Bleed) */}
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className={styles.heroEyebrow}>DIRECTORY</span>
            <h1 className="h1 mb-16" style={{ color: 'var(--color-primary-dark)' }}>Find your community.</h1>
            <p className={styles.subtitle}>Find businesses, professionals and services across the community.</p>
            
            <div className={styles.headerActions}>
              <Link href="/directory/my-directory" className="btn btn-secondary">
                My Dashboard & Chats
              </Link>
              <Link href="/directory/list-yourself" className="btn btn-primary">
                List Yourself <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className={styles.searchContainer}>
          <Suspense fallback={<div style={{ padding: '16px', textAlign: 'center' }}>Loading search...</div>}>
            <SearchForm />
          </Suspense>
          
          <div className={styles.searchHelpers}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginRight: '8px' }}>Try:</span>
            <Link href="/directory/search?q=Web Developer" className={styles.helperTag}>Web Developer</Link>
            <Link href="/directory/search?q=AC Repair" className={styles.helperTag}>AC Repair</Link>
            <Link href="/directory/search?q=Dentist" className={styles.helperTag}>Dentist</Link>
          </div>
        </motion.div>
        </div>
      </section>

      {/* Browse by Type */}
      <section className="section-padding bg-light-green">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="h2 mb-48" style={{ textAlign: 'center' }}>Browse by type</h2>
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
          </motion.div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section-padding bg-white">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="h2 mb-32">Popular categories</h2>
            <div className={styles.catGrid}>
              {CATEGORIES.map(cat => (
                <Link key={cat} href={`/directory/search?category=${encodeURIComponent(cat)}`} className={styles.catPill}>
                  {cat}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured / Recently Added */}
      <section className="section-padding bg-light-green">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="h2 mb-32">Recently added</h2>
        
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span>{listing.location || 'Remote'}</span>
                    {(listing as any).contact?.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-main)' }}>
                        <Phone size={14} /> 
                        <span style={{ fontSize: '0.875rem' }}>{(listing as any).contact.phone}</span>
                        <MessageCircle size={14} color="#25D366" />
                      </div>
                    )}
                  </div>
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
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-dark-green" style={{ color: 'white' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={styles.ctaBox}>
            <h2 className="h1 mb-16" style={{ color: 'white' }}>Want to be listed?</h2>
            <p className={styles.ctaDesc}>Add your business, service or professional profile to the community directory to reach more people.</p>
            <Link href="/directory/list-yourself" className="btn btn-primary" style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-very-dark)' }}>
              List Yourself <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
