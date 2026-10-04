"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Grid, Users, Calendar, Folder, BookOpen, SearchIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { globalSearch } from "@/lib/actions/search";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ directory: any[], marketplace: any[] }>({ directory: [], marketplace: [] });
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

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ directory: [], marketplace: [] });
        return;
      }
      setIsSearching(true);
      try {
        const results = await globalSearch(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
                
                {isSearching ? (
                  <div className="flex-center py-24 text-secondary">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="ml-8">Searching...</span>
                  </div>
                ) : (
                  <>
                    {searchResults.directory.length > 0 && (
                      <div className={styles.resultCategory}>
                        <div className={styles.resultCategoryTitle}>Directory</div>
                        {searchResults.directory.map((item) => (
                          <Link key={item.id} href={`/directory/${item.id}`} className={styles.resultItem}>
                            <span className={styles.resultItemTitle}>{item.name}</span>
                            <ChevronRight className={styles.resultItemArrow} size={16} />
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchResults.marketplace.length > 0 && (
                      <div className={styles.resultCategory}>
                        <div className={styles.resultCategoryTitle}>Marketplace</div>
                        {searchResults.marketplace.map((item) => (
                          <Link key={item.id} href={`/marketplace/${item.transactionType.toLowerCase() === 'sell' ? 'member-marketplace' : 'community-properties'}/${item.id}`} className={styles.resultItem}>
                            <span className={styles.resultItemTitle}>{item.title}</span>
                            <ChevronRight className={styles.resultItemArrow} size={16} />
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchResults.directory.length === 0 && searchResults.marketplace.length === 0 && (
                      <div className="flex-center py-24 text-secondary">
                        <span className="text-sm">No results found for "{searchQuery}"</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <p className={styles.searchHelper}>Search services, events, people and resources</p>
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

            <Link href="/events" className={styles.qaCard}>
              <div className={styles.qaHeader}>
                <div className={`${styles.qaIconWrap} ${styles.qaIconYellow}`}><Calendar size={20} /></div>
              </div>
              <h3 className={styles.qaTitle}>Events</h3>
              <p className={styles.qaDesc}>See upcoming community events</p>
              <ChevronRight className={styles.qaArrow} size={20} />
            </Link>

            <Link href="/resources" className={styles.qaCard}>
              <div className={styles.qaHeader}>
                <div className={`${styles.qaIconWrap} ${styles.qaIconOrange}`}><Folder size={20} /></div>
              </div>
              <h3 className={styles.qaTitle}>Resources</h3>
              <p className={styles.qaDesc}>Access useful information and documents</p>
              <ChevronRight className={styles.qaArrow} size={20} />
            </Link>

          </div>
        </section>
      </div>

      {/* Main Layout Container (2-Column) */}
      <div className={styles.mainLayout}>
        
        {/* LEFT COLUMN: Main Content */}
        <div className={`${styles.mainColumn} animateFadeUp delay-200`}>
          
          {/* Community Updates */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  Community updates
                </h2>
                <p className={styles.sectionSubtitle}>Important information from across the community</p>
              </div>
            </div>

            <div className={styles.feed}>
              
              {/* Highlighted Announcement */}
              <div className={styles.announcementCard}>
                <div className={styles.announcementLabel}>IMPORTANT</div>
                <h3 className={styles.announcementTitle}>Register for the NASR Cup</h3>
                <p className={styles.announcementDesc}><strong>Sports and Logistics Department:</strong> Registration is now open for the upcoming NASR Football Cup. Form your teams and register before the deadline.</p>
                <Link href="/updates/nasr-cup" className={styles.announcementLink}>Read announcement <span className={styles.linkArrow}>&rarr;</span></Link>
              </div>

              {/* Update Rows (Editorial Style) */}
              <Link href="/updates/hackathon" className={styles.updateRow}>
                <div className={styles.updateSource}>
                  <div className={styles.updateAvatar}>T</div>
                  <div className={styles.updateMeta}>
                    <span className={styles.updateAuthor}>Tech and AI Committee</span>
                    <span className={styles.updateTime}>Technology &middot; Today</span>
                  </div>
                </div>
                <h3 className={styles.updateTitle}>KSIJ Hackathon - Build for the Community</h3>
                <p className={styles.updateSummary}>Join the complete KSIJ Hackathon today, Oct 4th! Featuring separate sections for girls and boys. Build innovative solutions that directly solve problems for our community and win exciting prizes.</p>
                <div className={styles.readMoreLink}>Read more <span className={styles.linkArrow}>&rarr;</span></div>
              </Link>

              <Link href="/updates/ai-bootcamp" className={styles.updateRow}>
                <div className={styles.updateSource}>
                  <div className={styles.updateAvatar} style={{backgroundColor: '#0284c7'}}>K</div>
                  <div className={styles.updateMeta}>
                    <span className={styles.updateAuthor}>KSIJ Mumbai &amp; Tech and AI Committee</span>
                    <span className={styles.updateTime}>Education &middot; 1 month ago</span>
                  </div>
                </div>
                <h3 className={styles.updateTitle}>2-Day AI Bootcamp by Ali Mehdi Hemani</h3>
                <p className={styles.updateSummary}>KSIJ Mumbai successfully conducted a 2-day AI bootcamp led by Ali Mehdi Hemani, founder of DIT (Digitalist Institute). Students mastered Generative AI on Day 1 and Agentic AI on Day 2.</p>
                <div className={styles.readMoreLink}>Read more <span className={styles.linkArrow}>&rarr;</span></div>
              </Link>

              <Link href="/updates" className={styles.viewAllBtn}>View all updates <span className={styles.linkArrow}>&rarr;</span></Link>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sidebar (Editorial Style) */}
        <aside className={`${styles.sidebar} animateFadeUp delay-300`}>
          
          <section className={styles.sidebarSection}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Upcoming events</h2>
              <Link href="/events" className={styles.sidebarLink}>See all <span className={styles.linkArrow}>&rarr;</span></Link>
            </div>
            
            <div className={styles.eventsList}>
              <Link href="/events/hackathon" className={styles.eventRow}>
                <div className={styles.eventDate}>
                  <span className={styles.dateMonth}>OCT</span>
                  <span className={styles.dateDay}>04</span>
                  <div style={{ width: '2px', height: '16px', backgroundColor: 'var(--color-accent-gold)', marginTop: '4px', borderRadius: '2px' }}></div>
                </div>
                <div className={styles.eventDetails}>
                  <h3 className={styles.eventTitle}>KSIJ Hackathon</h3>
                  <p className={styles.eventInfo}>Khoja Masjid Imambada Hall Dongri</p>
                  <div className={styles.eventLink}>View event <span className={styles.linkArrow}>&rarr;</span></div>
                </div>
              </Link>

              <Link href="/events/nasr-cup" className={styles.eventRow}>
                <div className={styles.eventDate}>
                  <span className={styles.dateMonth}>OCT</span>
                  <span className={styles.dateDay}>11</span>
                  <div style={{ width: '2px', height: '16px', backgroundColor: 'var(--color-accent-gold)', marginTop: '4px', borderRadius: '2px' }}></div>
                </div>
                <div className={styles.eventDetails}>
                  <h3 className={styles.eventTitle}>NASR Football Cup</h3>
                  <p className={styles.eventInfo}>Please register! Released on Oct 4th.</p>
                  <div className={styles.eventLink}>View event <span className={styles.linkArrow}>&rarr;</span></div>
                </div>
              </Link>
            </div>
          </section>
          
        </aside>

      </div>
    </div>
  );
}
