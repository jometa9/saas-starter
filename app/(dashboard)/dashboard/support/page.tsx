import { SupportChatbot } from "@/components/support-chatbot";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/db/queries";
import { Zap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SupportPage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="py-8">
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl font-bold" id="prices">
          AI Assistant
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
          Get instant help with our virtual assistant or explore frequently
          asked questions
        </p>
      </div>
      <SupportChatbot />

      <section className="pt-24 py-12">
        <div className="px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Ready to <span className="text-black">revolutionize</span> your
              trading?
            </h2>
            <p className="mt-6 text-xl text-gray-600 ">
              Join thousands of traders who trust IPTRADE for lightning-fast
              trade copying between platforms. Perfect for prop firm traders who
              need to maintain compliance while maximizing efficiency.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a href="/sign-in">
                <Button className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border border-blue-600 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-xl cursor-pointer border-2">
                  Start now
                  <Zap className="ml-3 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
