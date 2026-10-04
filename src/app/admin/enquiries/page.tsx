import { getEnquiries } from "@/lib/actions/enquiries";
import EnquiryTable from "./_components/EnquiryTable";

export const metadata = {
  title: "Enquiries & Help Desk | Admin | KSIJ Reload",
};

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div>
      <EnquiryTable initialEnquiries={enquiries as any} />
    </div>
  );
}
