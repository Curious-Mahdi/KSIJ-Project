import styles from "./page.module.css";
import { MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Community Events</h1>
        <p className={styles.pageSubtitle}>Stay updated with what's happening around Jamaat</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming Events</h2>

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
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Past Events</h2>

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
      </section>
    </div>
  );
}