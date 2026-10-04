import Link from "next/link";
import { Search, MapPin, Briefcase, Users, Heart, LayoutGrid, Clock, ArrowRight, CheckCircle2, Filter } from "lucide-react";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";

export default async function OpportunitiesPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedParams = await searchParams;
  const { q, type, location, experience } = resolvedParams;

  // Build prisma query
  let where: any = { status: "PUBLISHED" };
  
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { organisationName: { contains: q, mode: 'insensitive' } },
      { skills: { contains: q, mode: 'insensitive' } },
    ];
  }
  
  if (type && type !== "ALL") {
    where.type = type.toUpperCase();
  }
  
  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }
  
  if (experience) {
    where.experienceLevel = { contains: experience, mode: 'insensitive' };
  }

  const opportunities = await prisma.opportunity.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

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

  const getIcon = (type: string) => {
    switch (type) {
      case 'MENTORSHIP': return <Users size={16} />;
      case 'PROJECT': return <LayoutGrid size={16} />;
      case 'VOLUNTEERING': return <Heart size={16} />;
      default: return <Briefcase size={16} />;
    }
  };

  return (
    <div className={styles.container}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Opportunities</span>
          <h1 className={styles.heroTitle}>Find your next opportunity.</h1>
          <p className={styles.heroSubtitle}>
            Jobs, internships, mentors, community projects and ways to contribute — all within one community.
          </p>
          
          <form action="/opportunities" method="GET" className={styles.searchContainer}>
            <div className={styles.searchIcon}>
              <Search size={20} />
            </div>
            <input 
              type="text" 
              name="q" 
              placeholder="Search jobs, internships, skills, companies..." 
              className={styles.searchInput}
              defaultValue={q || ""}
            />
            {q && (
              <Link href="/opportunities" className={styles.searchClear}>
                &times;
              </Link>
            )}
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
            {/* Preserve other filters */}
            {type && <input type="hidden" name="type" value={type} />}
            {location && <input type="hidden" name="location" value={location} />}
            {experience && <input type="hidden" name="experience" value={experience} />}
          </form>

          <div className={styles.searchSuggestions}>
            <span>Try:</span>
            <Link href="/opportunities?q=Software Engineering" className={styles.suggestionChip}>Software Engineering</Link>
            <Link href="/opportunities?type=INTERNSHIP" className={styles.suggestionChip}>Internships</Link>
            <Link href="/opportunities?location=Remote" className={styles.suggestionChip}>Remote</Link>
            <Link href="/opportunities?type=MENTORSHIP" className={styles.suggestionChip}>Mentorship</Link>
            <Link href="/opportunities?type=VOLUNTEERING" className={styles.suggestionChip}>Volunteering</Link>
          </div>
          
          <div className={styles.intentBox}>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div className={styles.intentLabel}>Not sure what to search?</div>
              <input 
                type="text" 
                placeholder="I'm a second-year engineering student looking for a software internship in Mumbai" 
                className={styles.intentInput}
                disabled
              />
            </div>
            <button className={styles.intentButton} disabled>
              Find opportunities <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className={styles.tabsWrapper}>
        <div className={styles.tabsContainer}>
          {["ALL", "JOB", "INTERNSHIP", "MENTORSHIP", "PROJECT", "VOLUNTEERING"].map(t => {
            const isActive = (type || "ALL") === t;
            return (
              <Link 
                key={t}
                href={`/opportunities?type=${t}${q ? `&q=${q}` : ''}${location ? `&location=${location}` : ''}`} 
                className={`${styles.tab} ${isActive ? styles.tabActive : styles.tabInactive}`}
              >
                {t === "ALL" ? "ALL" : t + "S"}
              </Link>
            );
          })}
        </div>
      </div>

      <main className={styles.mainLayout}>
        {/* FILTERS */}
        <aside className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Location</h3>
            {['Mumbai', 'Pune', 'Bengaluru', 'Remote', 'Hybrid'].map(loc => (
              <label key={loc} className={styles.filterItem}>
                <input type="checkbox" className={styles.checkbox} checked={location === loc} readOnly />
                <Link href={`/opportunities?location=${loc}${type ? `&type=${type}` : ''}`} style={{color: 'inherit', textDecoration: 'none'}}>
                  {loc}
                </Link>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Experience</h3>
            {['Student', 'Fresher', '0-2 years', '2-5 years', '5+ years'].map(exp => (
              <label key={exp} className={styles.filterItem}>
                <input type="checkbox" className={styles.checkbox} checked={experience === exp} readOnly />
                <Link href={`/opportunities?experience=${exp}${type ? `&type=${type}` : ''}`} style={{color: 'inherit', textDecoration: 'none'}}>
                  {exp}
                </Link>
              </label>
            ))}
          </div>
        </aside>

        <div className={styles.content}>
          <button className={styles.mobileFilterBtn}>
            <Filter size={18} /> Filters
          </button>

          {/* BEYOND JOBS SECTION (Only show on ALL tab or specific tabs, and no search) */}
          {(!type || type === "ALL") && !q && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Beyond jobs</h2>
                  <p className={styles.sectionSubtitle}>Opportunities to learn, contribute and grow within the community.</p>
                </div>
              </div>
              
              <div className={styles.beyondGrid}>
                <Link href="/opportunities?type=MENTORSHIP" className={styles.beyondCard}>
                  <div className={styles.beyondIcon}><Users size={28} /></div>
                  <h3 className={styles.beyondTitle}>Mentorship</h3>
                  <p className={styles.beyondDesc}>Learn directly from professionals in the community.</p>
                  <span className={styles.beyondAction}>Explore Mentors &rarr;</span>
                </Link>
                <Link href="/opportunities?type=PROJECT" className={styles.beyondCard}>
                  <div className={styles.beyondIcon}><LayoutGrid size={28} /></div>
                  <h3 className={styles.beyondTitle}>Community Projects</h3>
                  <p className={styles.beyondDesc}>Work with others on projects that benefit the community.</p>
                  <span className={styles.beyondAction}>View Projects &rarr;</span>
                </Link>
                <Link href="/opportunities?type=VOLUNTEERING" className={styles.beyondCard}>
                  <div className={styles.beyondIcon}><Heart size={28} /></div>
                  <h3 className={styles.beyondTitle}>Volunteering</h3>
                  <p className={styles.beyondDesc}>Give your skills and time where they're needed.</p>
                  <span className={styles.beyondAction}>Join as Volunteer &rarr;</span>
                </Link>
              </div>
            </section>
          )}

          {/* LISTINGS */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  {q ? `Search results for "${q}"` : type && type !== "ALL" ? `${type}S` : "Featured opportunities"}
                </h2>
                <p className={styles.sectionSubtitle}>
                  {opportunities.length} {opportunities.length === 1 ? 'opportunity' : 'opportunities'} found
                </p>
              </div>
              <Link href="/opportunities/post" className={styles.postButton}>
                Post Opportunity
              </Link>
            </div>

            {opportunities.length === 0 ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>No opportunities match your criteria.</h3>
                <p className={styles.emptyDesc}>Try adjusting your filters, or be the first to share one!</p>
                <Link href="/opportunities/post" className={styles.postButton}>Post an Opportunity</Link>
              </div>
            ) : (
              <div className={styles.cardsList}>
                {opportunities.map((opp) => (
                  <Link href={`/opportunities/${opp.id}`} key={opp.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={`${styles.cardBadge} ${getBadgeStyle(opp.type)}`}>
                        {opp.type}
                      </span>
                      {opp.createdAt && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {new Date(opp.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <h3 className={styles.cardTitle}>{opp.title}</h3>
                    
                    <div className={styles.cardOrg}>
                      {opp.organisationName}
                      {opp.verificationStatus === 'VERIFIED' && (
                        <CheckCircle2 size={16} className={styles.verifiedIcon} title="Verified Organisation" />
                      )}
                    </div>

                    <div className={styles.cardMeta}>
                      {opp.location && (
                        <div className={styles.metaItem}>
                          <MapPin size={16} /> {opp.location} {opp.workMode && `· ${opp.workMode}`}
                        </div>
                      )}
                      {(opp.compensationMin || opp.compensationMax) && (
                        <div className={styles.metaItem}>
                          <Briefcase size={16} /> 
                          {opp.currency} {opp.compensationMin} 
                          {opp.compensationMax ? ` – ${opp.compensationMax}` : ''}
                          {opp.compensationPeriod ? ` / ${opp.compensationPeriod}` : ''}
                        </div>
                      )}
                      {opp.experienceLevel && (
                        <div className={styles.metaItem}>
                          <Users size={16} /> {opp.experienceLevel}
                        </div>
                      )}
                    </div>

                    {opp.skills && (
                      <div className={styles.cardSkills}>
                        {opp.skills.split(',').map((skill, idx) => (
                          <span key={idx} className={styles.skillTag}>{skill.trim()}</span>
                        ))}
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <div>
                        {opp.applicationDeadline ? `Closes ${new Date(opp.applicationDeadline).toLocaleDateString()}` : "Open"}
                      </div>
                      <div className={styles.cardAction}>
                        View details <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
