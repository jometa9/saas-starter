'use client';

import Link from 'next/link';
import { use, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon, Home, LogOut, BookOpen, CreditCard } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <Avatar className="cursor-pointer size-9">
        <AvatarImage alt={user.name || ''} />
        <AvatarFallback>
          {user.email
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-orange-500" />
          <span className="ml-2 text-xl font-semibold text-gray-900">ACME</span>
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
