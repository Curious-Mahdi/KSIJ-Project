import { getListingById } from "@/lib/actions/directory";
import { notFound } from "next/navigation";
import * as motion from "framer-motion/client";
import styles from "./page.module.css";
import { MapPin, MonitorSmartphone, Link as LinkIcon, User } from "lucide-react";
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
              {(listing as any).contact?.phone && (
                <div style={{ padding: '16px', backgroundColor: '#F0F9F4', border: '1px solid #D4EDDA', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="#25D366">
                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.12.551 4.195 1.597 6.02L.15 23.473l5.568-1.46c1.764.954 3.742 1.458 5.766 1.46h.005c6.645 0 12.031-5.386 12.031-12.032 0-3.221-1.254-6.25-3.533-8.529C17.708 1.253 14.935 0 12.031 0zm.005 21.493h-.003c-1.785 0-3.536-.48-5.074-1.39l-.364-.216-3.771.99.99-3.68-.237-.376A9.972 9.972 0 011.986 12.03c0-5.525 4.496-10.021 10.024-10.021 2.678 0 5.195 1.042 7.087 2.935A10.023 10.023 0 0122.03 12.03c0 5.525-4.496 10.022-10.024 10.022l.029.441zM17.534 14.5c-.302-.152-1.789-.884-2.066-.985-.276-.102-.477-.152-.678.152-.202.302-.781.985-.956 1.186-.176.202-.352.227-.654.076-1.554-.775-2.73-1.636-3.784-3.398-.176-.301.177-.278.473-.865.101-.202.05-.378-.025-.53-.075-.152-.678-1.638-.928-2.242-.243-.591-.49-.51-.678-.519-.176-.008-.377-.01-.578-.01-.202 0-.528.076-.804.378-.276.302-1.055 1.031-1.055 2.514 0 1.483 1.08 2.915 1.231 3.116.152.202 2.122 3.238 5.138 4.54 1.956.845 2.76.772 3.255.702.684-.096 1.789-.73 2.04-1.436.251-.705.251-1.31.176-1.436-.075-.126-.276-.202-.578-.354z"/>
                  </svg>
                  <div>
                    <div style={{ color: 'var(--color-primary-dark)', fontWeight: 600, fontSize: '1.125rem' }}>
                      {(listing as any).contact.phone}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                      Official WhatsApp Number
                    </div>
                  </div>
                </div>
              )}
              
              {isOwner && (
                <div style={{ textAlign: 'center', color: 'var(--color-primary-dark)', fontWeight: 600, padding: '16px', backgroundColor: 'var(--color-accent-gold)', borderRadius: 'var(--radius-xl)', marginTop: '16px' }}>
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
