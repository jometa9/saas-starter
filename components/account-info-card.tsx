'use client';

import { User } from '@/lib/db/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ArrowUpRight } from 'lucide-react';
import { getAvatarBgColor, getAvatarTextColor } from '@/lib/utils';

interface AccountInfoCardProps {
  user: User;
  onManageSubscription: () => void;
  onGoToPricing: () => void;
  className?: string;
  title?: string;
}

export function AccountInfoCard({
  user,
  onManageSubscription,
  onGoToPricing,
  className = '',
  title = 'Account Information'
}: AccountInfoCardProps) {
  const getUserDisplayName = (user: User) => {
    return user.name || user.email || 'Unknown User';
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-4 px-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage alt={getUserDisplayName(user)} />
            <AvatarFallback
              className={`${getAvatarBgColor(getUserDisplayName(user))} ${getAvatarTextColor(getAvatarBgColor(getUserDisplayName(user)))}`}
            >
              {getUserDisplayName(user)
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-md">{getUserDisplayName(user)}</p>
            <p className="text-sm text-muted-foreground">
              Current Plan: {user.planName || "Free"}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {user.subscriptionStatus === "active" ? (
            <Button
              className="bg-black hover:bg-gray-800 text-white w-full md:w-auto cursor-pointer"
              onClick={onManageSubscription}
            >
              Manage Subscription
            </Button>
          ) : (
            <Button
              className="bg-black hover:bg-gray-800 text-white w-full md:w-auto cursor-pointer"
              onClick={onGoToPricing}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Subscribe Now
            </Button>
          )}
          {user.planName !== "Professional" &&
            user.subscriptionStatus === "active" && (
              <Button
                variant="outline"
                className="border-black text-black hover:bg-gray-100 w-full md:w-auto cursor-pointer"
                onClick={onGoToPricing}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
} 