'use client';

import Link from 'next/link';
import { use, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon, Home, LogOut, BookOpen, CreditCard, Instagram, Linkedin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';

function UserMenu() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push('/');
  }

  if (!user) {
    return (
      <>
        <Link
          href="/docs"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4 flex items-center"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Docs
        </Link>
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4 flex items-center"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pricing
        </Link>
        <Button
          asChild
          className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/docs"
        className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
      >
        <BookOpen className="h-5 w-5" />
        <span className="sr-only">Documentation</span>
      </Link>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
      >
        <Home className="h-5 w-5" />
        <span className="sr-only">Dashboard</span>
      </Link>
      <form action={handleSignOut}>
        <button type="submit" className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Sign out</span>
        </button>
      </form>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-black" />
          <span className="ml-2 text-xl font-semibold text-gray-900">Trade Copier</span>
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
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/" className="flex items-center">
                <CircleIcon className="h-6 w-6 text-black" />
                <span className="ml-2 text-lg font-semibold text-gray-900">Trade Copier</span>
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              123 Trading Avenue<br />
              New York, NY 10001<br />
              United States
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-sm text-gray-600 hover:text-black">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-black">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#download" className="text-sm text-gray-600 hover:text-black">
                  Download
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-black">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/risk-disclaimer" className="text-sm text-gray-600 hover:text-black">
                  Risk Disclaimer
                </Link>
              </li>
            </ul>
            
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-sm text-gray-600 text-center">
            &copy; {new Date().getFullYear()} Trade Copier. All rights reserved. Trading involves risk.
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
