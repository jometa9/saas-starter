'use client';

import React, { useState } from 'react';
import { User, TradingAccount } from '@/lib/db/schema';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Monitor,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Info,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminTradingAccountsViewProps {
  user: User;
  initialAccounts: TradingAccount[];
}

export function AdminTradingAccountsView({ user, initialAccounts }: AdminTradingAccountsViewProps) {
  const [accounts] = useState<TradingAccount[]>(initialAccounts);
  const router = useRouter();

  const getPlatformIcon = (platform: string) => {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
        <Monitor className="h-4 w-4 text-blue-700" />
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synchronized':
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
            <span>Synchronized</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
            <span>Pending</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-red-500 mr-1.5" />
            <span>Error</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-gray-500 mr-1.5" />
            <span>Offline</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <Info className="h-4 w-4 text-gray-500 mr-1.5" />
            <span>Unknown</span>
          </div>
        );
    }
  };

  const getAccountTypeLabel = (accountType: string) => {
    switch (accountType) {
      case 'master':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Master</Badge>;
      case 'slave':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Slave</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard/managed-users');
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <div className="mb-4">
        <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Managed Users
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">This user has no trading accounts configured.</p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Accounts</p>
                <p className="font-medium">{accounts.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Master Accounts</p>
                <p className="font-medium">
                  {accounts.filter(acc => acc.accountType === 'master').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Slave Accounts</p>
                <p className="font-medium">
                  {accounts.filter(acc => acc.accountType === 'slave').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Synchronized</p>
                <p className="font-medium text-green-600">
                  {accounts.filter(acc => acc.status === 'synchronized').length}
                </p>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Server</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.accountNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(account.platform)}
                      <span className="capitalize">{account.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getAccountTypeLabel(account.accountType)}</TableCell>
                  <TableCell>{account.server}</TableCell>
                  <TableCell>{getStatusIcon(account.status)}</TableCell>
                  <TableCell>
                    {formatDate(account.createdAt.toString())}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 