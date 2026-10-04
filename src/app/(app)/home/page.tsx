"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Grid, Users, Calendar, Folder, BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name ? session.user.name.split(' ')[0] : "";

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      
      {/* Search Backdrop */}
      <div className={`${styles.searchBackdrop} ${isSearchFocused ? styles.searchBackdropVisible : ''}`}></div>
      
      {/* Hero Section */}
      <section 
        className={`${styles.heroSection} ${!isSearchFocused ? 'animateFadeUp' : ''}`}
        style={{ position: 'relative' }}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.heroGreeting}>Salamun Alaykum{userName ? `, ${userName}` : ''}</h1>
          <div className={styles.goldHairline}></div>
          <p className={styles.heroSubtitle}>Everything your community has to offer, in one place.</p>
          
          <div 
            ref={searchRef}
            className={`${styles.searchWrapper} ${isSearchFocused ? styles.searchWrapperFocused : ''}`}
          >
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={24} />
              <input 
                type="text" 
                placeholder="What do you need?" 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>
            
            {/* Interactive Search Results Dropdown */}
            {isSearchFocused && searchQuery.length > 0 && (
              <div className={styles.searchResults}>
                
                <div className={styles.resultCategory}>
                  <div className={styles.resultCategoryTitle}>Services</div>
                  <Link href="/services" className={styles.resultItem}>
                    <span className={styles.resultItemTitle}>Scholarship Assistance</span>
                    <ChevronRight className={styles.resultItemArrow} size={16} />
                  </Link>
                  <Link href="/services" className={styles.resultItem}>
                    <span className={styles.resultItemTitle}>Medical Consultations</span>
                    <ChevronRight className={styles.resultItemArrow} size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
          <p className={styles.searchHelper}>Search services, people and resources</p>
        </div>
      </section>

      {/* Quick Access (Full Width) */}
      <div className={`${styles.quickAccessWrapper} animateFadeUp delay-100`}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick access</h2>
          <div className={styles.quickAccessGrid}>
            
            <Link href="/services" className={styles.qaCard}>
              <div className={styles.qaHeader}>
                <div className={`${styles.qaIconWrap} ${styles.qaIconGreen}`}><Grid size={20} /></div>
              </div>
              <h3 className={styles.qaTitle}>Community Services</h3>
              <p className={styles.qaDesc}>Find assistance, programs and support</p>
              <ChevronRight className={styles.qaArrow} size={20} />
            </Link>
            
            <Link href="/directory" className={styles.qaCard}>
              <div className={styles.qaHeader}>
                <div className={`${styles.qaIconWrap} ${styles.qaIconBlue}`}><Users size={20} /></div>
              </div>
              <h3 className={styles.qaTitle}>Directory</h3>
              <p className={styles.qaDesc}>Find community members and businesses</p>
              <ChevronRight className={styles.qaArrow} size={20} />
            </Link>

          </div>
        </section>
      </div>


    </div>
  );
}
