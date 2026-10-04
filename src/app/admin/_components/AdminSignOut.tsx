"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      title="Sign out"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "var(--radius-sm)",
        color: "var(--color-text-muted)",
        transition: "all 0.15s ease",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color =
          "var(--color-error)";
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "#fde8e8";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color =
          "var(--color-text-muted)";
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "transparent";
      }}
    >
      <LogOut size={16} />
    </button>
  );
}
