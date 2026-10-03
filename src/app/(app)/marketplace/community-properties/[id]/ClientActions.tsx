"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { initiateCommunityPropertyConversation } from "@/lib/actions/marketplace";
import { MessageCircle } from "lucide-react";
import styles from "../../member-marketplace/[id]/page.module.css";

export default function ClientActions({ propertyId, isAdmin }: { propertyId: string, isAdmin: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    try {
      setLoading(true);
      const conv = await initiateCommunityPropertyConversation(propertyId);
      router.push(`/directory/chat/${conv.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to start conversation");
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <div className={styles.ownerActions}>
        <button className={`${styles.btn} ${styles.btnSecondary}`}>Edit Property</button>
      </div>
    );
  }

  return (
    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleContact} disabled={loading}>
      <MessageCircle size={20} />
      {loading ? "Starting..." : "Inquire Now"}
    </button>
  );
}
