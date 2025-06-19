"use client";

import { Terminal } from "@/app/(dashboard)/terminal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    document.title = "IPTRADE - Coming Soon";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/coming-soon/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center overflow-hidden">
      <div className=" z-10 text-center mx-auto px-6">
        <h1 className="text-6xl font-bold text-black mb-8">IPTRADE</h1>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto m-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  className="text-lg py-6 px-6 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border border-blue-600 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-xl cursor-pointer border-2 whitespace-nowrap disabled:opacity-100 disabled:bg-gradient-to-r disabled:from-blue-400 disabled:to-blue-600 disabled:cursor-not-allowed disabled:hover:from-blue-400 disabled:hover:to-blue-600"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-4" />
                    Notify Me
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto m-8">
            <h3 className="text-xl font-semibold mb-2">
              Thanks for subscribing!
            </h3>
            <p>
              We've sent you a confirmation email. We'll keep you posted as we
              roll out new features and updates.
            </p>
          </div>
        )}

        <div className="mt-8 mb-8 text-left">
          <Terminal />
        </div>
      </div>

      <div className="absolute bottom-4 text-center text-gray-400 text-sm mb-4">
        © {new Date().getFullYear()} IPTRADE - Professional Trading Solutions
      </div>
    </div>
  );
}
