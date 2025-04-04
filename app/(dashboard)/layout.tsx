"use client";

import Link from "next/link";
import { use, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  LogOut,
  BookOpen,
  CreditCard,
  Instagram,
  Linkedin,
} from "lucide-react";
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
        <Button asChild variant="ghost" className="text-sm">
          <Link href="/sign-in">Log In</Link>
        </Button>
        <Button
          asChild
          className="bg-black hover:bg-gray-800 text-white text-sm"
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

function Header() {
  return (
    <header>
      <div className="mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center cursor-pointer">
          <span className="text-xl font-semibold text-gray-900">IPTRADE</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="mb-4">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-black">IPTRADE</span>
              </Link>
              <p className="text-sm text-gray-600 mt-3">
                Professional trading solutions for MetaTrader platforms
              </p>
            </div>
            <address className="text-sm text-gray-600 not-italic">
              123 Trading Avenue
              <br />
              New York, NY 10001
              <br />
              United States
            </address>
            <div className="flex space-x-4 mt-6">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-black hover:bg-gray-200 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-black hover:bg-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/risk-disclaimer"
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Risk Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} IPTRADE. All rights reserved.
            Trading involves risk.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
    </section>
  );
}
