import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardClient from "./dashboard-client";
import AdminDashboard from "./admin-dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <DashboardClient userId={(session?.user as any)?.id} />;
}
