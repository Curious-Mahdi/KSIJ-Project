"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Grid, Users, Calendar, Store, ArrowRight, Loader2, Mic, FileText, ClipboardList, Monitor, Activity, BookOpen, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { globalSearch } from "@/lib/actions/search";
import styles from "./page.module.css";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ directory: any[], marketplace: any[] }>({ directory: [], marketplace: [] });
  const [showIntro, setShowIntro] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Subtle logo parallax for desktop
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const userName = session?.user?.name ? session.user.name.split(' ')[0] : "";
  const isAuthenticated = !!session?.user;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only apply very small movement (max 8px)
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * 16;
    setMousePos({ x, y });
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
    const hasSeenIntro = sessionStorage.getItem("ksijOneIntroSeen");
    if (hasSeenIntro) {
      setShowIntro(false);
    } else {
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("ksijOneIntroSeen", "true");
      }, 2500);
      return () => clearTimeout(timer);
    }
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
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className={styles.pageWrapper}>
      
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="introOverlay"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className={styles.introOverlay}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={styles.introBrand}
            >
              KSIJ ONE
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Backdrop */}
      <div className={`${styles.searchBackdrop} ${isSearchFocused ? styles.searchBackdropVisible : ''}`}></div>
      
      {/* HEADER / HERO SECTION */}
      <section className={styles.heroSection} onMouseMove={handleMouseMove}>
        <motion.div style={{ y: yHero, opacity: opacityHero }} className={styles.heroContainer}>
          
          {/* LEFT: Text & Search */}
          <div className={styles.heroContent}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}>
              <div className={styles.heroEyebrow}>KSIJ ONE</div>
              <h1 className={styles.heroGreeting}>Salamun Alaykum{userName ? `, ${userName}` : ''}</h1>
              <p className={styles.heroSubtitle}>One community.<br/>Everything you need.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              className={styles.searchBlock}
            >
              <div className={styles.searchLabel}>WHAT DO YOU NEED?</div>
              <div 
                ref={searchRef}
                className={`${styles.searchWrapper} ${isSearchFocused ? styles.searchWrapperFocused : ''}`}
              >
                <div className={styles.searchContainer}>
                  <Search className={styles.searchIcon} size={24} color="#075C3A" />
                  <input 
                    type="text" 
                    placeholder="Find a doctor near me..." 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    onFocus={() => setIsSearchFocused(true)}
                  />
                  <Mic className={styles.micIcon} size={24} color="#9CA3AF" />
                  <button className={styles.searchSubmitBtn}>
                    <ArrowRight size={20} />
                  </button>
                </div>
                
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
                            <span className="text-sm">No results found for &quot;{searchQuery}&quot;</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: REAL KSIJ LOGO */}
          <div className={styles.heroVisual}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: mousePos.x,
                y: mousePos.y
              }}
              transition={{ 
                opacity: { duration: 1.2, delay: 0.2 },
                scale: { duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
                x: { type: "spring", stiffness: 50, damping: 20 },
                y: { type: "spring", stiffness: 50, damping: 20 }
              }}
              className={styles.logoWrapper}
            >
              <img src="/ksij-logo.jpg" alt="KSIJ Logo" className={styles.heroLogo} onError={(e) => {
                // If logo is missing, fallback to a clean typographic placeholder to avoid broken image
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add(styles.logoPlaceholderActive);
              }} />
              <div className={styles.logoPlaceholder}>KSIJ</div>
            </motion.div>
          </div>
          
        </motion.div>
      </section>

      {/* QUICK ACCESS - BENTO COMPOSITION */}
      <section className={styles.bentoSection}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={styles.bentoGrid}
          >
            <Link href="/services" className={styles.bentoCardLarge}>
              <div className={styles.bentoCardContent}>
                <Grid size={32} color="#075C3A" />
                <h2>Community Services</h2>
                <p>Support, welfare, medical, education, and housing.</p>
                <div className={styles.bentoArrow}><ArrowRight size={24} /></div>
              </div>
              <div className={styles.bentoCardPattern}></div>
            </Link>

            <Link href="/directory" className={styles.bentoCardMedium}>
              <div className={styles.bentoCardContent}>
                <Users size={28} color="#C8A64B" />
                <h3>Directory</h3>
                <p>Find community professionals</p>
                <div className={styles.bentoArrow}><ArrowRight size={20} /></div>
              </div>
            </Link>

            <Link href="/events" className={styles.bentoCardMediumWhite}>
              <div className={styles.bentoCardContent}>
                <Calendar size={28} color="#075C3A" />
                <h3>Events</h3>
                <p>Join community gatherings</p>
                <div className={styles.bentoArrow}><ArrowRight size={20} /></div>
              </div>
            </Link>

            <Link href="/marketplace" className={styles.bentoCardSmallDark}>
              <div className={styles.bentoCardContent}>
                <Store size={24} color="#FFFFFF" />
                <h3>Marketplace</h3>
                <div className={styles.bentoArrow}><ArrowRight size={20} /></div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* YOUR KSIJ ONE (PERSONALIZED) */}
      <section className={styles.personalizedSection}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="h3 mb-24" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>YOUR KSIJ ONE</h2>
            
            {isAuthenticated ? (
              <div className={styles.personalizedGrid}>
                <Link href="/profile" className={styles.personalCard}>
                  <div className={styles.personalIcon}><FileText size={20} /></div>
                  <div className={styles.personalContent}>
                    <h4>My Applications</h4>
                    <p>Track your community assistance requests</p>
                  </div>
                  <ChevronRight size={16} className={styles.personalArrow} />
                </Link>
                <Link href="/profile" className={styles.personalCard}>
                  <div className={styles.personalIcon}><Users size={20} /></div>
                  <div className={styles.personalContent}>
                    <h4>My Directory</h4>
                    <p>Manage your community listing</p>
                  </div>
                  <ChevronRight size={16} className={styles.personalArrow} />
                </Link>
                <Link href="/profile" className={styles.personalCard}>
                  <div className={styles.personalIcon}><Calendar size={20} /></div>
                  <div className={styles.personalContent}>
                    <h4>Upcoming</h4>
                    <p>See events relevant to you</p>
                  </div>
                  <ChevronRight size={16} className={styles.personalArrow} />
                </Link>
              </div>
            ) : (
              <div className={styles.personalEmptyState}>
                <div className={styles.personalEmptyIcon}><ClipboardList size={32} /></div>
                <p>Your activity will appear here as you use the platform.</p>
                <Link href="/login" className="btn btn-secondary mt-16">Sign In</Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* EXPLORE YOUR COMMUNITY (MAP PREVIEW) */}
      <section className={styles.explorerSection}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={styles.explorerContainer}
          >
            <div className={styles.explorerContent}>
              <h2 className={styles.explorerTitle}>EXPLORE YOUR COMMUNITY</h2>
              <p className={styles.explorerSubtitle}>Discover community places, services, businesses, professionals and events in one place.</p>
              <Link href="/directory" className={styles.explorerBtn}>
                Explore community <ArrowRight size={16} />
              </Link>
            </div>
            
            {/* Map-ready visual container (deep green / graphite) */}
            <div className={styles.explorerMapVisual}>
              {/* Optional: we can add small grid lines or just keep it deep and clean as requested */}
              <div className={styles.mapGridPattern}></div>
              
              {/* Real data markers could go here later. For now, subtle nodes */}
              <div className={styles.mapNode} style={{top: '35%', left: '30%'}}></div>
              <div className={styles.mapNode} style={{top: '55%', left: '60%'}}></div>
              <div className={styles.mapNodeActive} style={{top: '45%', left: '45%'}}>
                <div className={styles.pulseRing}></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S HAPPENING (NEW ACTIVITY STRIP) */}
      <section className="section-padding bg-background">
        <div className="container">
          <h2 className="h2 mb-24" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)', fontSize: '1.25rem', letterSpacing: '0.05em', fontWeight: 700, textTransform: 'uppercase' }}>WHAT'S HAPPENING</h2>
          <div className={styles.activityStrip}>
            <Link href="/events/hackathon" className={styles.activityCard}>
              <div className={styles.activityIcon}><Monitor size={20} /></div>
              <div className={styles.activityContent}>
                <h4>KSIJ Hackathon</h4>
                <p>Technology &middot; Oct 04</p>
              </div>
            </Link>
            <Link href="/events/nasr-cup" className={styles.activityCard}>
              <div className={styles.activityIcon}><Activity size={20} /></div>
              <div className={styles.activityContent}>
                <h4>NASR Football Cup</h4>
                <p>Sports &middot; Oct 11</p>
              </div>
            </Link>
            <Link href="/updates/ai-bootcamp" className={styles.activityCard}>
              <div className={styles.activityIcon}><BookOpen size={20} /></div>
              <div className={styles.activityContent}>
                <h4>2-Day AI Bootcamp</h4>
                <p>Education &middot; Yesterday</p>
              </div>
            </Link>
            <Link href="/updates/medical-camp" className={styles.activityCard}>
              <div className={styles.activityIcon}><Heart size={20} /></div>
              <div className={styles.activityContent}>
                <h4>Medical Camp</h4>
                <p>Health &middot; Oct 1</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL UPDATES AND EVENTS */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className={styles.editorialSplit}>
            
            <div className={styles.editorialLeft}>
              <h2 className="h2 mb-32" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>COMMUNITY UPDATES</h2>
              
              <div className={styles.updatesList}>
                <Link href="/updates/nasr-cup" className={styles.featuredUpdate}>
                  <div className={styles.featuredUpdateLabel}>IMPORTANT</div>
                  <h3 className={styles.featuredUpdateTitle}>Register for the Nasr Cup</h3>
                  <p className={styles.featuredUpdateDesc}>Registration is now open for the upcoming Nasr Football Cup. Form your teams and register before the deadline.</p>
                  <div className={styles.editorialLink}>View details <ArrowRight size={16} /></div>
                </Link>
                
                <Link href="/updates/hackathon" className={styles.standardUpdate}>
                  <div className={styles.updateSource}>
                    <div className={styles.updateMeta}>
                      <span className={styles.updateAuthor}>Tech and AI Committee</span>
                      <span className={styles.updateTime}>Technology &middot; Today</span>
                    </div>
                  </div>
                  <h3 className={styles.standardUpdateTitle}>KSIJ Hackathon - Build for the Community</h3>
                  <div className={styles.editorialLink}>Read more <ArrowRight size={16} /></div>
                </Link>

                <Link href="/updates/ai-bootcamp" className={styles.standardUpdate}>
                  <div className={styles.updateSource}>
                    <div className={styles.updateMeta}>
                      <span className={styles.updateAuthor}>Education Board</span>
                      <span className={styles.updateTime}>Education &middot; Yesterday</span>
                    </div>
                  </div>
                  <h3 className={styles.standardUpdateTitle}>2-Day AI Bootcamp</h3>
                  <div className={styles.editorialLink}>Read more <ArrowRight size={16} /></div>
                </Link>

                <Link href="/updates/medical-camp" className={styles.standardUpdate}>
                  <div className={styles.updateSource}>
                    <div className={styles.updateMeta}>
                      <span className={styles.updateAuthor}>Health & Welfare Board</span>
                      <span className={styles.updateTime}>Health &middot; Oct 1</span>
                    </div>
                  </div>
                  <h3 className={styles.standardUpdateTitle}>Annual Free Medical Camp</h3>
                  <div className={styles.editorialLink}>Read more <ArrowRight size={16} /></div>
                </Link>
              </div>

              <Link href="/updates" className={styles.viewAllLink}>
                View all updates <ArrowRight size={16} />
              </Link>
            </div>

            <div className={styles.editorialRight}>
              <h2 className="h2 mb-32" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>UPCOMING EVENTS</h2>
              
              <div className={styles.eventsList}>
                <Link href="/events/hackathon" className={styles.editorialEvent}>
                  <div className={styles.eventDateBlock}>
                    <span className={styles.eventMonth}>OCT</span>
                    <span className={styles.eventDay}>04</span>
                    <div className={styles.eventGoldLine}></div>
                  </div>
                  <div className={styles.eventDetails}>
                    <h3 className={styles.eventTitle}>KSIJ Hackathon</h3>
                    <p className={styles.eventInfo}>Khoja Masjid Imambada Hall Dongri<br/>9:00 AM</p>
                    <div className={styles.editorialLink}>View event <ArrowRight size={16} /></div>
                  </div>
                </Link>

                <Link href="/events/nasr-cup" className={styles.editorialEvent}>
                  <div className={styles.eventDateBlock}>
                    <span className={styles.eventMonth}>OCT</span>
                    <span className={styles.eventDay}>11</span>
                    <div className={styles.eventGoldLine}></div>
                  </div>
                  <div className={styles.eventDetails}>
                    <h3 className={styles.eventTitle}>NASR Football Cup</h3>
                    <p className={styles.eventInfo}>Registration open until Oct 4th.<br/>4:00 PM</p>
                    <div className={styles.editorialLink}>View event <ArrowRight size={16} /></div>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMMUNITY PULSE - NOW BELOW UPDATES */}
      <section className={styles.pulseSection}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.pulseHeader}>COMMUNITY PULSE</h2>
            <div className={styles.pulseGrid}>
              <div className={styles.pulseItem}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={styles.pulseNumber}
                >12</motion.div>
                <div className={styles.pulseLabel}>Upcoming Events</div>
              </div>
              <div className={styles.pulseItem}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={styles.pulseNumber}
                >34</motion.div>
                <div className={styles.pulseLabel}>Directory Listings</div>
              </div>
              <div className={styles.pulseItem}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={styles.pulseNumber}
                >6</motion.div>
                <div className={styles.pulseLabel}>Services</div>
              </div>
              <div className={styles.pulseItem}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className={styles.pulseNumber}
                >8</motion.div>
                <div className={styles.pulseLabel}>Updates</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FULL-WIDTH DARK GREEN FOOTER */}
      <footer className={styles.footerSection}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>KSIJ One</div>
            <div className={styles.footerTagline}>One community. Everything you need.</div>
            <div className={styles.footerGoldLine}></div>
            
            <div className={styles.footerLinks}>
              <Link href="/home">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/directory">Directory</Link>
              <Link href="/marketplace">Marketplace</Link>
              <Link href="/events">Events</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
