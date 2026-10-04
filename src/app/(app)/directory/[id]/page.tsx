import { getListingById } from "@/lib/actions/directory";
import { notFound } from "next/navigation";
import * as motion from "framer-motion/client";
import styles from "./page.module.css";
import { MapPin, MonitorSmartphone, Link as LinkIcon, User } from "lucide-react";
import ConnectButton from "./ConnectButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const listing = await getListingById(p.id);
  if (!listing) return { title: "Listing Not Found" };
  return { title: `${listing.name} | KSIJ One Directory` };
}

export default async function ListingProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const listing = await getListingById(p.id);
  
  if (!listing) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const isOwner = userId === listing.ownerId;

  let services = [];
  try { services = JSON.parse(listing.services); } catch(e){}
  
  let skills = [];
  try { skills = JSON.parse(listing.skills || "[]"); } catch(e){}

  const allTags = [...services, ...skills];

  return (
    <div className="w-full">
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={styles.header}>
            <div className={styles.avatar}>
              {listing.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.type}>
              {listing.listingType} &middot; {listing.category}
              {listing.verificationStatus === 'VERIFIED' && <span style={{ marginLeft: '12px', fontSize: '0.75rem', backgroundColor: '#D4EDDA', color: '#155724', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>Verified</span>}
              {listing.sourceType === 'COMMUNITY_DIRECTORY_SCAN' && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>From Directory</span>}
            </div>
            <h1 className="h1 mb-16" style={{ color: 'var(--color-primary-dark)' }}>{listing.name}</h1>
            <p className={styles.subtitle}>{listing.shortDescription}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.layout}>
        
        {/* Main Content */}
        <div className={styles.main}>
          
          {listing.description && (
            <div className={styles.section}>
              <h2 className="h2 mb-24" style={{ color: 'var(--color-primary-dark)' }}>About</h2>
              <div className={styles.about}>{listing.description}</div>
            </div>
          )}

          {allTags.length > 0 && (
            <div className={styles.section}>
              <h2 className="h2 mb-24" style={{ color: 'var(--color-primary-dark)' }}>Services & Skills</h2>
              <div className={styles.tags}>
                {allTags.map((tag: string, i: number) => (
                  <div key={i} className={styles.tag}>{tag}</div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.card}>
            <h3 className="h3 mb-24" style={{ color: 'var(--color-primary)' }}>Details</h3>
            
            <div className={styles.metaList}>
              {listing.subcategory && (
                <div className={styles.metaItem}>
                  <User size={20} className={styles.metaIcon} />
                  <div>
                    <div className={styles.metaLabel}>Specialty</div>
                    <div className={styles.metaValue}>{listing.subcategory}</div>
                  </div>
                </div>
              )}
              
              <div className={styles.metaItem}>
                <MonitorSmartphone size={20} className={styles.metaIcon} />
                <div>
                  <div className={styles.metaLabel}>Service Mode</div>
                  <div className={styles.metaValue}>{listing.serviceMode || 'Not specified'}</div>
                </div>
              </div>

              {listing.location || listing.city || listing.area ? (
                <div className={styles.metaItem}>
                  <MapPin size={20} className={styles.metaIcon} />
                  <div>
                    <div className={styles.metaLabel}>Location</div>
                    <div className={styles.metaValue}>
                      {listing.addressLine1 && <div>{listing.addressLine1}</div>}
                      {listing.addressLine2 && <div>{listing.addressLine2}</div>}
                      <div>{[listing.area, listing.city, listing.pincode].filter(Boolean).join(', ')}</div>
                      {(!listing.addressLine1 && !listing.area && !listing.city) && <div>{listing.location}</div>}
                    </div>
                  </div>
                </div>
              ) : null}

              {listing.serviceArea && (
                <div className={styles.metaItem}>
                  <MapPin size={20} className={styles.metaIcon} />
                  <div>
                    <div className={styles.metaLabel}>Service Area</div>
                    <div className={styles.metaValue}>{listing.serviceArea}</div>
                  </div>
                </div>
              )}

              {listing.website && (
                <div className={styles.metaItem}>
                  <LinkIcon size={20} className={styles.metaIcon} />
                  <div>
                    <div className={styles.metaLabel}>Website</div>
                    <a href={listing.website.startsWith('http') ? listing.website : `https://${listing.website}`} target="_blank" rel="noopener noreferrer" className={styles.metaValue} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                      {listing.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '32px' }}>
              {!isOwner && (
                <ConnectButton listingId={listing.id} />
              )}
              
              {isOwner && (
                <div style={{ textAlign: 'center', color: 'var(--color-primary-dark)', fontWeight: 600, padding: '16px', backgroundColor: 'var(--color-accent-gold)', borderRadius: 'var(--radius-xl)' }}>
                  This is your listing.
                </div>
              )}
            </div>
            
          </div>
        </div>

          </motion.div>
        </div>
      </section>

    </div>
  );
}
