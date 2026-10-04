"use client";

import { useState } from "react";
import Link from "next/link";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import {
  Download,
  ChevronRight,
  Search,
  FileText,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Heart,
  Home as HomeIcon,
  Users,
  ClipboardList,
  Clock,
  MapPin,
  Sparkles,
  X,
  Phone,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  eligibility?: string | null;
  requiredDocuments?: string | null;
  process?: string | null;
  contactInfo?: string | null;
  faqs?: string | null;
  isActive: boolean;
}

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

const CATEGORY_ICONS: Record<string, any> = {
  Education: { icon: GraduationCap, bg: "#e8f4ee", color: "#0B5133" },
  Employment: { icon: Briefcase, bg: "#e8f4ee", color: "#0B5133" },
  Health: { icon: Heart, bg: "#fde8e8", color: "#dc2626" },
  Housing: { icon: HomeIcon, bg: "#fef3e2", color: "#d97706" },
  Welfare: { icon: Users, bg: "#e8f4ee", color: "#0B5133" },
  Legal: { icon: ClipboardList, bg: "#e8f0fe", color: "#2563eb" },
  General: { icon: ClipboardList, bg: "#e8f0fe", color: "#2563eb" },
  Financial: { icon: GraduationCap, bg: "#fef3e2", color: "#d97706" },
};

