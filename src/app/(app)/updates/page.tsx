import { getAnnouncements } from "@/lib/actions/announcements";
import UpdatesClientView from "./UpdatesClientView";

export const metadata = {
  title: "Community Updates & Announcements | KSIJ Reload",
  description: "Stay informed with official announcements, notifications, and updates from Jamaat departments.",
};

export const revalidate = 0;

export default async function UpdatesPage() {
  const announcements = await getAnnouncements({ onlyPublished: true });

  return <UpdatesClientView announcements={announcements} />;
}
