import { getAdminDirectoryListings } from "@/lib/actions/admin-directory";
import BusinessTable from "./_components/BusinessTable";

export const metadata = {
  title: "Business Directory | Admin | KSIJ Reload",
};

export default async function AdminBusinessesPage() {
  const listings = await getAdminDirectoryListings();

  return (
    <div>
      <BusinessTable initialListings={listings as any} />
    </div>
  );
}
