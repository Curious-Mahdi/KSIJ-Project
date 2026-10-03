import { notFound } from "next/navigation";
import { getCommunityPropertyById } from "@/lib/actions/marketplace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MapPin, Building, Info, Users, ShieldCheck } from "lucide-react";
import styles from "../../member-marketplace/[id]/page.module.css";
import ClientActions from "./ClientActions";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function CommunityPropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getCommunityPropertyById(params.id);
  
  if (!property) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  let isAdmin = false;
  
  if (session?.user) {
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    isAdmin = !!user?.isAdmin;
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/marketplace/community-properties">Community Properties</Link>
        <span>/</span>
        <span className="text-muted">{property.name}</span>
      </div>

      <div className={styles.layout}>
        <div className={styles.mainCol}>
          {/* Gallery */}
          <div className={styles.gallery}>
            {property.images?.length > 0 ? (
              <img src={property.images[0].url} alt={property.name} className={styles.mainImage} />
            ) : (
              <div className="flex-center" style={{ height: '400px', background: '#e2e8f0', color: '#94a3b8' }}>
                <Building size={64} />
              </div>
            )}
          </div>

          {/* Title & Mobile Header */}
          <div className={styles.titleSection}>
            <div className={styles.metaBadge}>{property.propertyType}</div>
            <h1 className={styles.title}>{property.name}</h1>
            <div className={styles.location}>
              <MapPin size={16} />
              {property.location || property.city || "Location not specified"}
            </div>
            
            <div className={styles.mobilePriceBox}>
              <div className={styles.price}>
                {property.pricing || "Contact for Pricing"}
              </div>
              <div className={styles.transactionType}>Jamaat Managed</div>
            </div>
          </div>

          <div className={styles.divider}></div>

          {/* Description */}
          <section className={styles.section}>
            <h2>About this Property</h2>
            <p className={styles.description}>{property.description}</p>
          </section>

          {/* Details & Specs */}
          <section className={styles.section}>
            <h2>Facilities & Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <Building size={18} className="text-muted" />
                <div>
                  <div className={styles.detailLabel}>Property Type</div>
                  <div>{property.propertyType}</div>
                </div>
              </div>

              {property.capacity && (
                <div className={styles.detailItem}>
                  <Users size={18} className="text-muted" />
                  <div>
                    <div className={styles.detailLabel}>Capacity</div>
                    <div>Up to {property.capacity} people</div>
                  </div>
                </div>
              )}

              {property.availabilityInfo && (
                <div className={styles.detailItem}>
                  <Info size={18} className="text-muted" />
                  <div>
                    <div className={styles.detailLabel}>Availability</div>
                    <div>{property.availabilityInfo}</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebarCol}>
          <div className={styles.priceCard}>
            <div className={styles.priceLabel}>Pricing</div>
            <div className={styles.priceLarge}>
              {property.pricing || "Contact for Quote"}
            </div>
            
            <div className={styles.actionWrap}>
              <ClientActions propertyId={property.id} isAdmin={isAdmin} />
            </div>
          </div>

          <div className={styles.sellerCard}>
            <h3>Managed By</h3>
            <div className={styles.sellerHeader}>
              <div className={styles.sellerAvatar} style={{ background: 'var(--color-primary)', color: 'white' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className={styles.sellerName}>Jamaat Administration</div>
                <div className="text-muted small-text">Official Property</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
