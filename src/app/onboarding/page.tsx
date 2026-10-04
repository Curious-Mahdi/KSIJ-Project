"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./actions";

const JAMAATS = [
  "KSIJ Mumbai",
  "KSIJ Ahmedabad",
  "KSIJ Bhavnagar",
  "KSIJ Pune",
  "KSIJ Surat",
  "KSIJ Navsari"
];

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [jamaat, setJamaat] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session?.user?.jamaat) {
        router.push("/home");
      } else {
        setName(session.user?.name || "");
      }
    }
  }, [status, session, router]);

  if (status !== "authenticated" || !session) return null;

  const handleSave = async () => {
    if (!name || !jamaat) return;
    setSaving(true);
    
    // Save via server action
    const res = await completeOnboarding(session.user.id, name, jamaat);
    if (res.success) {
      // Force next-auth to update the session state
      await update({
        ...session,
        user: { ...session.user, jamaat, name }
      });
      router.push("/home");
    } else {
      setSaving(false);
      alert(res.error || "Something went wrong.");
    }
  };

  const filteredJamaats = JAMAATS.filter(j => j.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--color-background)',
      padding: 'var(--space-24)'
    }}>
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '480px', 
        padding: 'var(--space-48)',
        boxShadow: 'var(--shadow-lg)',
        border: 'none'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
          <h1 className="h1" style={{ fontSize: '2rem', marginBottom: 'var(--space-8)', color: 'var(--color-text-main)' }}>
            Welcome to KSIJ One
          </h1>
          <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
            Let's set up your community profile.
          </p>
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
              <div style={{ position: 'relative' }}>
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', boxShadow: 'var(--shadow-md)' }}
                  />
                ) : (
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--color-sidebar)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '500' }}>
                    {session.user.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Email Address</label>
              <input 
                type="text" 
                value={session.user.email || ""}
                disabled
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '1rem',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <button 
              onClick={() => setStep(2)} 
              disabled={!name} 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'var(--space-8)', padding: '12px', fontSize: '1rem' }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Which Jamaat are you associated with?</label>
              <input 
                type="text" 
                placeholder="Search Jamaat..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <div style={{ 
              maxHeight: '220px', 
              overflowY: 'auto', 
              border: '1px solid var(--color-border)', 
              borderRadius: 'var(--radius-md)', 
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface)'
            }}>
              {filteredJamaats.map(j => (
                <button 
                  key={j} 
                  onClick={() => setJamaat(j)}
                  style={{ 
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: jamaat === j ? 'var(--color-surface-hover)' : 'transparent',
                    color: jamaat === j ? 'var(--color-primary)' : 'var(--color-text-main)',
                    fontWeight: jamaat === j ? '600' : '400',
                    transition: 'all 0.1s ease',
                    borderLeft: jamaat === j ? '3px solid var(--color-primary)' : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (jamaat !== j) e.currentTarget.style.backgroundColor = 'var(--color-background)';
                  }}
                  onMouseLeave={(e) => {
                    if (jamaat !== j) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {j}
                </button>
              ))}
              {filteredJamaats.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No Jamaat found matching "{search}"
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-12)', marginTop: 'var(--space-16)' }}>
              <button 
                onClick={() => setStep(1)} 
                className="btn btn-outline" 
                style={{ flex: 1, padding: '12px' }}
              >
                Back
              </button>
              <button 
                onClick={handleSave} 
                disabled={!jamaat || saving} 
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                {saving ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
