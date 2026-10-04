import { notFound } from "next/navigation";
import { getFacilityById } from "@/lib/actions/facilities";
import FacilityForm from "../../_components/FacilityForm";

export const metadata = {
  title: "Edit Facility | Admin | KSIJ Reload",
};

export default async function EditFacilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const facility = await getFacilityById(resolvedParams.id);

  if (!facility) {
    notFound();
  }

  return <FacilityForm initialData={facility} isEdit />;
}
