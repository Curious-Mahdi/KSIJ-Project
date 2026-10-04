import { notFound } from "next/navigation";
import { getAnnouncementById } from "@/lib/actions/announcements";
import AnnouncementForm from "../../_components/AnnouncementForm";

export const metadata = {
  title: "Edit Announcement | Admin | KSIJ Reload",
};

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const announcement = await getAnnouncementById(resolvedParams.id);

  if (!announcement) {
    notFound();
  }

  return <AnnouncementForm initialData={announcement} isEdit />;
}
