'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

type ManagedUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  plan: string | null;
  status: string | null;
  tradingAccountsCount: number;
};

export function ManagedUsersComponent() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchManagedUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/managed-users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch managed users');
        }
        
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError('Error loading managed users. Please try again later.');
        console.error('Error fetching managed users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagedUsers();
  }, []);

  const handleViewUser = (userId: string) => {
    router.push(`/dashboard/trading-accounts?userId=${userId}`);
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);
    
    if (diffInMinutes < 5) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
    }
  };

  // Get appropriate badge variant for subscription status
  const getStatusVariant = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'admin_assigned':
        return 'secondary';
      case 'trialing':
        return 'warning';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Loading managed users...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (users.length === 0) {
    return <div className="text-center py-8">No managed users found.</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Trading Accounts</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="default">
                  Managed VPS
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(user.status)}>
                  {user.status || 'unknown'}
                </Badge>
              </TableCell>
              <TableCell>{user.tradingAccountsCount}</TableCell>
              <TableCell>
                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => handleViewUser(user.id)}>
                  View Accounts
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 