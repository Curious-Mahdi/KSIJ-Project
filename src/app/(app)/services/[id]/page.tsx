import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, FileText } from "lucide-react";
import styles from "./page.module.css";
import { services } from "@/lib/data/services";

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = services.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <header className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.breadcrumb}>
            <Link href="/services">Community Services</Link> / {service.title}
          </div>
          <div className={styles.iconWrapper}>{service.icon}</div>
          <h1 className={styles.serviceTitle}>{service.title}</h1>
          <p className={styles.serviceSubtitle}>{service.subtitle}</p>
          <div className={styles.goldLine}></div>
          <div className={styles.proposedBadge}>PROPOSED SERVICE</div>
          <p className={styles.headerDisclaimer}>
            This page demonstrates a possible KSIJ One service workflow. Final eligibility, documents, approval criteria and programme terms would be determined by the respective Jamaat/committee.
          </p>
        </div>
      </header>

      {/* Main Layout */}
      <div className={styles.mainLayout}>
        {/* Left Content */}
        <div className={styles.mainContent}>
          
          <section>
            <h2 className={styles.sectionHeading}>What the service could provide</h2>
            <div className={styles.providesGrid}>
              {service.provides.map((item, idx) => (
                <div key={idx} className={styles.providesItem}>
                  <Check size={20} className={styles.checkIcon} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className={styles.sectionHeading}>Who may be eligible?</h2>
            <p className={styles.sectionSubheading}>Eligibility may depend on the applicant's circumstances, programme guidelines and available community funds.</p>
            <div className={styles.eligibilityGrid}>
              <div className={styles.eligibilityCard}>
                <div className={styles.eligibilityTitle}>Community Membership</div>
                <div className={styles.eligibilityText}>Applicant may need to meet applicable community/Jamaat requirements.</div>
              </div>
              <div className={styles.eligibilityCard}>
                <div className={styles.eligibilityTitle}>Financial Need</div>
                <div className={styles.eligibilityText}>Some programmes may consider household financial circumstances.</div>
              </div>
              <div className={styles.eligibilityCard}>
                <div className={styles.eligibilityTitle}>Programme Criteria</div>
                <div className={styles.eligibilityText}>Additional conditions may apply depending on the service.</div>
              </div>
              <div className={styles.eligibilityCard}>
                <div className={styles.eligibilityTitle}>Supporting Evidence</div>
                <div className={styles.eligibilityText}>Applicants may be asked to provide documents supporting their request.</div>
              </div>
            </div>
            <p className={styles.eligibilityNote}>Final eligibility criteria will be defined by the responsible committee.</p>
          </section>

          <section>
            <h2 className={styles.sectionHeading}>Documents you may need</h2>
            <p className={styles.sectionSubheading}>The exact documents depend on your application. The following are illustrative examples.</p>
            <div className={styles.documentsList}>
              {service.documents.map((doc, idx) => (
                <div key={idx} className={styles.documentItem}>
                  <FileText size={20} className={styles.docIcon} />
                  <div className={styles.docInfo}>
                    <div className={styles.docName}>{doc.name}</div>
                    <div className={styles.docReason}>{doc.reason}</div>
                  </div>
                  <div className={`${styles.docBadge} ${doc.required ? styles.docRequired : styles.docOptional}`}>
                    {doc.required ? "Required" : "May be required"}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className={styles.sectionHeading}>What happens next?</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineStep}>
                <div className={styles.stepNumber}>01</div>
                <div className={styles.stepTitle}>Submit your application</div>
                <div className={styles.stepText}>Complete the required information and upload supporting documents.</div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.stepNumber}>02</div>
                <div className={styles.stepTitle}>Document review</div>
                <div className={styles.stepText}>The responsible team reviews your submission and documents.</div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.stepNumber}>03</div>
                <div className={styles.stepTitle}>Additional information</div>
                <div className={styles.stepText}>If something is missing, you will be asked to provide it.</div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.stepNumber}>04</div>
                <div className={styles.stepTitle}>Committee review</div>
                <div className={styles.stepText}>Your application is assessed according to the applicable programme criteria.</div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.stepNumber}>05</div>
                <div className={styles.stepTitle}>Decision & support</div>
                <div className={styles.stepText}>You receive an update through KSIJ One.</div>
              </div>
            </div>
          </section>

          <div className={styles.footerDisclaimer}>
            <strong>Important:</strong> The information shown on this page is an illustrative KSIJ One concept. Actual eligibility criteria, required documents, assistance amounts, approval procedures and programme terms will be determined by the responsible Jamaat, trust or committee before launch.
          </div>
        </div>

        {/* Right Panel (Sticky) */}
        <div>
          <div className={styles.stickyPanel}>
            <h3 className={styles.panelTitle}>Apply for {service.title}</h3>
            <p className={styles.panelText}>
              Start a new application for this service. You will be able to save your progress and upload documents in the next step.
            </p>
            <Link href={`/services/applications/new?service=${service.id}`} className={styles.startButton}>
              Start Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
