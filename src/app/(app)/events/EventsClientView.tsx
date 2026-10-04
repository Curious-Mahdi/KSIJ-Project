"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Search,
  ExternalLink,
  Star,
  ArrowRight,
  Filter,
} from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  time: string;
  location: string;
  imageUrl?: string | null;
  registrationUrl?: string | null;
  isImportant: boolean;
  status: string;
}

export default function EventsClientView({ events }: { events: EventItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL"); // ALL, UPCOMING, COMPLETED

  const filtered = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedFilter === "ALL" ||
      (selectedFilter === "UPCOMING" && ev.status === "UPCOMING") ||
      (selectedFilter === "COMPLETED" && (ev.status === "COMPLETED" || new Date(ev.date) < new Date()));

    return matchesSearch && matchesStatus;
  });

  const featuredEvents = filtered.filter((e) => e.isImportant && e.status === "UPCOMING");
  const regularEvents = filtered.filter((e) => !(e.isImportant && e.status === "UPCOMING"));

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
            Community Events &amp; Programs
          </h1>
          <p className="mb-6" style={{ color: "#68736D", fontSize: "0.9375rem" }}>
            Stay informed with upcoming workshops, health camps, townhalls, and community gatherings.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between" style={{ maxWidth: "680px" }}>
            <div className="relative w-full">
              <Search
                className="absolute top-1/2 -translate-y-1/2"
                size={18}
                style={{ left: "14px", color: "#9CA3AF" }}
              />
              <input
                type="text"
                placeholder="Search events by title, venue or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border focus:ring-2 focus:ring-[#0B5133]/30 outline-none"
                style={{
                  paddingLeft: "42px",
                  paddingRight: "16px",
                  paddingTop: "11px",
                  paddingBottom: "11px",
                  borderRadius: "10px",
                  borderColor: "#DDE3DE",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.875rem",
                  color: "#122019",
                }}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {["ALL", "UPCOMING", "COMPLETED"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    padding: "9px 16px",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: selectedFilter === filter ? "#0B5133" : "#DDE3DE",
                    backgroundColor: selectedFilter === filter ? "#0B5133" : "#FFFFFF",
                    color: selectedFilter === filter ? "#FFFFFF" : "#4B5563",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {filter === "ALL" ? "All Events" : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Events Container */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Star size={18} color="#D97706" fill="#D97706" />
              <h2 className="font-bold" style={{ fontSize: "1.25rem", color: "#122019" }}>
                Featured Programs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredEvents.map((event) => {
                const dateObj = new Date(event.date);
                const isValidDate = !isNaN(dateObj.getTime());
                const month = isValidDate ? dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "DATE";
                const day = isValidDate ? dateObj.getDate().toString() : "TBA";

                return (
                  <div
                    key={event.id}
                    className="border bg-white"
                    style={{
                      borderRadius: "16px",
                      borderColor: "#0B5133",
                      boxShadow: "0 4px 20px rgba(11, 81, 51, 0.08)",
                      padding: "24px",
                      position: "relative",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex flex-col items-center justify-center flex-shrink-0"
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "12px",
                          backgroundColor: "#e8f4ee",
                        }}
                      >
                        <span className="font-bold text-xs" style={{ color: "#0B5133" }}>
                          {month}
                        </span>
                        <span className="font-bold text-2xl" style={{ color: "#0B5133", lineHeight: 1 }}>
                          {day}
                        </span>
                      </div>

                      {event.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "12px",
                            objectFit: "cover",
                            border: "1px solid #DDE3DE",
                            backgroundColor: "#f3f4f6",
                            flexShrink: 0,
                          }}
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "#D97706",
                            backgroundColor: "#FEF3C7",
                            padding: "2px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          Featured
                        </span>
                        <h3 className="font-bold mt-1 mb-2 text-lg" style={{ color: "#122019" }}>
                          {event.title}
                        </h3>
                        <p style={{ fontSize: "0.875rem", color: "#4B5563", lineHeight: 1.5, marginBottom: "14px" }}>
                          {event.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock size={14} color="#0B5133" /> {event.time}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin size={14} color="#0B5133" /> {event.location}
                          </span>
                        </div>

                        {event.registrationUrl && (
                          <a
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-semibold text-sm"
                            style={{
                              backgroundColor: "#0B5133",
                              color: "#FFFFFF",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              textDecoration: "none",
                            }}
                          >
                            Register / RSVP Now <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Events List */}
        <div>
          <h2 className="font-bold mb-4" style={{ fontSize: "1.25rem", color: "#122019" }}>
            All Scheduled Events ({filtered.length})
          </h2>

          {filtered.length === 0 ? (
            <div
              style={{
                padding: "60px 24px",
                textAlign: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #DDE3DE",
                color: "#68736D",
              }}
            >
              <CalendarIcon size={36} color="#9CA3AF" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "4px" }}>
                No events found
              </p>
              <p style={{ fontSize: "0.875rem" }}>
                There are no scheduled events matching your criteria at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularEvents.map((event) => {
                const dateObj = new Date(event.date);
                const isValidDate = !isNaN(dateObj.getTime());
                const month = isValidDate ? dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "DATE";
                const day = isValidDate ? dateObj.getDate().toString() : "TBA";

                return (
                  <div
                    key={event.id}
                    className="bg-white border flex flex-col justify-between"
                    style={{
                      borderRadius: "14px",
                      borderColor: "#DDE3DE",
                      padding: "20px",
                      transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.06)";
                      e.currentTarget.style.borderColor = "#c5cfc8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#DDE3DE";
                    }}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex flex-col items-center justify-center flex-shrink-0"
                            style={{
                              width: "52px",
                              height: "52px",
                              borderRadius: "10px",
                              backgroundColor: "#e8f4ee",
                            }}
                          >
                            <span className="font-bold text-xs" style={{ color: "#0B5133" }}>
                              {month}
                            </span>
                            <span className="font-bold text-xl" style={{ color: "#0B5133", lineHeight: 1 }}>
                              {day}
                            </span>
                          </div>

                          {event.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                              style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "10px",
                                objectFit: "cover",
                                border: "1px solid #DDE3DE",
                                backgroundColor: "#f3f4f6",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </div>

                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: "9999px",
                            backgroundColor:
                              event.status === "UPCOMING"
                                ? "#e8f4ee"
                                : event.status === "ONGOING"
                                ? "#fef3c7"
                                : "#f3f4f6",
                            color:
                              event.status === "UPCOMING"
                                ? "#0B5133"
                                : event.status === "ONGOING"
                                ? "#b45309"
                                : "#4b5563",
                          }}
                        >
                          {event.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-base mb-2" style={{ color: "#122019" }}>
                        {event.title}
                      </h3>
                      <p style={{ fontSize: "0.8125rem", color: "#68736D", lineHeight: 1.5, marginBottom: "16px" }}>
                        {event.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-col gap-1 text-xs text-gray-500 pt-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                        <span className="flex items-center gap-2">
                          <Clock size={13} color="#68736D" /> {event.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin size={13} color="#68736D" /> {event.location}
                        </span>
                      </div>

                      {event.registrationUrl && (
                        <div className="mt-3">
                          <a
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#0B5133",
                              textDecoration: "none",
                            }}
                          >
                            RSVP Online <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
