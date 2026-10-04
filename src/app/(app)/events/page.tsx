import { getEvents } from "@/lib/actions/events";
import EventsClientView from "./EventsClientView";

export const metadata = {
  title: "Events & Announcements | KSIJ Reload",
  description: "Explore upcoming community events, workshops, programs, and townhall gatherings.",
};

export const revalidate = 0; // Fresh database data on request

export default async function EventsPage() {
  const events = await getEvents();

  return <EventsClientView events={events as any} />;
}
