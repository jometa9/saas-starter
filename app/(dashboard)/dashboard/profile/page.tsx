import { redirect } from "next/navigation";
import { Profile } from "./profile-component";
import { Subscription } from "../subscription/subscription-component";
import { getUser, getAppVersion } from "@/lib/db/queries";

// Indicar que la página no debe ser cacheada
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }
  return <Profile user={user} />;
}
