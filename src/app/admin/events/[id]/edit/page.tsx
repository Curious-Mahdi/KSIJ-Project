import { notFound } from "next/navigation";
import { getEventById } from "@/lib/actions/events";
import EventForm from "../../_components/EventForm";

export const metadata = {
  title: "Edit Event | Admin | KSIJ Reload",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const event = await getEventById(resolvedParams.id);

  if (!event) {
    notFound();
  }

  return <EventForm initialData={event} isEdit />;
}
