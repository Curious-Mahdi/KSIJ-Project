import { getListingById } from "@/lib/actions/directory";
import { notFound } from "next/navigation";
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
    <div className={styles.container}>
      
      <div className={`${styles.header} animateFadeUp`}>
        <div className={styles.avatar}>
          {listing.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.type}>
          {listing.listingType} &middot; {listing.category}
          {listing.verificationStatus === 'VERIFIED' && <span style={{ marginLeft: '12px', fontSize: '0.75rem', backgroundColor: '#D4EDDA', color: '#155724', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>Verified Community Profile</span>}
          {listing.sourceType === 'COMMUNITY_DIRECTORY_SCAN' && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>From Community Directory</span>}
        </div>
        <h1 className={styles.title}>{listing.name}</h1>
        <p className={styles.subtitle}>{listing.shortDescription}</p>
      </div>

      <div className={`${styles.layout} animateFadeUp delay-100`}>
        
        {/* Main Content */}
        <div className={styles.main}>
          
          {listing.description && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <div className={styles.about}>{listing.description}</div>
            </div>
          )}

          {allTags.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Services & Skills</h2>
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
            <h3 className={styles.cardTitle}>Details</h3>
            
            <div className={styles.metaList}>
              {listing.subcategory && (
                <div className={styles.metaItem}>
                  <User size={20} className={styles.metaIcon} />
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specialty</div>
                    <div className={styles.metaValue}>{listing.subcategory}</div>
                  </div>
                </div>
              )}
              
              <div className={styles.metaItem}>
                <MonitorSmartphone size={20} className={styles.metaIcon} />
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service Mode</div>
                  <div className={styles.metaValue}>{listing.serviceMode || 'Not specified'}</div>
                </div>
              </div>

              {listing.location || listing.city || listing.area ? (
                <div className={styles.metaItem}>
                  <MapPin size={20} className={styles.metaIcon} />
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
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
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service Area</div>
                    <div className={styles.metaValue}>{listing.serviceArea}</div>
                  </div>
                </div>
              )}

              {listing.website && (
                <div className={styles.metaItem}>
                  <LinkIcon size={20} className={styles.metaIcon} />
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Website</div>
                    <a href={listing.website.startsWith('http') ? listing.website : `https://${listing.website}`} target="_blank" rel="noopener noreferrer" className={styles.metaValue} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                      {listing.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {!isOwner && (
              <ConnectButton listingId={listing.id} />
            )}
            
            {isOwner && (
              <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--color-primary)', fontWeight: 600, padding: '16px', backgroundColor: 'var(--color-surface-success)', borderRadius: '12px' }}>
                This is your listing.
              </div>
            )}
            
          </div>

        </div>

      </div>

    </div>
  );
}
