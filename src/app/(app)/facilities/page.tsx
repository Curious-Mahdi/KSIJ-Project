import { getFacilities } from "@/lib/actions/facilities";
import FacilitiesClientView from "./FacilitiesClientView";

export const metadata = {
  title: "Facilities & Halls | KSIJ Reload",
  description: "Browse Jamaat community halls, sports arena, seminar rooms, and submit booking requests.",
};

export const revalidate = 0; // Fresh database data on request

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  return <FacilitiesClientView facilities={facilities as any} />;
}
