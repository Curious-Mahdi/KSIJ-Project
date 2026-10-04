import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, Users, Calendar, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!opportunity) {
    notFound();
  }

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'JOB': return styles.badgeJob;
      case 'INTERNSHIP': return styles.badgeInternship;
      case 'MENTORSHIP': return styles.badgeMentorship;
      case 'PROJECT': return styles.badgeProject;
      case 'VOLUNTEERING': return styles.badgeVolunteering;
      default: return styles.badgeJob;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Link href="/opportunities" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to opportunities
        </Link>

        <header className={styles.header}>
          <div className={`${styles.badge} ${getBadgeStyle(opportunity.type)}`}>
            {opportunity.type}
          </div>
          
          <h1 className={styles.title}>{opportunity.title}</h1>
          
          <div className={styles.org}>
            {opportunity.organisationName}
            {opportunity.verificationStatus === 'VERIFIED' && (
              <CheckCircle2 size={18} className={styles.verifiedIcon} title="Verified Organisation" />
            )}
          </div>

          <div className={styles.metaGrid}>
            {opportunity.location && (
              <div className={styles.metaItem}>
                <MapPin size={18} /> {opportunity.location} {opportunity.workMode && `· ${opportunity.workMode}`}
              </div>
            )}
            {(opportunity.compensationMin || opportunity.compensationMax) && (
              <div className={styles.metaItem}>
                <Briefcase size={18} /> 
                {opportunity.currency} {opportunity.compensationMin} 
                {opportunity.compensationMax ? ` – ${opportunity.compensationMax}` : ''}
                {opportunity.compensationPeriod ? ` / ${opportunity.compensationPeriod}` : ''}
              </div>
            )}
            {opportunity.applicationDeadline && (
              <div className={styles.metaItem}>
                <Calendar size={18} /> Apply by {new Date(opportunity.applicationDeadline).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {opportunity.applicationMethod === 'EXTERNAL' && opportunity.externalApplicationUrl ? (
              <a href={opportunity.externalApplicationUrl} target="_blank" rel="noopener noreferrer" className={styles.applyBtn}>
                Apply Externally
              </a>
            ) : (
              <Link href={`/opportunities/${opportunity.id}/apply`} className={styles.applyBtn}>
                {opportunity.type === 'MENTORSHIP' ? 'Request Mentorship' : opportunity.type === 'VOLUNTEERING' ? 'Join as Volunteer' : 'Apply now'}
              </Link>
            )}
            <button className={styles.saveBtn}>Save</button>
          </div>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About the opportunity</h2>
          <div className={styles.sectionContent}>
            {opportunity.description.split('\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '16px' }}>{para}</p>
            ))}
          </div>
        </section>

        {opportunity.skills && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills & Requirements</h2>
            <div className={styles.skillsGrid}>
              {opportunity.skills.split(',').map((skill, idx) => (
                <span key={idx} className={styles.skillBadge}>{skill.trim()}</span>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Opportunity Details</h2>
          <div className={styles.detailsGrid}>
            <div>
              <div className={styles.detailLabel}>Type</div>
              <div className={styles.detailValue}>{opportunity.type}</div>
            </div>
            {opportunity.experienceLevel && (
              <div>
                <div className={styles.detailLabel}>Experience</div>
                <div className={styles.detailValue}>{opportunity.experienceLevel}</div>
              </div>
            )}
            {opportunity.employmentType && (
              <div>
                <div className={styles.detailLabel}>Employment Type</div>
                <div className={styles.detailValue}>{opportunity.employmentType}</div>
              </div>
            )}
            {opportunity.duration && (
              <div>
                <div className={styles.detailLabel}>Duration</div>
                <div className={styles.detailValue}>{opportunity.duration}</div>
              </div>
            )}
            {opportunity.startDate && (
              <div>
                <div className={styles.detailLabel}>Start Date</div>
                <div className={styles.detailValue}>{new Date(opportunity.startDate).toLocaleDateString()}</div>
              </div>
            )}
            {opportunity.timeCommitment && (
              <div>
                <div className={styles.detailLabel}>Time Commitment</div>
                <div className={styles.detailValue}>{opportunity.timeCommitment}</div>
              </div>
            )}
            {opportunity.mentorCapacity && (
              <div>
                <div className={styles.detailLabel}>Mentee Capacity</div>
                <div className={styles.detailValue}>{opportunity.mentorCapacity} people</div>
              </div>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How to apply</h2>
          <div className={styles.sectionContent}>
            {opportunity.applicationMethod === 'EXTERNAL' ? (
              <p>This opportunity uses an external application system. You will be redirected to the organisation's website to complete your application.</p>
            ) : (
              <p>You can apply directly through KSIJ One. Your profile details will be shared with the poster.</p>
            )}
          </div>
        </section>

        <div className={styles.safetyBox}>
          <div className={styles.safetyIcon}>
            <ShieldAlert size={24} />
          </div>
          <div className={styles.safetyText}>
            <strong>Safety & Trust</strong>
            <p style={{ marginTop: '8px' }}>
              KSIJ One will never ask applicants to pay a fee to apply for an opportunity. 
              {opportunity.verificationStatus !== 'VERIFIED' && ' This opportunity has not been manually verified. Please verify details before sharing sensitive information.'}
            </p>
          </div>
        </div>

        <button className={styles.reportBtn}>
          Report this opportunity
        </button>
      </div>
    </div>
  );
}
