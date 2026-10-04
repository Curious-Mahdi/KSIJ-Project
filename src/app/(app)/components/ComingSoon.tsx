"use client";

import { Construction } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="container flex-col flex-center" style={{ minHeight: "60vh", textAlign: "center", gap: "var(--space-16)" }}>
      <div className="iconWrapper" style={{ width: "64px", height: "64px", backgroundColor: "var(--color-hover)", color: "var(--color-primary)", borderRadius: "var(--radius-full)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Construction size={32} />
      </div>
      <h1 className="h2">{title}</h1>
      <p className="text-secondary" style={{ maxWidth: "400px" }}>
        We are working hard to bring you this feature. This section will be coming in the next phase of KSIJ One.
      </p>
    </div>
  );
}
