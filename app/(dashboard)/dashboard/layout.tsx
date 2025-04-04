'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, FileText, User, CreditCard } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const path = pathname.split('/').pop();
    
    if (path === 'dashboard' || path === '') {
      setActiveTab('dashboard');
    } else if (path === 'documents') {
      setActiveTab('documents');
    } else if (path === 'profile') {
      setActiveTab('profile');
    } else if (path === 'subscription') {
      setActiveTab('subscription');
    }
  }, [pathname]);

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/${tab === 'dashboard' ? '' : tab}`);
  };

  return (
    <div className="width-full">
      {/* Navegación por pestañas */}
      <div className="border-b">
        <div className="flex overflow-x-auto py-6 no-scrollbar">
          <Button
            variant={activeTab === 'dashboard' ? "default" : "ghost"}
            onClick={() => navigateTo('dashboard')}
            className="mr-2 flex items-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'documents' ? "default" : "ghost"}
            onClick={() => navigateTo('documents')}
            className="mr-2 flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
          <Button
            variant={activeTab === 'profile' ? "default" : "ghost"}
            onClick={() => navigateTo('profile')}
            className="mr-2 flex items-center"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button
            variant={activeTab === 'subscription' ? "default" : "ghost"}
            onClick={() => navigateTo('subscription')}
            className="flex items-center"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Subscription
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
