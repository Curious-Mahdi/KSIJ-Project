"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import styles from "./page.module.css";

export default function SearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/directory/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/directory/search`);
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <Search color="var(--color-text-muted)" size={24} style={{ marginRight: '12px' }} />
      <input 
        type="text" 
        className={styles.searchInput} 
        placeholder="Search for a business, service or skill..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.searchBtn}>Search</button>
    </form>
  );
}
