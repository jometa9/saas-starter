import "./globals.css";
import type { Metadata, Viewport } from "next";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/db/queries";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Next.js SaaS Starter",
  description: "Get started quickly with Next.js, Postgres, and Stripe.",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();

  return (
    <html
      lang="en"
      className="min-h-[100dvh] text-black dark:text-white"
    >
      <body className="max-w-[1200px] mx-auto">
        <UserProvider userPromise={userPromise}>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
