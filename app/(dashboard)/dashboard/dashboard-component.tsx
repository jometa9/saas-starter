"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/db/schema";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { AccountInfoCard } from "@/components/account-info-card";
import Link from "next/link";
import { LicenseCard } from "@/components/licence-card";
import DownloadCard from "@/components/downloads-card";
import SupportCards from "@/components/support-cards";
import { TradingAccountsConfig } from "@/components/trading-accounts-config";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { forgotPassword } from "@/app/(login)/actions";

export function Dashboard({ user }: { user: User }) {
  const router = useRouter();
  const [showLicense, setShowLicense] = useState(true);
  const [isMainLicenseCopied, setIsMainLicenseCopied] = useState(false);
  const isAdmin = user?.role === "admin";
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const goToPricing = () => {
    router.push("/dashboard/pricing");
  };

  const getSubscriptionStatusText = () => {
    if (!user.subscriptionStatus) return "Inactive";

    switch (user.subscriptionStatus) {
      case "active":
        return "Active";
      case "trialing":
        return "Trial";
      case "canceled":
        return "Canceled";
      case "past_due":
        return "Past Due";
      case "unpaid":
        return "Unpaid";
      case "expired":
        return "Expired";
      default:
        return user.subscriptionStatus;
    }
  };

  const getSubscriptionStatusColor = () => {
    if (!user.subscriptionStatus) return "bg-gray-100 text-gray-800";

    switch (user.subscriptionStatus) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trialing":
        return "bg-blue-100 text-blue-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "past_due":
        return "bg-yellow-100 text-yellow-800";
      case "unpaid":
        return "bg-orange-100 text-orange-800";
      case "expired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubscriptionStatusIcon = () => {
    if (!user.subscriptionStatus)
      return <AlertCircle className="h-5 w-5 text-gray-500" />;

    switch (user.subscriptionStatus) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "trialing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "canceled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "past_due":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "unpaid":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "expired":
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const toggleShowLicense = () => {
    setShowLicense(!showLicense);
  };

  const copyMainLicenseToClipboard = () => {
    if (user.apiKey) {
      navigator.clipboard
        .writeText(user.apiKey)
        .then(() => {
          setIsMainLicenseCopied(true);
          setTimeout(() => setIsMainLicenseCopied(false), 2000);
          toast({
            title: "Success",
            description: "License key copied to clipboard!",
          });
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            description: "Could not copy to clipboard",
            variant: "destructive",
          });
        });
    }
  };

  const isManagedServicePlan = (): boolean => {
    return !!(
      (user.planName === "IPTRADE Premium" ||
        user.planName === "IPTRADE Unlimited" ||
        user.planName === "IPTRADE Managed VPS") &&
      (user.subscriptionStatus === "active" ||
        user.subscriptionStatus === "trialing" ||
        user.subscriptionStatus === "admin_assigned")
    );
  };

  const hasTradingAccountsAccess = (): boolean => {
    return !!(
      (user.planName === "IPTRADE Unlimited" ||
        user.planName === "IPTRADE Managed VPS") &&
      (user.subscriptionStatus === "active" ||
        user.subscriptionStatus === "trialing" ||
        user.subscriptionStatus === "admin_assigned")
    );
  };

  const canAccessApiKey = (): boolean => {
    return !!(
      isManagedServicePlan() &&
      user.apiKey &&
      (user.subscriptionStatus === "active" ||
        user.subscriptionStatus === "trialing" ||
        user.subscriptionStatus === "admin_assigned")
    );
  };

  return (
    <section className="flex-1 px-4 gap-4 space-y-4">
      <AccountInfoCard
        user={user}
        onGoToPricing={goToPricing}
        className="mb-4"
        title="User Profile"
        subscriptionButtonText={
          user.subscriptionStatus === "admin_assigned"
            ? "Switch to Paid Plan"
            : "Subscribe Now"
        }
      />

      {hasTradingAccountsAccess() && <TradingAccountsConfig user={user} />}
      <LicenseCard
        user={user}
        showLicense={showLicense}
        isMainLicenseCopied={isMainLicenseCopied}
        getSubscriptionStatusColor={getSubscriptionStatusColor}
        getSubscriptionStatusText={getSubscriptionStatusText}
        getSubscriptionStatusIcon={getSubscriptionStatusIcon}
        toggleShowLicense={toggleShowLicense}
        copyMainLicenseToClipboard={copyMainLicenseToClipboard}
        canAccessApiKey={canAccessApiKey}
        isManagedServicePlan={isManagedServicePlan}
      />
      <DownloadCard compactMode={true} />

      <SupportCards />

      <div className="flex space-x-4">
        <Button
          variant="ghost"
          className="text-gray-400 hover:bg-blue-50 hover:text-blue-600 mb-0 cursor-pointer"
          disabled={isResettingPassword}
          onClick={async () => {
            setIsResettingPassword(true);
            try {
              const formData = new FormData();
              formData.append("email", user.email);
              const result = await forgotPassword(
                { email: user.email },
                formData
              );

              if (result?.success) {
                toast({
                  title: "Reset Password",
                  description:
                    "We sent you a link to reset your password to your email.",
                });
              }
            } catch (error) {
              console.error(error);
              toast({
                title: "Error",
                description:
                  "Failed to send reset password email. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsResettingPassword(false);
            }
          }}
        >
          Reset Password
        </Button>
        <Button
          variant="ghost"
          className="text-gray-400 hover:bg-red-50 hover:text-red-600 mb-0 cursor-pointer"
        >
          Delete Account
        </Button>
      </div>

      {isAdmin && (
        <div className="pt-4 px-0">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <p className="text-sm text-muted-foreground">
                Access administrative tools and reports
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/dashboard/admin"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ShieldCheck className="h-8 w-8 p-1 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Admin Panel</div>
                      <div className="text-sm text-muted-foreground">
                        Manage users and system settings
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
