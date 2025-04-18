"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col">
      {children}
    </section>
  );
} 