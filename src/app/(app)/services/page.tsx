import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as motion from "framer-motion/client";
import styles from "./page.module.css";
import { services } from "@/lib/data/services";

export const metadata = {
  title: "Community Services & Support | KSIJ Reload",
  description: "Explore the community assistance services KSIJ Reload brings together in one place.",
};

export default function ServicesLandingPage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroContent}
          >
            <span className={styles.eyebrow}>COMMUNITY SERVICES</span>
            <h1 className="h1 mb-24" style={{ color: 'var(--color-primary-dark)' }}>Support when you need it.</h1>
            <p className={styles.subheading}>
              Explore the community assistance services KSIJ One brings together in one simple place — from education and medical support to welfare assistance.
            </p>
            <Link href="/services/applications" className="btn btn-primary" style={{marginTop: '24px'}}>
              My Applications <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Information Strip (Process Flow) */}
      <section className="bg-light-green section-padding">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.infoStrip}
          >
            <div className={styles.infoBlock}>
              <div className={styles.infoIcon}>📝</div>
              <div className={styles.infoTitle}>1. Apply</div>
              <div className={styles.infoText}>Submit your request through one simple guided process.</div>
              <div className={styles.processArrow}></div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoIcon}>📎</div>
              <div className={styles.infoTitle}>2. Upload</div>
              <div className={styles.infoText}>Securely attach required documents to your application.</div>
              <div className={styles.processArrow}></div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoIcon}>⏱️</div>
              <div className={styles.infoTitle}>3. Track</div>
              <div className={styles.infoText}>Follow the progress of your request until a decision is made.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Grid Section */}
      <section className="section-padding">
        <div className="container">
          <div style={{textAlign: 'center', marginBottom: '64px'}}>
            <h2 className="h2 mb-16">Services we could bring together</h2>
            <p className={styles.sectionSupportingText}>
              A simple starting point for accessing community assistance through one platform.
            </p>
          </div>

        <div className={styles.grid}>
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/services/${service.id}`} className="card" style={{display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none'}}>
                <div className={styles.iconContainer}>{service.icon}</div>
                <span className={styles.cardCategory}>{service.category}</span>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
                <span className={styles.cardSmallText}>{service.smallText}</span>
                
                <div className={styles.cardFooter}>
                  <span>View service</span>
                  <ArrowRight size={16} className={styles.arrowIcon} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}
