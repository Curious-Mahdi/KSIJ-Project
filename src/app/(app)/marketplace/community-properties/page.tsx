import Link from "next/link";
import { Plus, MapPin, Building, Users } from "lucide-react";
import styles from "./page.module.css";
import cardStyles from "../page.module.css";
import { getCommunityProperties } from "@/lib/actions/marketplace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function CommunityPropertiesPage({ searchParams }: { searchParams: any }) {
  const properties = await getCommunityProperties(searchParams);
  
  const session = await getServerSession(authOptions);
  let isAdmin = false;
  
  if (session?.user) {
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    isAdmin = !!user?.isAdmin;
  }

  const types = ["Hall", "Imambara", "Resort", "Event Space", "Sports Facility", "Other"];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Community Properties</h1>
          <p className={styles.subtitle}>Explore venues and facilities managed by the Jamaat.</p>
        </div>
        {isAdmin && (
          <div className={styles.actions}>
            <Link href="/marketplace/community-properties/create" className={styles.btnPrimary}>
              <Plus size={20} />
              Add Property
            </Link>
          </div>
        )}
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Property Type</h3>
            <div className={styles.filterItem}>
              <Link href="/marketplace/community-properties" style={{color: 'inherit', textDecoration: 'none'}}>All Types</Link>
            </div>
            {types.map(t => (
              <div key={t} className={styles.filterItem}>
                <Link href={`/marketplace/community-properties?type=${t}`} style={{color: 'inherit', textDecoration: 'none', fontWeight: searchParams.type === t ? 'bold' : 'normal'}}>
                  {t}
                </Link>
              </div>
            ))}
          </div>
        </aside>

        <main>
          {properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-light)' }}>No community properties found.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {properties.map((prop: any) => (
                <Link href={`/marketplace/community-properties/${prop.id}`} key={prop.id} className={cardStyles.card}>
                  <div className={cardStyles.cardImgWrap}>
                    <div className={cardStyles.cardBadge}>COMMUNITY PROPERTY</div>
                    {prop.images?.[0]?.url ? (
                      <img src={prop.images[0].url} alt={prop.name} className={cardStyles.cardImg} />
                    ) : (
                      <div className="flex-center" style={{ height: '100%', background: '#e2e8f0', color: '#94a3b8' }}>
                        <Building size={48} />
                      </div>
                    )}
                  </div>
                  <div className={cardStyles.cardContent}>
                    <h3 className={cardStyles.cardTitle}>{prop.name}</h3>
                    <div className={cardStyles.cardLocation}>
                      <MapPin size={14} />
                      {prop.location || prop.city || "Location not specified"}
                    </div>
                    <div className={cardStyles.cardMeta}>
                      <span>{prop.propertyType}</span>
                      {prop.capacity && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={14} /> {prop.capacity}
                        </span>
                      )}
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
