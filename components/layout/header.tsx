"use client";

import React from "react";
import Link from "next/link";
import { use, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { useUser } from "@/lib/auth";
import { signOut } from "@/app/(login)/actions";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";

function UserMenu() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push("/");
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Button
          asChild
          variant="ghost"
          className="text-black hover:bg-black/5 rounded-full px-4 py-0 inline-flex items-center justify-center cursor-pointer"
        >
          <Link href="/sign-in">Log In</Link>
        </Button>
        <Button
          asChild
          className="bg-gradient-to-r from-gray-500 to-black hover:from-gray-600 hover:to-gray-800 text-white border border-gray-900 rounded-full px-4 py-0 inline-flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-xl cursor-pointer border-2"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Tooltip tip="Dashboard">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
        >
          <Home className="h-4 w-4" />
        </Link>
      </Tooltip>

      <Tooltip tip="Sign out">
        <form action={handleSignOut}>
          <button
            type="submit"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </Tooltip>
    </div>
  );
}

export function Header() {
  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard/pricing", label: "Prices" },
    { href: "/guide", label: "Guide" },
    { href: "/faqs", label: "FAQS" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header>
      <div className="mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center cursor-pointer">
          <span className="text-xl font-semibold text-gray-900">IPTRADE</span>
        </Link>

        {/* Navegación central */}
        <div className="hidden md:flex space-x-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
