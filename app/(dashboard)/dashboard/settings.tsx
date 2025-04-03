'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customerPortalAction } from '@/lib/payments/actions';
import { useActionState } from 'react';
import { User } from '@/lib/db/schema';

type ActionState = {
  error?: string;
  success?: string;
};

export function Settings({ user }: { user: User }) {
  const getUserDisplayName = (user: User) => {
    return user.name || user.email || 'Unknown User';
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Account Settings</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="font-medium">
                  Current Plan: {user.planName || 'Free'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.subscriptionStatus === 'active'
                    ? 'Billed monthly'
                    : user.subscriptionStatus === 'trialing'
                      ? 'Trial period'
                      : 'No active subscription'}
                </p>
              </div>
              <form action={customerPortalAction}>
                <Button type="submit" variant="outline">
                  Manage Subscription
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use this API key to validate your subscription from external applications.
              Add it as a URL parameter: <code className="bg-gray-100 p-1 rounded">?apiKey=your_key</code>
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="font-mono bg-gray-100 p-2 rounded w-full overflow-auto">
                {user.apiKey || 'No API key generated'}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              <strong>Example usage:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                {`${window.location.origin}/api/validate-subscription?apiKey=${user.apiKey || 'your_api_key'}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={`/placeholder.svg?height=32&width=32`}
                alt={getUserDisplayName(user)}
              />
              <AvatarFallback>
                {getUserDisplayName(user)
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {getUserDisplayName(user)}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
