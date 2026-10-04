import {
  getOrganizations,
  searchBeneficiaries,
  getRegistryStats,
} from "@/lib/actions/registry";
import RegistryClientView from "./RegistryClientView";

export const metadata = {
  title: "Centralized Assistance Registry | Admin Portal | KSIJ Reload",
  description: "Cross-organization beneficiary verification and duplicate assistance prevention registry.",
};

export const dynamic = "force-dynamic";

export default async function AssistanceRegistryPage() {
  const [organizations, beneficiaries, stats] = await Promise.all([
    getOrganizations(),
    searchBeneficiaries(),
    getRegistryStats(),
  ]);

  return (
    <RegistryClientView
      initialOrganizations={organizations}
      initialBeneficiaries={beneficiaries}
      initialStats={stats}
    />
  );
}
