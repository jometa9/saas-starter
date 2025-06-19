import "@/app/globals.css";
import { ComingSoon } from "@/components/coming-soon";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/lib/auth";
import { NextAuthProvider } from "@/lib/auth/nextauth-provider";
import { getUser } from "@/lib/db/queries";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPTRADE - Professional Trading Solutions",
  description: "Copy trades between MetaTrader platforms seamlessly",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();

  // Feature flag para Coming Soon
  const isComingSoonMode = process.env.NEXT_PUBLIC_COMING_SOON === "true";

  // Si el feature flag está activado, mostrar solo el coming soon
  if (isComingSoonMode) {
    return (
      <html lang="en" className="text-black dark:text-white">
        <body className={`${inter.className}`} suppressHydrationWarning={true}>
          <GradientBackground />
          <ComingSoon />
        </body>
      </html>
    );
  }

  // Layout normal cuando el feature flag está desactivado
  return (
    <html lang="en" className="text-black dark:text-white">
      <body className={`${inter.className}`} suppressHydrationWarning={true}>
        <GradientBackground />
        <NextAuthProvider>
          <UserProvider userPromise={userPromise}>
            <div className="flex flex-col relative w-full mx-auto max-w-[1200px]">
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </UserProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
