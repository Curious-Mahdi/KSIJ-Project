import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function MyOpportunitiesPage({ searchParams }: { searchParams: Promise<{ tab?: string, success?: string }> }) {
  const resolvedParams = await searchParams;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/opportunities/my");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) redirect("/login");

  const tab = resolvedParams.tab || 'applied';

  let content = null;

  if (tab === 'applied') {
    const applications = await prisma.opportunityApplication.findMany({
      where: { userId: user.id },
      include: { opportunity: true },
      orderBy: { createdAt: 'desc' }
    });

    content = applications.length === 0 ? (
      <div className={styles.emptyState}>
        <h3 className={styles.emptyTitle}>No applications yet</h3>
        <p className={styles.emptyDesc}>When you apply for opportunities, they will appear here.</p>
      </div>
    ) : (
      <div className={styles.cardsList}>
        {applications.map(app => (
          <Link href={`/opportunities/${app.opportunityId}`} key={app.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#68756F' }}>
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0B5D3B' }}>
                Status: {app.status}
              </span>
            </div>
            <h3 className={styles.cardTitle}>{app.opportunity.title}</h3>
            <div style={{ color: '#68756F', fontSize: '0.95rem' }}>{app.opportunity.organisationName}</div>
          </Link>
        ))}
      </div>
    );
  } else if (tab === 'saved') {
    content = (
      <div className={styles.emptyState}>
        <h3 className={styles.emptyTitle}>No saved opportunities</h3>
        <p className={styles.emptyDesc}>Saved opportunities will appear here in the future.</p>
      </div>
    );
  } else if (tab === 'posted') {
    const posted = await prisma.opportunity.findMany({
      where: { postedByUserId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    content = posted.length === 0 ? (
      <div className={styles.emptyState}>
        <h3 className={styles.emptyTitle}>You haven't posted anything yet</h3>
        <p className={styles.emptyDesc}>Share opportunities with the community.</p>
        <Link href="/opportunities/post" className={styles.postBtn} style={{ display: 'inline-block', marginTop: '16px' }}>
          Post an Opportunity
        </Link>
      </div>
    ) : (
      <div className={styles.cardsList}>
        {posted.map(opp => (
          <Link href={`/opportunities/${opp.id}`} key={opp.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#68756F', textTransform: 'uppercase' }}>
                {opp.type}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: opp.status === 'PUBLISHED' ? '#0B5D3B' : '#68756F' }}>
                {opp.status}
              </span>
            </div>
            <h3 className={styles.cardTitle}>{opp.title}</h3>
            <div style={{ color: '#68756F', fontSize: '0.95rem' }}>
              Posted on {new Date(opp.createdAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Link href="/opportunities" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to opportunities
        </Link>

        {resolvedParams.success && (
          <div className={styles.successMessage}>
            <CheckCircle2 size={20} />
            Opportunity successfully published!
          </div>
        )}

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Opportunities</h1>
          </div>
          <Link href="/opportunities/post" className={styles.postBtn}>
            Post Opportunity
          </Link>
        </div>

        <div className={styles.tabs}>
          <Link href="/opportunities/my?tab=applied" className={`${styles.tab} ${tab === 'applied' ? styles.tabActive : ''}`}>
            Applied
          </Link>
          <Link href="/opportunities/my?tab=saved" className={`${styles.tab} ${tab === 'saved' ? styles.tabActive : ''}`}>
            Saved
          </Link>
          <Link href="/opportunities/my?tab=posted" className={`${styles.tab} ${tab === 'posted' ? styles.tabActive : ''}`}>
            Posted
          </Link>
        </div>

        {content}
      </div>
    </div>
  );
}
