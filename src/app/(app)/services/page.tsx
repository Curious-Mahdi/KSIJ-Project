"use client";

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
} from "lucide-react";

export default function ServicesPage() {
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
            Community Services &amp; Support
          </h1>
          <p className="mb-6" style={{ color: "#68736D", fontSize: "0.9375rem" }}>
            Get information about schemes, eligibility, required documents, procedures and more.
          </p>

          <div className="relative" style={{ maxWidth: "560px" }}>
            <Search
              className="absolute top-1/2 -translate-y-1/2"
              size={18}
              style={{ left: "14px", color: "#9CA3AF" }}
            />
            <input
              id="services-search"
              type="text"
              placeholder="Search services, schemes, or documents..."
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Services Section — left, takes majority width */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-bold" style={{ fontSize: "1.25rem", color: "#122019" }}>
                Community Services
              </h2>
              <button
                className="flex items-center gap-1 font-semibold hover:underline"
                style={{ color: "#0B5133", fontSize: "0.8125rem" }}
              >
                View all services <ArrowRight size={14} />
              </button>
            </div>
            <p className="mb-5" style={{ color: "#68736D", fontSize: "0.8125rem" }}>
              Explore various schemes and support services available for our community.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <ServiceCard
                title="Education Support Scheme"
                desc="Financial assistance for education and skill development."
                Icon={GraduationCap}
                iconBg="#e8f4ee"
                iconColor="#0B5133"
              />
              <ServiceCard
                title="Employment Scheme"
                desc="Job opportunities and skill training programs."
                Icon={Briefcase}
                iconBg="#e8f4ee"
                iconColor="#0B5133"
              />
              <ServiceCard
                title="Health Support Scheme"
                desc="Healthcare assistance and medical support."
                Icon={Heart}
                iconBg="#fde8e8"
                iconColor="#dc2626"
              />
              <ServiceCard
                title="Housing Assistance"
                desc="Support for housing and accommodation needs."
                Icon={HomeIcon}
                iconBg="#fef3e2"
                iconColor="#d97706"
              />
              <ServiceCard
                title="Community Welfare"
                desc="General welfare programs and assistance."
                Icon={Users}
                iconBg="#e8f4ee"
                iconColor="#0B5133"
              />
              <ServiceCard
                title="Grievance Redressal"
                desc="File and track your grievances and complaints."
                Icon={ClipboardList}
                iconBg="#e8f0fe"
                iconColor="#2563eb"
              />
            </div>
          </div>

          {/* Documents Panel — right sidebar */}
          <div className="lg:w-[320px] flex-shrink-0">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-bold" style={{ fontSize: "1.25rem", color: "#122019" }}>
                Important Documents
              </h2>
              <button
                className="flex items-center gap-1 font-semibold hover:underline"
                style={{ color: "#0B5133", fontSize: "0.8125rem" }}
              >
                View all documents <ArrowRight size={14} />
              </button>
            </div>
            <p className="mb-4" style={{ color: "#68736D", fontSize: "0.8125rem" }}>
              Access guidelines, applications, and important information.
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
              <DocumentItem title="Community Guidelines" size="2.3 MB" iconColor="#dc2626" iconBg="#fde8e8" />
              <DocumentItem title="Education Support Scheme Guidelines" size="1.8 MB" iconColor="#2563eb" iconBg="#e8f0fe" />
              <DocumentItem title="Application Process Guide" size="1.2 MB" iconColor="#0B5133" iconBg="#e8f4ee" />
              <DocumentItem title="Required Documents Checklist" size="856 KB" iconColor="#d97706" iconBg="#fef3e2" />
              <DocumentItem title="Grievance Procedure" size="1.1 MB" iconColor="#7c3aed" iconBg="#f0e8ff" />
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-bold" style={{ fontSize: "1.25rem", color: "#122019" }}>
              Upcoming Events
            </h2>
            <button
              className="flex items-center gap-1 font-semibold hover:underline"
              style={{ color: "#0B5133", fontSize: "0.8125rem" }}
            >
              View all events <ArrowRight size={14} />
            </button>
          </div>
          <p className="mb-5" style={{ color: "#68736D", fontSize: "0.8125rem" }}>
            Stay updated with our latest events and announcements.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EventCard
              month="SEP"
              day="15"
              title="Education Scheme Awareness Session"
              time="10:00 AM - 12:00 PM"
              loc="Community Hall"
            />
            <EventCard
              month="SEP"
              day="22"
              title="Health Camp"
              time="9:00 AM - 4:00 PM"
              loc="City Community Center"
            />
            <EventCard
              month="SEP"
              day="28"
              title="Employment Fair"
              time="11:00 AM - 2:00 PM"
              loc="Main Auditorium"
            />
          </div>
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
                Need help finding the right information?
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
            }}
          >
            Ask Community Assistant <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function ServiceCard({
  title,
  desc,
  Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  desc: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className="bg-white border cursor-pointer"
      style={{
        borderRadius: "12px",
        borderColor: "#DDE3DE",
        padding: "20px",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
        e.currentTarget.style.borderColor = "#c5cfc8";
        const arrow = e.currentTarget.querySelector("[data-arrow]") as HTMLElement;
        if (arrow) arrow.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#DDE3DE";
        const arrow = e.currentTarget.querySelector("[data-arrow]") as HTMLElement;
        if (arrow) arrow.style.opacity = "0";
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          backgroundColor: iconBg,
          marginBottom: "14px",
        }}
      >
        <Icon size={22} color={iconColor} />
      </div>
      <h3 className="font-bold mb-1" style={{ fontSize: "0.9375rem", color: "#122019" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.8125rem", color: "#68736D", lineHeight: 1.5 }}>{desc}</p>
      <div
        data-arrow
        className="flex justify-end mt-3"
        style={{ opacity: 0, transition: "opacity 0.2s ease" }}
      >
        <ArrowRight size={16} color="#68736D" />
      </div>
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
          <h4
            className="font-semibold truncate"
            style={{ fontSize: "0.8125rem", color: "#122019" }}
          >
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

function EventCard({
  month,
  day,
  title,
  time,
  loc,
}: {
  month: string;
  day: string;
  title: string;
  time: string;
  loc: string;
}) {
  return (
    <div
      className="bg-white border flex items-center gap-4 cursor-pointer"
      style={{
        borderRadius: "12px",
        borderColor: "#DDE3DE",
        padding: "16px",
        transition: "box-shadow 0.2s ease",
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
        <h4
          className="font-bold truncate"
          style={{ fontSize: "0.875rem", color: "#122019", marginBottom: "4px" }}
        >
          {title}
        </h4>
        <p className="flex items-center gap-1" style={{ fontSize: "0.75rem", color: "#68736D" }}>
          <Clock size={12} /> {time}
        </p>
        <p className="flex items-center gap-1" style={{ fontSize: "0.75rem", color: "#68736D" }}>
          <MapPin size={12} /> {loc}
        </p>
      </div>
      <ChevronRight size={16} style={{ color: "#9CA3AF", flexShrink: 0 }} />
    </div>
  );
}
