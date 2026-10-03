import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect users from the unused root path straight to the login page
  redirect("/login");
}
