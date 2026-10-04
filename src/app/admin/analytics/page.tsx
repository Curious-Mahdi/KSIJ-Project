import { getAnalyticsData } from "@/lib/actions/analytics";
import AnalyticsClientView from "./AnalyticsClientView";

export const metadata = {
  title: "Analytics & Community Impact | Admin Portal | KSIJ Reload",
  description: "Comprehensive impact, scholarship, healthcare, and welfare assistance analytics for Jamaat administrators.",
};

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();

  return <AnalyticsClientView initialData={data} />;
}
