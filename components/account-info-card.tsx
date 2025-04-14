"use client";

import { User } from "@/lib/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowUpRight, ExternalLink, Mail } from "lucide-react";
import { getAvatarBgColor, getAvatarTextColor } from "@/lib/utils";
import {
  customerPortalAction,
  directCheckoutAction,
} from "@/lib/payments/actions";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface AccountInfoCardProps {
  user: User;
  onManageSubscription?: () => void;
  onGoToPricing: () => void;
  className?: string;
  title?: string;
}

export function AccountInfoCard({
  user,
  onManageSubscription,
  onGoToPricing,
  className = "",
  title = "Account Information",
}: AccountInfoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);

  const getUserDisplayName = (user: User) => {
    return user.name || user.email || "Unknown User";
  };

  const handleStripePortalRedirect = async () => {
    try {
      setIsPortalLoading(true);

      const result = await customerPortalAction();

      if (result?.redirect) {
        window.location.href = result.redirect;
      } else if (result?.error) {
        setIsPortalLoading(false);
        toast({
          title: "Error",
          description: `Could not access subscription portal: ${result.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsPortalLoading(false);
      console.error("Error accessing Stripe portal:", error);
      toast({
        title: "Error",
        description: "Could not access subscription management portal",
        variant: "destructive",
      });
    }
  };

  const handleDirectSubscription = async () => {
    try {
      setIsLoading(true);

      const result = await directCheckoutAction();

      if (result?.redirect) {
        window.location.href = result.redirect;
      } else if (result?.error) {
        let errorMessage = `Could not create subscription: ${result.error}`;

        if (result.error === "subscription-exists") {
          errorMessage = "You already have an active subscription.";
        } else if (result.error === "no-auth") {
          errorMessage = "You need to be logged in to subscribe.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast({
        title: "Error",
        description: "Could not create subscription. Please try again later.",
        variant: "destructive",
      });

      setIsLoading(false);
    }
  };

  const handleTestEmails = async () => {
    try {
      setIsSendingEmails(true);
      const response = await fetch("/api/admin/test-emails", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test emails");
      }

      toast({
        title: "Success",
        description: "Test emails sent successfully! Check your inbox.",
      });
    } catch (error) {
      console.error("Error sending test emails:", error);
      toast({
        title: "Error",
        description: "Failed to send test emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmails(false);
    }
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
            {user.role === "admin" && (
              <p className="text-sm text-blue-600 font-medium">Admin Account</p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto cursor-pointer">
          {user.role === "admin" && (
            <Button
              variant="outline"
              className="border-blue-600  hover:text-blue-600 text-blue-600 hover:bg-blue-50 w-full md:w-auto cursor-pointer"
              onClick={handleTestEmails}
              disabled={isSendingEmails}
            >
              {isSendingEmails ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></span>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Test Emails
                </>
              )}
            </Button>
          )}
          {user.subscriptionStatus === "active" ||
          user.subscriptionStatus === "trialing" ? (
            <Button
              variant="outline"
              className="border-black text-black hover:bg-gray-100 w-full md:w-auto cursor-pointer"
              onClick={handleStripePortalRedirect}
              disabled={isPortalLoading}
            >
              {isPortalLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                  Processing...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage Subscription
                </>
              )}
            </Button>
          ) : (
            <Button
              className={`${user.subscriptionStatus === "admin_assigned" ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-gray-800"} text-white w-full md:w-auto cursor-pointer`}
              onClick={handleDirectSubscription}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {user.subscriptionStatus === "admin_assigned" ? 
                    "Switch to Paid Plan" : 
                    "Subscribe Now"}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
