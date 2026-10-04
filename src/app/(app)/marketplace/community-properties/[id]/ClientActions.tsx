"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { initiateCommunityPropertyConversation } from "@/lib/actions/marketplace";
import { MessageCircle, X } from "lucide-react";
import styles from "../../member-marketplace/[id]/page.module.css";
import modalStyles from "@/app/(app)/directory/[id]/page.module.css"; // Reuse modal styles if possible, or just inline

export default function ClientActions({ propertyId, isAdmin }: { propertyId: string, isAdmin: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [purpose, setPurpose] = useState("Walima");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const initialMessage = `Assalamu Alaikum. I would like to enquire about this property.\n\nPurpose: ${purpose}\nDate: ${preferredDate}\nPreferred time: ${preferredTime}\nGuests: ${guestCount}\n\n${message}`;
      
      const conv = await initiateCommunityPropertyConversation(propertyId, {
        purpose,
        preferredDate,
        preferredTime,
        guestCount: parseInt(guestCount) || 0,
        message: initialMessage
      });
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
    <>
      <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowModal(true)}>
        <MessageCircle size={20} />
        Enquire About This Property
      </button>

      {showModal && (
        <div className={modalStyles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={modalStyles.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
            <div className={modalStyles.modalHeader}>
              <h3 className="h3">Enquiry Form</h3>
              <button className={modalStyles.closeBtn} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={modalStyles.modalBody}>
              <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Purpose</label>
                  <select 
                    value={purpose} 
                    onChange={(e) => setPurpose(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="Majlis">Majlis</option>
                    <option value="Niyaz">Niyaz</option>
                    <option value="Nikah">Nikah</option>
                    <option value="Walima">Walima</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Community Function">Community Function</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Preferred Date</label>
                    <input 
                      type="date" 
                      required
                      value={preferredDate} 
                      onChange={(e) => setPreferredDate(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Preferred Time</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 6 PM - 11 PM"
                      required
                      value={preferredTime} 
                      onChange={(e) => setPreferredTime(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Guest Count</label>
                  <input 
                    type="number" 
                    placeholder="Estimated number of guests"
                    required
                    value={guestCount} 
                    onChange={(e) => setGuestCount(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Additional Details</label>
                  <textarea 
                    placeholder="Any specific requirements or questions..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className={styles.btn} style={{ background: '#f1f5f9', color: '#334155' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className={`${styles.btn} ${styles.btnPrimary}`}>
                    {loading ? "Sending..." : "Start Enquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
