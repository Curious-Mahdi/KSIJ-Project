"use client";

import styles from "./page.module.css";
import { ChevronRight, FileText, Bookmark, Phone, Info, HelpCircle, Settings } from "lucide-react";

export default function MorePage() {
  return (
    <div className={styles.container}>
      <h1 className="h2 mb-24">More</h1>

      <div className="card" style={{ padding: 0 }}>
        <button className={styles.actionItem}>
          <div className="flex-center gap-12">
            <FileText className="text-primary" size={20} />
            <span>Forms & Documents</span>
          </div>
          <ChevronRight size={20} className="text-secondary" />
        </button>

        <button className={styles.actionItem}>
          <div className="flex-center gap-12">
            <Bookmark className="text-primary" size={20} />
            <span>Community Resources</span>
          </div>
          <ChevronRight size={20} className="text-secondary" />
        </button>

        <button className={styles.actionItem}>
          <div className="flex-center gap-12">
            <Phone className="text-primary" size={20} />
            <span>Important Contacts</span>
          </div>
          <ChevronRight size={20} className="text-secondary" />
        </button>
      </div>

      <div className="card mt-24" style={{ padding: 0 }}>
        <button className={styles.actionItem}>
          <div className="flex-center gap-12">
            <Info className="text-primary" size={20} />
            <span>About KSIJ Reload</span>
          </div>
          <ChevronRight size={20} className="text-secondary" />
        </button>

        <button className={styles.actionItem}>
          <div className="flex-center gap-12">
            <HelpCircle className="text-primary" size={20} />
            <span>Help & Support</span>
          </div>
          <ChevronRight size={20} className="text-secondary" />
        </button>

        <button className={styles.actionItem}>
          <div className="flex-center gap-12">
            <Settings className="text-primary" size={20} />
            <span>App Settings</span>
          </div>
          <ChevronRight size={20} className="text-secondary" />
        </button>
      </div>
      
      <div className={styles.footer}>
        <p className="small-text">KSIJ Reload App v1.0.0</p>
      </div>
    </div>
  );
}
