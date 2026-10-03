"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage, shareContact, markConversationCompleted } from "@/lib/actions/directory";
import styles from "./page.module.css";
import { Send, Phone, Mail, CheckCircle2 } from "lucide-react";

export default function ChatInterface({ conversation, currentUserId }: { conversation: any, currentUserId: string }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isOwner = currentUserId === conversation.ownerId;

  // Contact Share State
  const [sharePhone, setSharePhone] = useState(false);
  const [shareWhatsapp, setShareWhatsapp] = useState(false);
  const [shareEmail, setShareEmail] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;
    try {
      setIsSending(true);
      await sendMessage(conversation.id, text);
      setText("");
    } finally {
      setIsSending(false);
    }
  };

  const handleShare = async () => {
    try {
      await shareContact(conversation.id, {
        phone: sharePhone,
        whatsapp: shareWhatsapp,
        email: shareEmail
      });
      setShowShareModal(false);
    } catch (error) {
      alert("Failed to share contact");
    }
  };

  const handleComplete = async () => {
    if (confirm("Mark this conversation as completed?")) {
      await markConversationCompleted(conversation.id);
    }
  };

  // Determine if a contact share card should be rendered
  const contactShares = conversation.contactShares || [];

  return (
    <>
      <div className={styles.chatArea}>
        
        <div className={styles.messageList}>
          
          <div className={styles.systemMessage}>
            Conversation started regarding <strong>{conversation.listing.name}</strong>
          </div>

          {conversation.messages.map((msg: any) => {
            const isMine = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`${styles.messageWrapper} ${isMine ? styles.mine : styles.theirs}`}>
                <div className={styles.messageBubble}>
                  {msg.message}
                </div>
                <div className={styles.messageTime}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            );
          })}

          {contactShares.map((share: any) => (
            <div key={share.id} className={`${styles.messageWrapper} ${share.sharedById === currentUserId ? styles.mine : styles.theirs}`}>
              <div className={styles.contactCard}>
                <div className={styles.contactCardTitle}>Contact Details Shared</div>
                {share.phoneShared && conversation.listing.contact?.phone && (
                  <div className={styles.contactItem}><Phone size={16} /> {conversation.listing.contact.phone}</div>
                )}
                {share.whatsappShared && conversation.listing.contact?.whatsapp && (
                  <div className={styles.contactItem}><Phone size={16} color="#25D366" /> {conversation.listing.contact.whatsapp} (WA)</div>
                )}
                {share.emailShared && conversation.listing.contact?.email && (
                  <div className={styles.contactItem}><Mail size={16} /> {conversation.listing.contact.email}</div>
                )}
              </div>
              <div className={styles.messageTime}>
                {new Date(share.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}

          {conversation.status === "COMPLETED" && (
            <div className={styles.systemMessage}>
              This conversation was marked as completed.
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {conversation.status !== "COMPLETED" && (
          <div className={styles.inputArea}>
            
            {isOwner && conversation.status !== "CONTACT_SHARED" && (
              <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                <button className={`${styles.actionBtn} ${styles.primary}`} onClick={() => setShowShareModal(true)}>
                  Share Contact Details
                </button>
                <button className={styles.actionBtn} onClick={handleComplete}>
                  Mark Completed
                </button>
              </div>
            )}
            {!isOwner && conversation.status !== "COMPLETED" && (
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className={styles.actionBtn} onClick={handleComplete}>
                  Mark Completed
                </button>
              </div>
            )}

            <form className={styles.inputForm} onSubmit={handleSend}>
              <input 
                className={styles.input}
                placeholder="Type a message..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <button type="submit" className={styles.sendBtn} disabled={!text.trim() || isSending}>
                <Send size={20} />
              </button>
            </form>
          </div>
        )}

      </div>

      {showShareModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Share Contact</h3>
            <p className={styles.modalDesc}>Select which details to share with this user.</p>
            
            {conversation.listing.contact?.phone && (
              <label className={styles.checkbox}>
                <input type="checkbox" checked={sharePhone} onChange={e => setSharePhone(e.target.checked)} />
                Phone: {conversation.listing.contact.phone}
              </label>
            )}
            
            {conversation.listing.contact?.whatsapp && (
              <label className={styles.checkbox}>
                <input type="checkbox" checked={shareWhatsapp} onChange={e => setShareWhatsapp(e.target.checked)} />
                WhatsApp: {conversation.listing.contact.whatsapp}
              </label>
            )}
            
            {conversation.listing.contact?.email && (
              <label className={styles.checkbox}>
                <input type="checkbox" checked={shareEmail} onChange={e => setShareEmail(e.target.checked)} />
                Email: {conversation.listing.contact.email}
              </label>
            )}

            <div className={styles.modalActions}>
              <button className={styles.actionBtn} onClick={() => setShowShareModal(false)}>Cancel</button>
              <button 
                className={`${styles.actionBtn} ${styles.primary}`} 
                onClick={handleShare}
                disabled={!sharePhone && !shareWhatsapp && !shareEmail}
              >
                Share Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
