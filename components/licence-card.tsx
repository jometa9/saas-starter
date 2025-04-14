import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { User } from "@/lib/db/schema";

interface LicenseCardProps {
  user: User;
  showLicense: boolean;
  isMainLicenseCopied: boolean;
  getSubscriptionStatusColor: () => string;
  getSubscriptionStatusText: () => string;
  getSubscriptionStatusIcon: () => React.ReactNode;
  toggleShowLicense: () => void;
  copyMainLicenseToClipboard: () => void;
  canAccessApiKey: () => boolean;
  isManagedServicePlan: () => boolean;
}

export const LicenseCard: React.FC<LicenseCardProps> = ({
  user,
  showLicense,
  isMainLicenseCopied,
  getSubscriptionStatusColor,
  getSubscriptionStatusText,
  getSubscriptionStatusIcon,
  toggleShowLicense,
  copyMainLicenseToClipboard,
  canAccessApiKey,
  isManagedServicePlan,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>IPTRADE License</CardTitle>
          <p className="text-sm text-muted-foreground">
            Copy trades between MetaTrader platforms with the same IP address
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSubscriptionStatusColor()}`}
          >
            {getSubscriptionStatusText()}
          </div>
          {getSubscriptionStatusIcon()}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col w-full gap-2">
          <Label>Your License Key</Label>
          <div className="flex h-10">
            <Input
              className="rounded-r-none text-xs h-10 bg-muted"
              value={user.apiKey || ""}
              readOnly
              type={showLicense ? "text" : "password"}
              disabled={!canAccessApiKey()}
            />
            <Button
              variant="outline"
              className="rounded-l-none rounded-r-none border-l-0 h-10 flex items-center cursor-pointer"
              onClick={toggleShowLicense}
              disabled={!canAccessApiKey()}
            >
              {showLicense ? "Hide" : "Show"}
            </Button>
            <Button
              variant="outline"
              className="rounded-l-none border-l-0 h-10 flex items-center cursor-pointer"
              onClick={copyMainLicenseToClipboard}
              disabled={!canAccessApiKey()}
              title="Copy to clipboard"
            >
              {isMainLicenseCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {user.subscriptionStatus === "active" ||
            user.subscriptionStatus === "trialing" ||
            user.subscriptionStatus === "admin_assigned" ? (
              <div>
                <p>
                  {isManagedServicePlan()
                    ? user.subscriptionStatus === "trialing"
                      ? "During your trial period, you have full access to your license key and all premium features."
                      : "This license key allows you to activate the IPTRADE software on your computer."
                    : "Upgrade to Managed Service plan to access your license key."}
                </p>
                <p className="mt-1">
                  Current Plan:{" "}
                  <span className="font-semibold">
                    {user.planName || "Basic"}
                  </span>
                  {user.subscriptionStatus === "trialing" && (
                    <span className="ml-1 text-blue-500 font-medium">
                      (Trial Period)
                    </span>
                  )}
                  {user.subscriptionStatus === "admin_assigned" && (
                    <span className="ml-1 text-green-500 font-medium">
                      (Assigned by Admin)
                    </span>
                  )}
                  {user.subscriptionExpiryDate && (
                    <span className="ml-1 text-gray-600">
                      (Valid until:{" "}
                      {new Date(
                        user.subscriptionExpiryDate
                      ).toLocaleDateString()}
                      )
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p>
                <span
                  className={
                    user.subscriptionStatus === "expired"
                      ? "text-purple-500 font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  {user.subscriptionStatus === "expired"
                    ? "Your subscription has expired."
                    : "No active license available."}
                </span>{" "}
                Subscribe to get your license key and access premium features.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
