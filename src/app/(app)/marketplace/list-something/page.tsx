"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMarketplaceListing } from "@/lib/actions/marketplace";
import styles from "./page.module.css";

const CATEGORIES = [
  "PROPERTY", "VEHICLES", "ELECTRONICS", "FURNITURE", 
  "HOME_APPLIANCES", "BOOKS_EDUCATION", "CLOTHING_ACCESSORIES", "OTHER"
];

const TRANSACTION_TYPES = ["SALE", "RENT", "LEASE", "FREE", "OTHER"];

export default function ListSomethingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: "PROPERTY",
    transactionType: "SALE",
    title: "",
    shortDescription: "",
    description: "",
    price: "",
    isNegotiable: false,
    condition: "Used - Good",
    location: "",
    city: "",
    
    // category specific
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    furnishing: ""
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload: any = {
        category: formData.category,
        transactionType: formData.transactionType,
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        isNegotiable: formData.isNegotiable,
        condition: formData.condition,
        location: formData.location,
        city: formData.city
      };

      if (formData.price) {
        payload.price = parseFloat(formData.price);
      }

      if (formData.category === "PROPERTY") {
        payload.propertyType = formData.propertyType;
        if (formData.bedrooms) payload.bedrooms = parseInt(formData.bedrooms);
        if (formData.bathrooms) payload.bathrooms = parseInt(formData.bathrooms);
        payload.furnishing = formData.furnishing;
      }

      const listing = await createMarketplaceListing(payload);
      router.push(`/marketplace/member-marketplace/${listing.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create listing.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>List Something</h1>
        <p className={styles.subtitle}>Create a new listing in the Member Marketplace.</p>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          
          <div className={styles.row}>
            <div className={styles.formGroup} style={{flex: 1}}>
              <label className={styles.label}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={styles.select} required>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            
            <div className={styles.formGroup} style={{flex: 1}}>
              <label className={styles.label}>Transaction Type</label>
              <select name="transactionType" value={formData.transactionType} onChange={handleChange} className={styles.select} required>
                {TRANSACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Title</label>
            <input 
              name="title" value={formData.title} onChange={handleChange} 
              className={styles.input} placeholder="e.g. iPhone 15 Pro Max 256GB" required 
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup} style={{flex: 1}}>
              <label className={styles.label}>Price (₹)</label>
              <input 
                type="number" name="price" value={formData.price} onChange={handleChange} 
                className={styles.input} placeholder="e.g. 45000" 
              />
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="isNegotiable" checked={formData.isNegotiable} onChange={handleChange} />
                Price is negotiable
              </label>
            </div>
            
            <div className={styles.formGroup} style={{flex: 1}}>
              <label className={styles.label}>Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange} className={styles.select}>
                <option value="New">New</option>
                <option value="Used - Like New">Used - Like New</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Fair">Used - Fair</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Short Description</label>
            <input 
              name="shortDescription" value={formData.shortDescription} onChange={handleChange} 
              className={styles.input} placeholder="Brief one-line summary" required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Full Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} 
              className={styles.textarea} placeholder="Provide more details about your item..."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup} style={{flex: 1}}>
              <label className={styles.label}>City</label>
              <input 
                name="city" value={formData.city} onChange={handleChange} 
                className={styles.input} placeholder="e.g. Mumbai" required 
              />
            </div>
            <div className={styles.formGroup} style={{flex: 1}}>
              <label className={styles.label}>Locality / Area</label>
              <input 
                name="location" value={formData.location} onChange={handleChange} 
                className={styles.input} placeholder="e.g. Andheri West" required 
              />
            </div>
          </div>

          {formData.category === "PROPERTY" && (
            <div style={{ padding: '1.5rem', background: 'var(--color-background)', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Property Details</h3>
              <div className={styles.row}>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label className={styles.label}>Property Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={styles.select}>
                    <option value="">Select...</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label className={styles.label}>Furnishing</label>
                  <select name="furnishing" value={formData.furnishing} onChange={handleChange} className={styles.select}>
                    <option value="">Select...</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-furnished">Semi-furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label className={styles.label}>Bedrooms</label>
                  <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label className={styles.label}>Bathrooms</label>
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={styles.input} />
                </div>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={`${styles.btn} ${styles.btnSecondary}`}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={`${styles.btn} ${styles.btnPrimary}`}>
              {isSubmitting ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
