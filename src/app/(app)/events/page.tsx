import styles from "./page.module.css";
import * as motion from "framer-motion/client";
import { MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  return (
    <div className="w-full">
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className={styles.heroEyebrow}>EVENTS</span>
            <h1 className="h1 mb-16" style={{ color: 'var(--color-primary-dark)' }}>Community Events</h1>
            <p className={styles.pageSubtitle}>Stay updated with what&apos;s happening around Jamaat</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="h2 mb-32">Upcoming Events</h2>
        
        <div className={styles.eventsList}>
          <Link href="/events/hackathon" className={styles.eventCard}>
            <div className={styles.eventDateBox}>
              <span className={styles.dateMonth}>Oct</span>
              <span className={styles.dateDay}>04</span>
              <span className={styles.dateYear}>2026</span>
            </div>
            <div className={styles.eventContent}>
              <h3 className={styles.eventTitle}>KSIJ Hackathon - Build for the Community</h3>
              <div className={styles.eventDetails}>
                <div className={styles.eventDetailItem}>
                  <MapPin size={16} />
                  <span>Khoja Masjid Imambada Hall Dongri</span>
                </div>
                <div className={styles.eventDetailItem}>
                  <Clock size={16} />
                  <span>9:00 AM - 6:00 PM</span>
                </div>
              </div>
              <p className={styles.eventDescription}>
                Join the complete KSIJ Hackathon today! Featuring separate sections for girls and boys. Build innovative solutions that directly solve problems for our community and win exciting prizes. Powered by Tech and AI Committee.
              </p>
            </div>
          </Link>

          <Link href="/events/nasr-cup" className={styles.eventCard}>
            <div className={styles.eventDateBox}>
              <span className={styles.dateMonth}>Oct</span>
              <span className={styles.dateDay}>11</span>
              <span className={styles.dateYear}>2026</span>
            </div>
            <div className={styles.eventContent}>
              <h3 className={styles.eventTitle}>NASR Football Cup</h3>
              <div className={styles.eventDetails}>
                <div className={styles.eventDetailItem}>
                  <MapPin size={16} />
                  <span>Kapaswadi Sports Complex</span>
                </div>
                <div className={styles.eventDetailItem}>
                  <Clock size={16} />
                  <span>8:00 AM Onwards</span>
                </div>
              </div>
              <p className={styles.eventDescription}>
                The Sports and Logistics Department brings you the much-awaited NASR Football Cup. Form your teams and participate in the biggest football tournament of the year. Registrations released on Oct 4th!
              </p>
            </div>
          </Link>
        </div>
        </motion.div>
        </div>
      </section>

      <section className="section-padding bg-light-green">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="h2 mb-32">Past Events</h2>
        
        <div className={styles.eventsList}>
          <Link href="/events/ai-bootcamp" className={`${styles.eventCard} ${styles.pastEventCard}`}>
            <div className={styles.eventDateBox}>
              <span className={styles.dateMonth}>Sep</span>
              <span className={styles.dateDay}>15</span>
              <span className={styles.dateYear}>2026</span>
            </div>
            <div className={styles.eventContent}>
              <h3 className={styles.eventTitle}>2-Day AI Bootcamp</h3>
              <div className={styles.eventDetails}>
                <div className={styles.eventDetailItem}>
                  <MapPin size={16} />
                  <span>KSIJ Mumbai</span>
                </div>
              </div>
              <p className={styles.eventDescription}>
                KSIJ Mumbai successfully conducted a 2-day AI bootcamp led by Ali Mehdi Hemani, founder of DIT (Digitalist Institute). Students mastered Generative AI on Day 1 and Agentic AI on Day 2.
              </p>
            </div>
          </Link>

          <Link href="/events/medical-camp" className={`${styles.eventCard} ${styles.pastEventCard}`}>
            <div className={styles.eventDateBox}>
              <span className={styles.dateMonth}>Aug</span>
              <span className={styles.dateDay}>22</span>
              <span className={styles.dateYear}>2026</span>
            </div>
            <div className={styles.eventContent}>
              <h3 className={styles.eventTitle}>Annual Free Medical Camp</h3>
              <div className={styles.eventDetails}>
                <div className={styles.eventDetailItem}>
                  <MapPin size={16} />
                  <span>Dongri Medical Center</span>
                </div>
              </div>
              <p className={styles.eventDescription}>
                A massive community-wide medical checkup drive helping over 500 members with free consultations, eye checkups, and basic health screenings.
              </p>
            </div>
          </Link>
        </div>
        </motion.div>
        </div>
      </section>
    </div>
  );
}
