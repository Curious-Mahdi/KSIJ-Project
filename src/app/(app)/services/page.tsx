"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import { services } from "@/lib/data/services";

export default function ServicesLandingPage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <span className={styles.eyebrow}>COMMUNITY SERVICES</span>
        <h1 className={styles.mainHeading}>Support when you need it.</h1>
        <div className={styles.goldLine}></div>
        <p className={styles.subheading}>
          Explore the community assistance services KSIJ One could bring together in one simple place — from education and medical support to welfare assistance and interest-free financial support.
        </p>
        <p className={styles.disclaimer}>
          Illustrative service concepts — eligibility, documentation and support may vary by programme.
        </p>
        <Link href="/services/applications" className={styles.myApplicationsBtn}>
          My Applications →
        </Link>
      </section>

      {/* Quick Information Strip (Process Flow) */}
      <div className={styles.infoStrip}>
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
      </div>

      {/* Service Grid Section */}
      <section className={styles.serviceGridSection}>
        <h2 className={styles.sectionHeading}>Services we could bring together</h2>
        <p className={styles.sectionSupportingText}>
          A simple starting point for accessing community assistance through one platform.
        </p>

        <div className={styles.grid}>
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`} className={styles.card}>
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
          ))}
        </div>
      </section>
    </div>
  );
}
