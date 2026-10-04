"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import styles from "./page.module.css";
import { CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  return (
    <main className={styles.splitLayout}>
      
      {/* Left Panel - Branding */}
      <div className={styles.brandPanel}>
        <div>
          <div className={styles.brandLogo}>
            KSIJ One
          </div>
          
          <div className={styles.brandContent}>
            <div className="animateFadeUp">
              <h1 className={styles.brandStatement}>
                One community.<br/>
                One place.<br/>
                <span className={styles.brandAccent}>Everything connected.</span>
              </h1>
            </div>
            <p className={`${styles.brandDescription} animateFadeUp delay-100`}>
              One place for everything your community has to offer. A simpler way to access, discover and stay connected with your community.
            </p>
          </div>
        </div>

        <div className={`${styles.verificationBadge} animateFadeUp delay-200`}>
          <CheckCircle2 size={16} className={styles.brandAccent} />
          Every member verified by their jamaat
        </div>
      </div>

      {/* Right Panel - Auth */}
      <div className={styles.authPanel}>
        <div className={styles.authContent}>
          
          <h2 className={`${styles.welcomeTitle} animateFadeUp`}>Welcome back</h2>
          <p className={`${styles.welcomeText} animateFadeUp delay-100`}>
            Continue with your Google account to access KSIJ One and everything your community has to offer.
          </p>

          <div className="animateFadeUp delay-200 w-full">
            <button 
              className={styles.googleBtn}
              onClick={() => signIn("google", { callbackUrl: "/home" })}
            >
              <div className={styles.btnIconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span>Continue with Google</span>
              <div className={styles.trailingIcon}>&rarr;</div>
            </button>
          </div>

          {/* Quick Demo & Admin Access */}
          <div className="animateFadeUp delay-200 w-full" style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.75rem 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
              <span style={{ fontSize: "0.72rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Quick Access</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => signIn("credentials", { email: "mmahdijamani7@gmail.com", callbackUrl: "/admin" })}
                style={{
                  padding: "0.625rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #27272a",
                  background: "#18181b",
                  color: "#ffffff",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem"
                }}
              >
                <span>👑 Admin Portal</span>
              </button>

              <button
                type="button"
                onClick={() => signIn("credentials", { email: "fakeuser1@example.com", callbackUrl: "/home" })}
                style={{
                  padding: "0.625rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #d4d4d8",
                  background: "#ffffff",
                  color: "#18181b",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem"
                }}
              >
                <span>🏠 Member Home</span>
              </button>
            </div>
          </div>

          <div className="animateFadeUp delay-300 w-full">
            <button className={styles.oneIdBtn} disabled>
            <span className={styles.comingSoonBadge}>COMING SOON</span>
            
            <div className={styles.oneIdBranding}>
              <svg className={styles.oneIdIcon} width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="16" stroke="#404040" strokeWidth="3" strokeDasharray="4 2"/>
                <circle cx="20" cy="20" r="10" stroke="#404040" strokeWidth="2.5"/>
                <path d="M20 14L25 17V23L20 26L15 23V17L20 14Z" fill="none" stroke="#404040" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              <div className={styles.oneIdTextStack}>
                <div className={styles.oneIdLogoText}>
                  <span className={styles.oneIdOne}>One</span><span className={styles.oneIdID}>ID</span>
                </div>
                <div className={styles.oneIdByWf}>BY WF</div>
              </div>
            </div>

            <span className={styles.oneIdBtnText}>Sign in with One ID</span>
            <div className={styles.trailingIcon}>&rarr;</div>
          </button>
          </div>

          <p className={`${styles.disclaimerText} animateFadeUp delay-400`}>
            New accounts are reviewed and verified before access to KSIJ One is granted.
          </p>

          <div className={`${styles.legalLinks} animateFadeUp delay-400`}>
            <Link href="#" className={styles.legalLink}>Terms of Service</Link>
            <Link href="#" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="#" className={styles.legalLink}>Community Guidelines</Link>
            <Link href="#" className={styles.legalLink} style={{width: '100%', marginTop: '8px'}}>Deleting your account</Link>
          </div>

        </div>
      </div>
      
    </main>
  );
}
