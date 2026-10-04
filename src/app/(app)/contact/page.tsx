"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, Loader2, Mail, Phone, MapPin, HelpCircle } from "lucide-react";
import { submitEnquiry } from "@/lib/actions/enquiries";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

export default function ContactEnquiryPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "General",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await submitEnquiry(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      {/* Hero Header */}
      <div
        className="border-b"
        style={{
          background: "linear-gradient(135deg, #f0f7f2 0%, #f5faf6 50%, #fafaf8 100%)",
          borderColor: "#e8ece9",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Link
            href="/home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#0B5133",
              fontSize: "0.8125rem",
              fontWeight: 600,
              marginBottom: "12px",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1
            className="font-bold mb-2"
            style={{
              fontSize: "1.875rem",
              color: "#122019",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Community Help Desk &amp; Enquiries
          </h1>
          <p style={{ color: "#68736D", fontSize: "0.9375rem" }}>
            Have a question about services, scheme eligibility, facility bookings, or general assistance? Reach out to the Jamaat team.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Direct Info */}
          <div className="md:col-span-1">
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#122019", marginBottom: "16px" }}>
              Central Office
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.875rem", color: "#4B5563" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <MapPin size={18} color="#0B5133" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>KSIJ Jamaat Complex, Main Street, Mumbai, Maharashtra</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Phone size={18} color="#0B5133" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>+91 22 2370 0000 / 0001</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Mail size={18} color="#0B5133" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>helpdesk@ksij.org</span>
              </div>
            </div>

            <div
              style={{
                marginTop: "32px",
                padding: "16px",
                backgroundColor: "#e8f4ee",
                borderRadius: "12px",
                border: "1px solid rgba(11, 81, 51, 0.15)",
              }}
            >
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                <HelpCircle size={16} color="#0B5133" />
                <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0B5133" }}>
                  Instant AI Assistant
                </span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#4B5563", lineHeight: 1.5 }}>
                Need instant answers regarding schemes, timings, or forms? Click the chat button in the bottom right corner!
              </p>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="md:col-span-2">
            <div
              className="bg-white border"
              style={{
                borderRadius: "16px",
                borderColor: "#DDE3DE",
                padding: "32px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              {submitted ? (
                <div style={{ textAlign: "center", padding: "32px 16px" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      backgroundColor: "#e8f4ee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <CheckCircle2 size={32} color="#0B5133" />
                  </div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#122019", marginBottom: "8px" }}>
                    Enquiry Submitted Successfully
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563", lineHeight: 1.6, marginBottom: "24px" }}>
                    Thank you for reaching out. Your enquiry ticket has been forwarded to the appropriate administrative department. We typically respond within 1-2 working days.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                        category: "General",
                      });
                    }}
                    style={{
                      backgroundColor: "#0B5133",
                      color: "#FFFFFF",
                      padding: "10px 24px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#122019", marginBottom: "16px" }}>
                    Submit an Enquiry
                  </h2>

                  {error && (
                    <div
                      style={{
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#dc2626",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        fontSize: "0.8125rem",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "0.875rem",
                            marginTop: "4px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "0.875rem",
                            marginTop: "4px",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "0.875rem",
                            marginTop: "4px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                          Topic / Department *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "0.875rem",
                            marginTop: "4px",
                            outline: "none",
                          }}
                        >
                          <option value="General">General Inquiry</option>
                          <option value="Services & Schemes">Services &amp; Schemes</option>
                          <option value="Facilities Booking">Facilities &amp; Halls</option>
                          <option value="Welfare">Welfare Assistance</option>
                          <option value="Grievance">Grievance / Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Brief summary of your question..."
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                          marginTop: "4px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                        Your Message / Question *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Please describe your question or issue in detail..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                          marginTop: "4px",
                          outline: "none",
                          resize: "vertical",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "#0B5133",
                          color: "#FFFFFF",
                          padding: "10px 22px",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}
