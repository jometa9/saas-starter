import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/db/queries";
import PricingComponent from "./pricing-component";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Obtener el usuario completo de la base usando el id del session.user
  const user = await getUserById(session.user.id);
  if (!user) {
    redirect("/sign-in");
  }

  return <PricingComponent user={user} />;
}
