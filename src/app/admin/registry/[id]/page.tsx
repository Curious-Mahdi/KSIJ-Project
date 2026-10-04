import { notFound } from "next/navigation";
import { getBeneficiaryById, getOrganizations } from "@/lib/actions/registry";
import BeneficiaryDetailView from "./BeneficiaryDetailView";

export const metadata = {
  title: "Beneficiary Assistance History | Centralized Registry | KSIJ Reload",
  description: "Cross-organization assistance audit and duplicate prevention record.",
};

export const dynamic = "force-dynamic";

export default async function BeneficiaryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<{ orgId?: string }> | { orgId?: string };
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const [beneficiary, organizations] = await Promise.all([
    getBeneficiaryById(resolvedParams.id),
    getOrganizations(),
  ]);

  if (!beneficiary) {
    notFound();
  }

  return (
    <BeneficiaryDetailView
      beneficiary={beneficiary}
      organizations={organizations}
      initialOrgId={resolvedSearchParams.orgId}
    />
  );
}
