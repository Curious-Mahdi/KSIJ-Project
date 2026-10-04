import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";
import styles from "./admin.module.css";

export const metadata = {
  title: "Admin Portal | KSIJ Reload",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Guard: must be authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Guard: must have ADMIN role or isAdmin flag
  const user = session.user as any;
  const isAdmin = user.role === "ADMIN" || user.isAdmin === true;
  if (!isAdmin) {
    redirect("/home");
  }

  return (
    <div className={styles.adminShell}>
      <AdminSidebar />
      <div className={styles.adminMain}>
        <AdminHeader user={session.user} />
        <main className={styles.adminContent}>{children}</main>
      </div>
    </div>
  );
}
