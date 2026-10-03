"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/lib/actions/directory";
import styles from "./page.module.css";
import { Building2, Briefcase, UserSquare2, X } from "lucide-react";

const CATEGORIES = [
  "Healthcare", "Education", "Technology & Digital", "Food & Dining",
  "Retail & Shopping", "Professional Services", "Home Services",
  "Travel & Transport", "Personal Services", "Other"
];

export default function ListYourselfForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    listingType: "",
    name: "",
    shortDescription: "",
    description: "",
    category: "",
    subcategory: "",
    services: [] as string[],
    skills: [] as string[],
    location: "",
    serviceArea: "",
    serviceMode: "Both", // Online, In-person, Both
    website: "",
    phone: "",
    whatsapp: "",
    email: "",
    phoneVisibility: "CHAT_ONLY",
    whatsappVisibility: "CHAT_ONLY",
    emailVisibility: "CHAT_ONLY",
  });

  const [tagInput, setTagInput] = useState("");

  const handleNext = () => setStep((s) => Math.min(s + 1, 9));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>, field: 'services' | 'skills') => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (index: number, field: 'services' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const submitForm = async () => {
    try {
      setIsSubmitting(true);
      await createListing(formData);
      router.push('/directory'); // redirect to directory landing on success
    } catch (error) {
      console.error(error);
      alert("Failed to create listing. Make sure you are logged in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      
      {step === 1 && (
        <div className="animateFadeUp">
          <h1 className={styles.stepTitle}>What would you like to list?</h1>
          <p className={styles.stepDesc}>Choose the type of listing you are creating.</p>
          
          <div className={styles.typeCards}>
            <div 
              className={`${styles.typeCard} ${formData.listingType === 'Business' ? styles.typeCardSelected : ''}`}
              onClick={() => setFormData({...formData, listingType: 'Business'})}
            >
              <div className={styles.typeIcon}><Building2 size={32} /></div>
              <div className={styles.typeCardTitle}>Business</div>
              <div style={{fontSize: '0.875rem', color: 'var(--color-text-secondary)'}}>e.g., Pharmacy, Store, Agency</div>
            </div>

            <div 
              className={`${styles.typeCard} ${formData.listingType === 'Service' ? styles.typeCardSelected : ''}`}
              onClick={() => setFormData({...formData, listingType: 'Service'})}
            >
              <div className={styles.typeIcon}><Briefcase size={32} /></div>
              <div className={styles.typeCardTitle}>Service</div>
              <div style={{fontSize: '0.875rem', color: 'var(--color-text-secondary)'}}>e.g., Web Developer, Agency, Plumber</div>
            </div>

            <div 
              className={`${styles.typeCard} ${formData.listingType === 'Professional' ? styles.typeCardSelected : ''}`}
              onClick={() => setFormData({...formData, listingType: 'Professional'})}
            >
              <div className={styles.typeIcon}><UserSquare2 size={32} /></div>
              <div className={styles.typeCardTitle}>Professional</div>
              <div style={{fontSize: '0.875rem', color: 'var(--color-text-secondary)'}}>e.g., Doctor, CA, Lawyer</div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animateFadeUp">
          <h1 className={styles.stepTitle}>Basic Information</h1>
          <p className={styles.stepDesc}>Tell the community who you are.</p>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Name / Business Name</label>
            <input 
              className={styles.input} 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. PixelCraft Studio or Ali Mohammed" 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Short Description (Headline)</label>
            <input 
              className={styles.input} 
              value={formData.shortDescription} 
              onChange={e => setFormData({...formData, shortDescription: e.target.value})}
              placeholder="e.g. Creative studio specialising in branding" 
              maxLength={100}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>About (Full Description)</label>
            <textarea 
              className={styles.textarea} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Detail your experience, history, and what you offer..." 
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animateFadeUp">
          <h1 className={styles.stepTitle}>Category</h1>
          <p className={styles.stepDesc}>Help people discover your listing.</p>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Select Category</label>
            <select 
              className={styles.select}
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Subcategory / Profession (Optional)</label>
            <input 
              className={styles.input} 
              value={formData.subcategory} 
              onChange={e => setFormData({...formData, subcategory: e.target.value})}
              placeholder="e.g. Dentist, AC Repair, Digital Agency" 
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="animateFadeUp">
          <h1 className={styles.stepTitle}>Services & Skills</h1>
          <p className={styles.stepDesc}>Add keywords so people can search for exactly what they need.</p>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Add Services / Keywords</label>
            <div className={styles.tagInputWrap}>
              {formData.services.map((tag, i) => (
                <div key={i} className={styles.tag}>
                  {tag}
                  <X size={14} className={styles.tagRemove} onClick={() => removeTag(i, 'services')} />
                </div>
              ))}
              <input 
                className={styles.tagInput}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => addTag(e, 'services')}
                placeholder="Type and press Enter..."
              />
            </div>
            <span style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>e.g. Web Design, AC Repair, Tax Consultation</span>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="animateFadeUp">
          <h1 className={styles.stepTitle}>Location & Service Area</h1>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Service Mode</label>
            <select 
              className={styles.select}
              value={formData.serviceMode}
              onChange={e => setFormData({...formData, serviceMode: e.target.value})}
            >
              <option value="Online">Online / Remote</option>
              <option value="In-person">In-person / Physical</option>
              <option value="Both">Both Online & In-person</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Location / Base Area (Optional)</label>
            <input 
              className={styles.input} 
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. Dongri, Mumbai" 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Service Area coverage (Optional)</label>
            <input 
              className={styles.input} 
              value={formData.serviceArea} 
              onChange={e => setFormData({...formData, serviceArea: e.target.value})}
              placeholder="e.g. Mumbai South, India-wide, Global" 
            />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="animateFadeUp">
          <h1 className={styles.stepTitle}>Contact & Privacy</h1>
          <p className={styles.stepDesc}>How should people contact you?</p>
          
          <div style={{ backgroundColor: 'var(--color-surface-success)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-primary-dark)'}}>
              🔒 Recommended: By default, users must start a private KSIJ chat with you to request contact details.
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone Number (Optional)</label>
            <div style={{display: 'flex', gap: '8px'}}>
              <input 
                className={styles.input} 
                style={{flex: 1}}
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+91..." 
              />
              <select 
                className={styles.select} 
                value={formData.phoneVisibility}
                onChange={e => setFormData({...formData, phoneVisibility: e.target.value})}
              >
                <option value="CHAT_ONLY">Share via Chat only (Private)</option>
                <option value="PUBLIC">Public on listing</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>WhatsApp Number (Optional)</label>
            <div style={{display: 'flex', gap: '8px'}}>
              <input 
                className={styles.input} 
                style={{flex: 1}}
                value={formData.whatsapp} 
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                placeholder="+91..." 
              />
              <select 
                className={styles.select} 
                value={formData.whatsappVisibility}
                onChange={e => setFormData({...formData, whatsappVisibility: e.target.value})}
              >
                <option value="CHAT_ONLY">Share via Chat only (Private)</option>
                <option value="PUBLIC">Public on listing</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address (Optional)</label>
            <div style={{display: 'flex', gap: '8px'}}>
              <input 
                className={styles.input} 
                style={{flex: 1}}
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="hello@example.com" 
              />
              <select 
                className={styles.select} 
                value={formData.emailVisibility}
                onChange={e => setFormData({...formData, emailVisibility: e.target.value})}
              >
                <option value="CHAT_ONLY">Share via Chat only (Private)</option>
                <option value="PUBLIC">Public on listing</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Website (Optional)</label>
            <input 
              className={styles.input} 
              value={formData.website} 
              onChange={e => setFormData({...formData, website: e.target.value})}
              placeholder="https://..." 
            />
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="animateFadeUp">
          <h1 className={styles.stepTitle}>Preview & Publish</h1>
          <p className={styles.stepDesc}>Review your information.</p>
          
          <div style={{ padding: '24px', border: '1px solid var(--color-border)', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px'}}>
              {formData.listingType} &middot; {formData.category}
            </div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0'}}>{formData.name || 'Your Listing Name'}</h2>
            <p style={{color: 'var(--color-text-secondary)', margin: '0 0 16px 0'}}>{formData.shortDescription || 'Short description will appear here'}</p>
            
            {formData.services.length > 0 && (
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px'}}>
                {formData.services.map((s, i) => (
                  <span key={i} style={{fontSize: '0.75rem', padding: '4px 10px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '12px'}}>{s}</span>
                ))}
              </div>
            )}
            
            <p style={{fontSize: '0.875rem'}}>{formData.serviceMode} &middot; {formData.location || 'No location specified'}</p>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        {step > 1 ? (
          <button className={styles.btnSecondary} onClick={handlePrev} disabled={isSubmitting}>Back</button>
        ) : <div></div>}
        
        {step < 7 ? (
          <button 
            className={styles.btnPrimary} 
            onClick={handleNext}
            disabled={
              (step === 1 && !formData.listingType) ||
              (step === 2 && (!formData.name || !formData.shortDescription)) ||
              (step === 3 && !formData.category)
            }
          >
            Continue
          </button>
        ) : (
          <button className={styles.btnPrimary} onClick={submitForm} disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Listing'}
          </button>
        )}
      </div>

    </div>
  );
}
