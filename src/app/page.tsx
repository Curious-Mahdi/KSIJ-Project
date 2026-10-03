"use client";

import Link from "next/link";
import { Users, BookOpen, Compass, Calendar, Menu, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <main>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>KSIJ Reload</div>
        
        <div className={styles.navLinks}>
          <Link href="#" className={styles.navLink}>Home</Link>
          <Link href="#" className={styles.navLink}>About</Link>
          <Link href="#" className={styles.navLink}>Services</Link>
          <Link href="#" className={styles.navLink}>Directory</Link>
          <Link href="#" className={styles.navLink}>Events</Link>
        </div>
        
        <div className="flex-center gap-16">
          <Link href="/login" className="btn btn-primary">Login</Link>
          <button className="flex-center" style={{ display: "md:none", padding: "8px" }} aria-label="Menu">
            <Menu className="text-primary" />
          </button>
        </div>
      </nav>

      <div className="container">
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={`display-text ${styles.heroTitle}`}>
              Everything you need from your community, in one place.
            </h1>
            <p className={styles.heroSubtitle}>
              Discover community services, stay informed, find people and organizations, and access important community information through KSIJ Reload.
            </p>
            <div className={styles.heroActions}>
              <Link href="/home" className="btn btn-primary">
                Explore KSIJ
              </Link>
              <Link href="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* About KSIJ */}
        <section className="section text-center">
          <h2 className="h2 mb-16">Built for the community.</h2>
          <p className="body-text text-secondary" style={{ maxWidth: "600px", margin: "0 auto" }}>
            KSIJ Reload is intended to bring important community information and services together in one accessible digital platform. No more searching through scattered PDFs or endless WhatsApp groups.
          </p>
        </section>

        {/* Core Areas Preview */}
        <section className="section">
          <div className={styles.featuresGrid}>
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.iconWrapper}><Users /></div>
              <h3 className="h3">Community</h3>
              <p className="small-text text-secondary">
                Stay updated with the latest announcements, notices, and important news.
              </p>
            </div>
            
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.iconWrapper}><BookOpen /></div>
              <h3 className="h3">Services</h3>
              <p className="small-text text-secondary">
                Access scholarships, financial assistance, and other community welfare programs.
              </p>
            </div>

            <div className={`card ${styles.featureCard}`}>
              <div className={styles.iconWrapper}><Compass /></div>
              <h3 className="h3">Directory</h3>
              <p className="small-text text-secondary">
                Find professionals, businesses, and essential contacts within our network.
              </p>
            </div>

            <div className={`card ${styles.featureCard}`}>
              <div className={styles.iconWrapper}><Calendar /></div>
              <h3 className="h3">Events</h3>
              <p className="small-text text-secondary">
                Discover upcoming programs, seminars, and community gatherings.
              </p>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className={styles.servicesPreview}>
          <div className="flex-between mb-32">
            <h2 className="h2">Community Services</h2>
            <Link href="#" className="flex-center gap-8 text-primary" style={{ fontWeight: 500 }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.featuresGrid} style={{ marginTop: 0 }}>
            <div className="card">
              <h3 className="h3 mb-8">Scholarships</h3>
              <p className="small-text">Educational support for higher studies.</p>
            </div>
            <div className="card">
              <h3 className="h3 mb-8">Financial Assistance</h3>
              <p className="small-text">Confidential support for community members.</p>
            </div>
            <div className="card">
              <h3 className="h3 mb-8">Medical Assistance</h3>
              <p className="small-text">Health programs and emergency support.</p>
            </div>
            <div className="card">
              <h3 className="h3 mb-8">Education</h3>
              <p className="small-text">Mentorship and career guidance programs.</p>
            </div>
          </div>
        </section>

        {/* Events Preview */}
        <section className="section mt-32">
          <div className="flex-between mb-32">
            <h2 className="h2">Upcoming Events</h2>
          </div>
          <div className="grid-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <div className="card">
              <div className="badge mb-16">Oct 15, 2024</div>
              <h3 className="h3 mb-8">Community Townhall</h3>
              <p className="small-text mb-16">Join us for the quarterly community update and Q&A session.</p>
              <div className="flex-between small-text">
                <span>8:00 PM</span>
                <span>Main Centre</span>
              </div>
            </div>
            <div className="card">
              <div className="badge mb-16">Oct 22, 2024</div>
              <h3 className="h3 mb-8">Youth Career Seminar</h3>
              <p className="small-text mb-16">Guidance and networking for students and recent graduates.</p>
              <div className="flex-between small-text">
                <span>10:00 AM</span>
                <span>Community Hall</span>
              </div>
            </div>
            <div className="card">
              <div className="badge mb-16">Nov 05, 2024</div>
              <h3 className="h3 mb-8">Annual Health Camp</h3>
              <p className="small-text mb-16">Free medical checkups for all community members.</p>
              <div className="flex-between small-text">
                <span>9:00 AM</span>
                <span>Medical Wing</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div>
            <div className={styles.logo} style={{ fontSize: "1rem", marginBottom: "8px" }}>KSIJ Reload</div>
            <p className="small-text">One trusted digital home for the KSIJ community.</p>
          </div>
          <div className={styles.footerLinks}>
            <Link href="#" className="small-text">About</Link>
            <Link href="#" className="small-text">Contact</Link>
            <Link href="#" className="small-text">Privacy</Link>
            <Link href="#" className="small-text">Terms</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
