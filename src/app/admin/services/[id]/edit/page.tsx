import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/actions/services";
import ServiceForm from "../../_components/ServiceForm";

export const metadata = {
  title: "Edit Service | Admin | KSIJ Reload",
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const service = await getServiceById(resolvedParams.id);

  if (!service) {
    notFound();
  }

  return <ServiceForm initialData={service} isEdit />;
}
