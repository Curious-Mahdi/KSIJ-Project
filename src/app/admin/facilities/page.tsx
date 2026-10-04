import { getFacilities, getAllBookings } from "@/lib/actions/facilities";
import FacilityTable from "./_components/FacilityTable";

export const metadata = {
  title: "Facilities Management | Admin | KSIJ Reload",
};

export default async function AdminFacilitiesPage() {
  const [facilities, bookings] = await Promise.all([
    getFacilities(),
    getAllBookings(),
  ]);

  return (
    <div>
      <FacilityTable
        initialFacilities={facilities as any}
        allBookings={bookings as any}
      />
    </div>
  );
}
