import { notFound } from "next/navigation";
import { getMarketplaceListingById } from "@/lib/actions/marketplace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MapPin, Building, Calendar, Info, Tag, BedDouble, Bath, Maximize } from "lucide-react";
import styles from "./page.module.css";
import ClientActions from "./ClientActions";
import Link from "next/link";

export default async function MemberListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getMarketplaceListingById(params.id);
  
  if (!listing) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;
  const isOwner = currentUserId === listing.sellerId;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/marketplace/member-marketplace">Member Marketplace</Link>
        <span>/</span>
        <span className="text-muted">{listing.title}</span>
      </div>

      <div className={styles.layout}>
        <div className={styles.mainCol}>
          {/* Gallery */}
          <div className={styles.gallery}>
            {listing.images?.length > 0 ? (
              <img src={listing.images[0].url} alt={listing.title} className={styles.mainImage} />
            ) : (
              <div className="flex-center" style={{ height: '400px', background: '#e2e8f0', color: '#94a3b8' }}>
                <Building size={64} />
              </div>
            )}
          </div>

          {/* Title & Mobile Header */}
          <div className={styles.titleSection}>
            <div className={styles.metaBadge}>{listing.category}</div>
            <h1 className={styles.title}>{listing.title}</h1>
            <div className={styles.location}>
              <MapPin size={16} />
              {listing.location || listing.city || "Location not specified"}
            </div>
            
            <div className={styles.mobilePriceBox}>
              <div className={styles.price}>
                {listing.price ? `${listing.currency === 'INR' ? '₹' : listing.currency} ${listing.price.toLocaleString()}` : "Price Not Specified"}
              </div>
              <div className={styles.transactionType}>{listing.transactionType}</div>
            </div>
          </div>

          <div className={styles.divider}></div>

          {/* Description */}
          <section className={styles.section}>
            <h2>Description</h2>
            <p className={styles.description}>{listing.description || listing.shortDescription}</p>
          </section>

          {/* Details & Specs */}
          <section className={styles.section}>
            <h2>Details</h2>
            <div className={styles.detailsGrid}>
              {listing.condition && (
                <div className={styles.detailItem}>
                  <Tag size={18} className="text-muted" />
                  <div>
                    <div className={styles.detailLabel}>Condition</div>
                    <div>{listing.condition}</div>
                  </div>
                </div>
              )}
              
              {listing.propertyType && (
                <div className={styles.detailItem}>
                  <Building size={18} className="text-muted" />
                  <div>
                    <div className={styles.detailLabel}>Property Type</div>
                    <div>{listing.propertyType}</div>
                  </div>
                </div>
              )}

              {listing.bedrooms && (
                <div className={styles.detailItem}>
                  <BedDouble size={18} className="text-muted" />
                  <div>
                    <div className={styles.detailLabel}>Bedrooms</div>
                    <div>{listing.bedrooms}</div>
                  </div>
                </div>
              )}

              {listing.bathrooms && (
                <div className={styles.detailItem}>
                  <Bath size={18} className="text-muted" />
                  <div>
                    <div className={styles.detailLabel}>Bathrooms</div>
                    <div>{listing.bathrooms}</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebarCol}>
          <div className={styles.priceCard}>
            <div className={styles.priceLabel}>{listing.transactionType}</div>
            <div className={styles.priceLarge}>
              {listing.price ? `${listing.currency === 'INR' ? '₹' : listing.currency} ${listing.price.toLocaleString()}` : "Contact for Price"}
            </div>
            {listing.isNegotiable && <div className={styles.negotiable}>Price Negotiable</div>}
            
            <div className={styles.actionWrap}>
              <ClientActions listingId={listing.id} isOwner={isOwner} />
            </div>
          </div>

          <div className={styles.sellerCard}>
            <h3>Seller Information</h3>
            <div className={styles.sellerHeader}>
              <div className={styles.sellerAvatar}>
                {listing.seller?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className={styles.sellerName}>{listing.seller?.name || "Community Member"}</div>
                <div className="text-muted small-text">Member</div>
              </div>
            </div>
          </div>
          
          <button className={styles.reportBtn}>Report Listing</button>
        </div>
      </div>
    </div>
  );
}
