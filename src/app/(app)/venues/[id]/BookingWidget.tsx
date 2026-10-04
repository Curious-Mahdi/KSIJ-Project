"use client";
import { useState, useEffect } from "react";
import { Phone, Calendar as CalendarIcon, Check } from "lucide-react";
import Script from "next/script";

export default function BookingWidget({ propertyId, price }: { propertyId: string, price: string }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate next 14 days
  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const dates = getDates();
  // Mock already booked dates
  const bookedDates = [dates[2].toDateString(), dates[5].toDateString(), dates[8].toDateString()];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 10000 })
      });
      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: data.amount,
        currency: "INR",
        name: "KSIJ One Jamaat",
        description: "Venue Booking Deposit",
        handler: function (response: any) {
          alert("Booking successful! Payment ID: " + response.razorpay_payment_id);
          window.location.href = `/venues`;
        },
        prefill: {
          name: "Jamaat Member",
          email: "member@example.com",
          contact: "9999999999"
        },
        theme: { color: "#043D29" }
      };
      
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed to initialize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', backgroundColor: '#e5e7eb', color: '#374151', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', marginBottom: '24px' }}>
        <Phone size={20} />
        Call Jamaat: +91 9876543210
      </a>

      <div style={{ marginBottom: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CalendarIcon size={18} />
        Select Booking Date
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {dates.map((d, i) => {
          const isBooked = bookedDates.includes(d.toDateString());
          const isSelected = selectedDate === d.toDateString();
          return (
            <button
              key={i}
              disabled={isBooked}
              onClick={() => setSelectedDate(d.toDateString())}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: isBooked ? '#f3f4f6' : isSelected ? '#ecfdf5' : 'white',
                color: isBooked ? '#9ca3af' : 'inherit',
                cursor: isBooked ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>
                {d.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {d.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Selected Date</span>
            <span style={{ fontWeight: 600 }}>{selectedDate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Booking Amount</span>
            <span style={{ fontWeight: 600 }}>₹50,000 (3 hrs)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '8px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Required Deposit</span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹10,000</span>
          </div>
        </div>
      )}

      <button 
        onClick={handlePayment}
        disabled={!selectedDate || loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: selectedDate ? 'var(--color-primary)' : '#9ca3af',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: selectedDate && !loading ? 'pointer' : 'not-allowed',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s'
        }}
      >
        {loading ? "Processing..." : "Pay ₹10,000 to Book"}
      </button>
    </div>
  );
}
