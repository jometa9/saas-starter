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
    // Extraer la última parte de la ruta para determinar la pestaña activa
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

  // Función para navegar y establecer la pestaña activa
  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/${tab === 'dashboard' ? '' : tab}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      {/* Navegación por pestañas */}
      <div className="border-b px-4 lg:px-6">
        <div className="flex overflow-x-auto py-4 no-scrollbar">
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

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
