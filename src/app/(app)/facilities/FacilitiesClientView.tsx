"use client";

import { useState } from "react";
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  XCircle,
  X,
  Send,
  Loader2,
  Info,
  Check,
} from "lucide-react";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { submitFacilityBooking } from "@/lib/actions/facilities";

interface FacilityItem {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  amenities: string | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  contactInfo: string | null;
  rules: string | null;
}

export default function FacilitiesClientView({
  facilities,
}: {
  facilities: FacilityItem[];
}) {
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);
  const [bookingFacility, setBookingFacility] = useState<FacilityItem | null>(null);

  const [bookingForm, setBookingForm] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    eventDate: "",
    timeSlot: "Morning (9:00 AM - 1:00 PM)",
    purpose: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingFacility) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await submitFacilityBooking({
        facilityId: bookingFacility.id,
        ...bookingForm,
      });

      setSuccessMessage(
        `Your reservation request for "${bookingFacility.name}" has been received! Our administration desk will contact you to verify details.`
      );
      setBookingForm({
        userName: "",
        userEmail: "",
        userPhone: "",
        eventDate: "",
        timeSlot: "Morning (9:00 AM - 1:00 PM)",
        purpose: "",
        notes: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit booking request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      {/* Hero Section */}
      <div
        className="border-b"
        style={{
          background: "linear-gradient(135deg, #f0f7f2 0%, #f5faf6 50%, #fafaf8 100%)",
          borderColor: "#e8ece9",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1
            className="font-bold mb-2"
            style={{
              fontSize: "1.875rem",
              color: "#122019",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Community Facilities &amp; Venues
          </h1>
          <p style={{ color: "#68736D", fontSize: "0.9375rem" }}>
            Explore Jamaat-managed spaces, auditorium halls, meeting rooms, and sports amenities available for community bookings.
          </p>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => {
            const amenitiesList = fac.amenities
              ? fac.amenities.split(",").map((a) => a.trim())
              : [];

            return (
              <div
                key={fac.id}
                className="bg-white border flex flex-col justify-between"
                style={{
                  borderRadius: "16px",
                  borderColor: "#DDE3DE",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                  e.currentTarget.style.borderColor = "#c5cfc8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
                  e.currentTarget.style.borderColor = "#DDE3DE";
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        backgroundColor: fac.isAvailable ? "#e8f4ee" : "#f3f4f6",
                        color: fac.isAvailable ? "#0B5133" : "#6B7280",
                      }}
                    >
                      {fac.isAvailable ? "Available" : "Maintenance / Reserved"}
                    </span>

                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                      <Users size={14} color="#0B5133" /> {fac.capacity} Guests
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-2" style={{ color: "#122019" }}>
                    {fac.name}
                  </h3>

                  <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin size={13} color="#0B5133" /> {fac.location}
                  </p>

                  <p style={{ fontSize: "0.8125rem", color: "#68736D", lineHeight: 1.5, marginBottom: "16px" }}>
                    {fac.description}
                  </p>

                  {/* Amenities Tags */}
                  {amenitiesList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {amenitiesList.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: "0.6875rem",
                            backgroundColor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            color: "#4B5563",
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                      {amenitiesList.length > 4 && (
                        <span style={{ fontSize: "0.6875rem", color: "#9CA3AF", padding: "2px 4px" }}>
                          +{amenitiesList.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t flex items-center justify-between gap-3" style={{ borderColor: "#F3F4F6" }}>
                  <button
                    onClick={() => setSelectedFacility(fac)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    View Details &amp; Rules
                  </button>

                  <button
                    onClick={() => {
                      setSuccessMessage(null);
                      setErrorMessage(null);
                      setBookingFacility(fac);
                    }}
                    disabled={!fac.isAvailable}
                    style={{
                      backgroundColor: fac.isAvailable ? "#0B5133" : "#D1D5DB",
                      color: "#FFFFFF",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      border: "none",
                      cursor: fac.isAvailable ? "pointer" : "not-allowed",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    Request Booking
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Facility Details Modal */}
      {selectedFacility && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setSelectedFacility(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "28px",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFacility(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#122019", marginBottom: "4px" }}>
              {selectedFacility.name}
            </h2>
            <p className="flex items-center gap-1 text-sm text-gray-500 mb-4">
              <MapPin size={14} color="#0B5133" /> {selectedFacility.location} · {selectedFacility.capacity} Guests
            </p>

            <p style={{ color: "#4B5563", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "20px" }}>
              {selectedFacility.description}
            </p>

            {selectedFacility.amenities && (
              <div style={{ marginBottom: "16px", backgroundColor: "#F9FAFB", padding: "14px", borderRadius: "10px" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#122019", marginBottom: "6px" }}>
                  Available Amenities
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "#4B5563" }}>
                  {selectedFacility.amenities}
                </p>
              </div>
            )}

            {selectedFacility.rules && (
              <div style={{ marginBottom: "16px", backgroundColor: "#F9FAFB", padding: "14px", borderRadius: "10px" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#122019", marginBottom: "6px" }}>
                  Venue Rules &amp; Policies
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "#4B5563", whiteSpace: "pre-line" }}>
                  {selectedFacility.rules}
                </p>
              </div>
            )}

            {selectedFacility.contactInfo && (
              <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "14px", marginTop: "16px" }}>
                <p style={{ fontSize: "0.8125rem", color: "#68736D" }}>
                  <strong>Facility Desk:</strong> {selectedFacility.contactInfo}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {bookingFacility && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setBookingFacility(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "540px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBookingFacility(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#122019", marginBottom: "4px" }}>
              Request Facility Booking
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "#68736D", marginBottom: "16px" }}>
              Reserving: <strong>{bookingFacility.name}</strong>
            </p>

            {successMessage ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#e8f4ee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  <Check size={24} color="#0B5133" />
                </div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#122019", marginBottom: "8px" }}>
                  Request Submitted
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#4B5563", lineHeight: 1.5, marginBottom: "20px" }}>
                  {successMessage}
                </p>
                <button
                  onClick={() => setBookingFacility(null)}
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
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                {errorMessage && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#dc2626",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      marginBottom: "14px",
                      fontSize: "0.8125rem",
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahdi Hassan"
                      value={bookingForm.userName}
                      onChange={(e) => setBookingForm({ ...bookingForm, userName: e.target.value })}
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={bookingForm.userEmail}
                        onChange={(e) => setBookingForm({ ...bookingForm, userEmail: e.target.value })}
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
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98200..."
                        value={bookingForm.userPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, userPhone: e.target.value })}
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                        Requested Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.eventDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
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
                        Time Slot *
                      </label>
                      <select
                        value={bookingForm.timeSlot}
                        onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
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
                        <option value="Morning (9:00 AM - 1:00 PM)">Morning (9:00 AM - 1:00 PM)</option>
                        <option value="Afternoon (1:30 PM - 5:30 PM)">Afternoon (1:30 PM - 5:30 PM)</option>
                        <option value="Evening (6:00 PM - 11:00 PM)">Evening (6:00 PM - 11:00 PM)</option>
                        <option value="Full Day (9:00 AM - 11:00 PM)">Full Day (9:00 AM - 11:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                      Event Purpose / Program Details *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Wedding reception, Majlis, Youth workshop, Family gathering..."
                      value={bookingForm.purpose}
                      onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
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

                  <div>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>
                      Special Equipment / Audio Requirements (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Extra mic, projector screen, stage setup..."
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
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

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                  <button
                    type="button"
                    onClick={() => setBookingFacility(null)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      backgroundColor: "#FFFFFF",
                      color: "#374151",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#0B5133",
                      color: "#FFFFFF",
                      padding: "8px 18px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Chatbot */}
      <ChatWidget />
    </div>
  );
}
