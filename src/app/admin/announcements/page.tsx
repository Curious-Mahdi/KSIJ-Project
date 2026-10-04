import { getAnnouncements } from "@/lib/actions/announcements";
import AnnouncementTable from "./_components/AnnouncementTable";

export const metadata = {
  title: "Announcements | Admin | KSIJ Reload",
};

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div>
      <AnnouncementTable initialAnnouncements={announcements as any} />
    </div>
  );
}
