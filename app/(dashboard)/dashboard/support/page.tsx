import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { SupportChatbot } from "@/components/support-chatbot";

export default async function SupportPage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Support Center</h1>
        <p className="text-muted-foreground mt-2">
          Get instant help with our virtual assistant or explore frequently asked questions
        </p>
      </div>

      <SupportChatbot />
    </div>
  );
} 