"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { initiateMarketplaceConversation } from "@/lib/actions/marketplace";
import { MessageCircle } from "lucide-react";
import styles from "./page.module.css";

export default function ClientActions({ listingId, isOwner }: { listingId: string, isOwner: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    try {
      setLoading(true);
      const conv = await initiateMarketplaceConversation(listingId);
      router.push(`/directory/chat/${conv.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to start conversation");
    } finally {
      setLoading(false);
    }
  };

  if (isOwner) {
    return (
      <div className={styles.ownerActions}>
        <button className={`${styles.btn} ${styles.btnSecondary}`}>Edit Listing</button>
      </div>
    );
  }

  return (
    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleContact} disabled={loading}>
      <MessageCircle size={20} />
      {loading ? "Starting..." : "Start a Conversation"}
    </button>
  );
}
