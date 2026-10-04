import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BusinessEditForm from "../../_components/BusinessEditForm";

export const metadata = {
  title: "Edit Business | Admin | KSIJ Reload",
};

export default async function AdminEditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const listing = await prisma.directoryListing.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!listing) {
    notFound();
  }

  return <BusinessEditForm listing={listing} />;
}
