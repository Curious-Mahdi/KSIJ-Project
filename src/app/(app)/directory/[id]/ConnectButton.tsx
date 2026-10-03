"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startConversation } from "@/lib/actions/directory";
import styles from "./page.module.css";
import { MessageCircle } from "lucide-react";

export default function ConnectButton({ listingId }: { listingId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const conversationId = await startConversation(listingId);
      router.push(`/directory/chat/${conversationId}`);
    } catch (error: any) {
      alert(error.message || "Failed to start conversation.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <button className={styles.ctaBtn} onClick={handleConnect} disabled={isLoading}>
        <MessageCircle size={24} />
        {isLoading ? "Starting..." : "Start a conversation"}
      </button>
      <p className={styles.privacyNote}>
        Contact details are shared only with the listing owner's permission.
      </p>
    </div>
  );
}
