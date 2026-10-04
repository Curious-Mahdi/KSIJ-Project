import { getServices } from "@/lib/actions/services";
import ServiceTable from "./_components/ServiceTable";

export const metadata = {
  title: "Services Management | Admin | KSIJ Reload",
};

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div>
      <ServiceTable initialServices={services as any} />
    </div>
  );
}
