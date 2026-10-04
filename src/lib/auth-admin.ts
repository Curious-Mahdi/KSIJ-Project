import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const user = session.user as any;
  const isAdmin = user.role === "ADMIN" || user.isAdmin === true;
  return isAdmin ? session : null;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized: Sign in required");
  }
  const user = session.user as any;
  const isAdmin = user.role === "ADMIN" || user.isAdmin === true;
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
  return session.user;
}