export default function ServicesClientView({
  services,
  events,
}: {
  services: ServiceItem[];
  events: EventItem[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories = ["ALL", ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1
                className="font-bold mb-1"
                style={{
                  fontSize: "1.875rem",
                  color: "#122019",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                Community Services &amp; Support
              </h1>
              <p style={{ color: "#68736D", fontSize: "0.9375rem" }}>
                Get information about schemes, eligibility, required documents, procedures and more.
              </p>
            </div>
            <Link
              href="/services/applications"
              className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 text-sm font-semibold rounded-lg text-white shadow-sm hover:opacity-95 transition-opacity"
              style={{ backgroundColor: "#0B5133" }}
            >
              My Applications &rarr;
            </Link>
          </div>

          <div className="relative" style={{ maxWidth: "560px" }}>
            <Search
              className="absolute top-1/2 -translate-y-1/2"
              size={18}
              style={{ left: "14px", color: "#9CA3AF" }}
            />
            <input
              id="services-search"
              type="text"
              placeholder="Search services, schemes, or requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: "9999px",
                  border: "1px solid",
                  borderColor: selectedCategory === cat ? "#0B5133" : "#DDE3DE",
                  backgroundColor: selectedCategory === cat ? "#0B5133" : "#FFFFFF",
                  color: selectedCategory === cat ? "#FFFFFF" : "#4B5563",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {cat === "ALL" ? "All Services" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Services Section */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-bold" style={{ fontSize: "1.25rem", color: "#122019" }}>
                Community Services ({filteredServices.length})
              </h2>
            </div>
            <p className="mb-5" style={{ color: "#68736D", fontSize: "0.8125rem" }}>
              Explore verified community schemes and click any card for guidelines and procedures.
            </p>

            {filteredServices.length === 0 ? (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #DDE3DE",
                  color: "#68736D",
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: "4px" }}>No services found</p>
                <p style={{ fontSize: "0.8125rem" }}>Try adjusting your search query or category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredServices.map((service) => {
                  const meta = CATEGORY_ICONS[service.category] || CATEGORY_ICONS.General;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setActiveModalService(service)}
                      className="bg-white border cursor-pointer flex flex-col justify-between"
                      style={{
                        borderRadius: "12px",
                        borderColor: "#DDE3DE",
                        padding: "20px",
                        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                        e.currentTarget.style.borderColor = "#c5cfc8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "#DDE3DE";
                      }}
                    >
                      <div>
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            backgroundColor: meta.bg,
                            marginBottom: "14px",
                          }}
                        >
                          <Icon size={22} color={meta.color} />
                        </div>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            color: "#68736D",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {service.category}
                        </span>
                        <h3 className="font-bold mb-1 mt-1" style={{ fontSize: "0.9375rem", color: "#122019" }}>
                          {service.title}
                        </h3>
                        <p style={{ fontSize: "0.8125rem", color: "#68736D", lineHeight: 1.5 }}>
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                        <span style={{ fontSize: "0.75rem", color: "#0B5133", fontWeight: 600 }}>
                          View Details &amp; Process
                        </span>
                        <ArrowRight size={14} color="#0B5133" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Documents Panel — right sidebar */}
          <div className="lg:w-[320px] flex-shrink-0">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-bold" style={{ fontSize: "1.25rem", color: "#122019" }}>
                Important Documents
              </h2>
            </div>
            <p className="mb-4" style={{ color: "#68736D", fontSize: "0.8125rem" }}>
              Access guidelines, applications, and policies.
            </p>

            <div
              className="border"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                borderColor: "#DDE3DE",
                padding: "6px",
              }}
            >
              <DocumentItem title="Community Guidelines 2024" size="2.3 MB" iconColor="#dc2626" iconBg="#fde8e8" />
              <DocumentItem title="Education Scheme Application" size="1.8 MB" iconColor="#2563eb" iconBg="#e8f0fe" />
              <DocumentItem title="Medical Assistance Guide" size="1.2 MB" iconColor="#0B5133" iconBg="#e8f4ee" />
              <DocumentItem title="Document Verification Checklist" size="856 KB" iconColor="#d97706" iconBg="#fef3e2" />
              <DocumentItem title="Grievance Redressal Policy" size="1.1 MB" iconColor="#7c3aed" iconBg="#f0e8ff" />
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-bold" style={{ fontSize: "1.25rem", color: "#122019" }}>
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="flex items-center gap-1 font-semibold hover:underline"
              style={{ color: "#0B5133", fontSize: "0.8125rem" }}
            >
              View all events <ArrowRight size={14} />
            </Link>
          </div>
          <p className="mb-5" style={{ color: "#68736D", fontSize: "0.8125rem" }}>
            Stay updated with scheduled sessions, seminars, and programs.
          </p>

          {events.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "#68736D" }}>No upcoming events scheduled right now.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.slice(0, 3).map((event) => {
                const dateObj = new Date(event.date);
                const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
                const day = dateObj.getDate().toString();

                return (
                  <Link
                    key={event.id}
                    href="/events"
                    className="bg-white border flex items-center gap-4 text-inherit no-underline"
                    style={{
                      borderRadius: "12px",
                      borderColor: "#DDE3DE",
                      padding: "16px",
                      transition: "box-shadow 0.2s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    <div
                      className="flex flex-col items-center justify-center flex-shrink-0"
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "10px",
                        backgroundColor: "#e8f4ee",
                      }}
                    >
                      <span className="font-bold" style={{ fontSize: "0.625rem", color: "#0B5133", textTransform: "uppercase" }}>
                        {month}
                      </span>
                      <span className="font-bold" style={{ fontSize: "1.375rem", color: "#0B5133", lineHeight: 1 }}>
                        {day}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate" style={{ fontSize: "0.875rem", color: "#122019", marginBottom: "4px" }}>
                        {event.title}
                      </h4>
                      <p className="flex items-center gap-1" style={{ fontSize: "0.75rem", color: "#68736D" }}>
                        <Clock size={12} /> {event.time}
                      </p>
                      <p className="flex items-center gap-1" style={{ fontSize: "0.75rem", color: "#68736D" }}>
                        <MapPin size={12} /> {event.location}
                      </p>
                    </div>
                    <ChevronRight size={16} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <div
          className="mt-10 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border"
          style={{
            backgroundColor: "#f0f7f2",
            borderColor: "#DDE3DE",
            borderRadius: "12px",
            padding: "20px 24px",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#e8f4ee",
              }}
            >
              <Sparkles size={20} color="#0B5133" />
            </div>
            <div>
              <p className="font-semibold" style={{ color: "#122019", fontSize: "0.9375rem" }}>
                Need help finding the right scheme?
              </p>
              <p style={{ color: "#68736D", fontSize: "0.8125rem" }}>
                Ask our AI assistant for quick, accurate answers from approved community documents.
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 text-white font-semibold whitespace-nowrap"
            style={{
              backgroundColor: "#0B5133",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              const chatBtn = document.querySelector("[aria-label='Open chat']") as HTMLButtonElement;
              if (chatBtn) chatBtn.click();
            }}
          >
            Ask Community Assistant <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Service Details Modal */}
      {activeModalService && (
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
          onClick={() => setActiveModalService(null)}
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
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalService(null)}
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

            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#0B5133",
                backgroundColor: "#e8f4ee",
                padding: "3px 10px",
                borderRadius: "9999px",
              }}
            >
              {activeModalService.category}
            </span>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#122019", marginTop: "10px", marginBottom: "8px" }}>
              {activeModalService.title}
            </h2>

            <p style={{ color: "#4B5563", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "20px" }}>
              {activeModalService.description}
            </p>

            {activeModalService.eligibility && (
              <div style={{ marginBottom: "16px", backgroundColor: "#F9FAFB", padding: "14px", borderRadius: "10px" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#122019", marginBottom: "6px" }}>
                  Eligibility Criteria
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "#4B5563", whiteSpace: "pre-line" }}>
                  {activeModalService.eligibility}
                </p>
              </div>
            )}

            {activeModalService.requiredDocuments && (
              <div style={{ marginBottom: "16px", backgroundColor: "#F9FAFB", padding: "14px", borderRadius: "10px" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#122019", marginBottom: "6px" }}>
                  Required Documents
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "#4B5563", whiteSpace: "pre-line" }}>
                  {activeModalService.requiredDocuments}
                </p>
              </div>
            )}

            {activeModalService.process && (
              <div style={{ marginBottom: "16px", backgroundColor: "#F9FAFB", padding: "14px", borderRadius: "10px" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#122019", marginBottom: "6px" }}>
                  Application Procedure
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "#4B5563", whiteSpace: "pre-line" }}>
                  {activeModalService.process}
                </p>
              </div>
            )}

            {activeModalService.faqs && (
              <div style={{ marginBottom: "16px", backgroundColor: "#F9FAFB", padding: "14px", borderRadius: "10px" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#122019", marginBottom: "6px" }}>
                  Frequently Asked Questions
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "#4B5563", whiteSpace: "pre-line" }}>
                  {activeModalService.faqs}
                </p>
              </div>
            )}

            {activeModalService.contactInfo && (
              <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "14px", marginTop: "16px" }}>
                <p style={{ fontSize: "0.8125rem", color: "#68736D" }}>
                  <strong>Contact Desk:</strong> {activeModalService.contactInfo}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}

function DocumentItem({
  title,
  size,
  iconColor,
  iconBg,
}: {
  title: string;
  size: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      style={{
        padding: "10px 12px",
        borderRadius: "8px",
        transition: "background-color 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8F9F6")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: iconBg,
          }}
        >
          <FileText size={16} color={iconColor} />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold truncate" style={{ fontSize: "0.8125rem", color: "#122019" }}>
            {title}
          </h4>
          <p style={{ fontSize: "0.6875rem", color: "#9CA3AF" }}>PDF · {size}</p>
        </div>
      </div>
      <Download
        size={16}
        className="flex-shrink-0 ml-2"
        style={{ color: "#9CA3AF", transition: "color 0.15s ease" }}
      />
    </div>
  );
}
