import { getEvents } from "@/lib/actions/events";
import EventTable from "./_components/EventTable";

export const metadata = {
  title: "Events Management | Admin | KSIJ Reload",
};

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div>
      <EventTable initialEvents={events as any} />
    </div>
  );
}
