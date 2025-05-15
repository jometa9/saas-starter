import React from "react";
import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/db/queries";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "@/lib/auth/nextauth-provider";
import { GradientBackground } from "@/components/ui/gradient-background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPTRADE - Professional Trading Solutions",
  description: "Copy trades between MetaTrader platforms seamlessly",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();

  return (
    <html 
      lang="en"
      className="text-black dark:text-white"
    >
      <body className={`${inter.className}`} suppressHydrationWarning={true}>
        <GradientBackground />
        <NextAuthProvider>
          <UserProvider userPromise={userPromise}>
            <div className="flex flex-col relative w-full mx-auto max-w-[1200px]">
              <Header />
              <main className="flex-1 w-full">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </UserProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
