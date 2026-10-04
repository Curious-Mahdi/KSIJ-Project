import { getVerificationOrganizations, getVerificationAuditLogs } from "@/lib/actions/verification";
import VerificationClientView from "./VerificationClientView";

export const metadata = {
  title: "Centralized Assistance Verification | Privacy-Preserving Network | KSIJ Reload",
  description: "Cross-organization privacy-preserving assistance verification with data minimization.",
};

export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  const [organizations, initialAuditLogs] = await Promise.all([
    getVerificationOrganizations(),
    getVerificationAuditLogs(),
  ]);

  return (
    <VerificationClientView
      organizations={organizations}
      initialAuditLogs={initialAuditLogs}
    />
  );
}
