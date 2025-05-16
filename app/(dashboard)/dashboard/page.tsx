import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { redirect } from "next/navigation";
import { getAppVersion, getUserById } from "@/lib/db/queries";
import { Dashboard } from "./dashboard-component";
// Indicar que la página no debe ser cacheada
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/sign-in");
  }

  const currentVersion = await getAppVersion();

  // Obtener el usuario completo de la base usando el id del session.user
  const user = await getUserById(session.user.id);
  if (!user) {
    redirect("/sign-in");
  }

  return <Dashboard user={user} currentVersion={currentVersion} />;
}
