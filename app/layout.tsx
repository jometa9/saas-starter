import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/db/queries";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPTRADE - Professional Trading Solutions",
  description: "Copy trades between MetaTrader platforms seamlessly",
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
      <body className={`${inter.className}`} suppressHydrationWarning={true}>
        <UserProvider userPromise={userPromise}>
          <div className="flex min-h-screen flex-col relative w-full mx-auto max-w-[1200px]">
            <Header />
            <main className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
