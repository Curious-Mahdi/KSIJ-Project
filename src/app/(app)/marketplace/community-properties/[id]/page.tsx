import { notFound } from "next/navigation";
import { getCommunityPropertyById } from "@/lib/actions/marketplace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as motion from "framer-motion/client";
import { MapPin, Building, Info, Users, ShieldCheck } from "lucide-react";
import styles from "../../member-marketplace/[id]/page.module.css";
import ClientActions from "./ClientActions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CommunityPropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const property = await getCommunityPropertyById(resolvedParams.id);
  
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
    <div className="w-full">
      <div className="container" style={{ paddingTop: '32px' }}>
        <div className={styles.breadcrumb}>
          <Link href="/marketplace/community-properties">Community Properties</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>{property.name}</span>
        </div>
      </div>

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={styles.layout}>
            <div className={styles.mainCol}>
              {/* Gallery */}
              <div className={styles.gallery}>
                {property.images?.length > 0 ? (
                  <img src={property.images[0].url} alt={property.name} className={styles.mainImage} />
                ) : (
                  <div className="flex-center" style={{ height: '400px', background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                    <Building size={64} />
                  </div>
                )}
              </div>

              <div className={styles.titleSection}>
                <div className={styles.metaBadge}>OFFICIAL COMMUNITY PROPERTY</div>
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

              {property.usageTags && (
                <div className={styles.detailItem}>
                  <Info size={18} className="text-muted" />
                  <div>
                    <div className={styles.detailLabel}>Usage / Suitable For</div>
                    <div>{property.usageTags.split(',').join(' · ')}</div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {property.functionTimings && (
            <section className={styles.section} style={{ marginTop: '2rem' }}>
              <h2>Function Timings</h2>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                {property.functionTimings}
              </div>
            </section>
          )}

          {property.pricingDetails && (
            <section className={styles.section} style={{ marginTop: '2rem' }}>
              <h2>Detailed Pricing</h2>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, fontSize: '0.95rem' }}>
                  {(() => {
                    try {
                      const data = JSON.parse(property.pricingDetails);
                      return Object.entries(data).map(([key, val]) => {
                        return `${key.toUpperCase()}\n` + Object.entries(val as object).map(([k, v]) => `  ${k}: ${v}`).join('\n') + '\n\n';
                      }).join('');
                    } catch {
                      return property.pricingDetails;
                    }
                  })()}
                </pre>
              </div>
            </section>
          )}

          {property.termsAndConditions && (
            <section className={styles.section} style={{ marginTop: '2rem' }}>
              <h2>Terms & Conditions</h2>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                {property.termsAndConditions}
              </div>
            </section>
          )}


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
              <div className={styles.sellerAvatar}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className={styles.sellerName}>Jamaat Administration</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Official Property</div>
              </div>
            </div>
          </div>
        </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
