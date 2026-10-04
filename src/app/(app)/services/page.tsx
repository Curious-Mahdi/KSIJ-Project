import { getServices } from "@/lib/actions/services";
import { getEvents } from "@/lib/actions/events";
import ServicesClientView from "./ServicesClientView";

export const metadata = {
  title: "Community Services & Support | KSIJ Reload",
  description: "Browse verified schemes, eligibility guidelines, and upcoming community sessions.",
};

export const revalidate = 0; // Fresh database data on request

export default async function ServicesPage() {
  const [services, events] = await Promise.all([
    getServices({ onlyActive: true }),
    getEvents({ upcomingOnly: true }),
  ]);

  return <ServicesClientView services={services as any} events={events as any} />;
}
