"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/db/schema";
import {
  Download,
  BookOpen,
  Link,
  LifeBuoy,
  ArrowUpRight,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Info,
  Copy,
  Check,
  Shield,
  Zap,
  CircleCheckIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getAvatarBgColor, getAvatarTextColor } from "@/lib/utils";
import { customerPortalAction } from "@/lib/payments/actions";
import { useRouter } from "next/navigation";

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

export function Dashboard({
  user,
  currentVersion,
}: {
  user: User;
  currentVersion: string;
}) {
  const getUserDisplayName = (user: User) => {
    return user.name || user.email || "Unknown User";
  };
  const router = useRouter();
  const [showLicense, setShowLicense] = useState(false);
  const [isLicenseVisible, setIsLicenseVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isMainLicenseCopied, setIsMainLicenseCopied] = useState(false);
  const isLatestVersion = true; // Simulating this is the latest version

  // Función para acceder al portal de cliente de Stripe
  const handleCustomerPortal = async () => {
    try {
      // Mostrar mensaje de espera mientras se procesa
      toast({
        title: "Processing...",
        description: "Preparing the management portal...",
      });

      // Intentar acceder al portal de cliente
      const result = await customerPortalAction();

      if (result?.error) {
        // Si hay un error, mostrar el mensaje adecuado
        console.error("Error accessing portal:", result.error);
        let errorMessage = "Could not access the management portal.";

        // Mapear códigos de error a mensajes más descriptivos
        switch (result.error) {
          case "no-customer-id":
            errorMessage =
              "You don't have a customer profile set up. Contact support.";
            break;
          case "no-active-subscription":
            errorMessage =
              "You don't have an active subscription or trial period. You need to subscribe first.";
            break;
          case "no-product-id":
            errorMessage =
              "Your subscription doesn't have an assigned product. Contact support.";
            break;
          case "stripe-api-key":
            errorMessage =
              "Stripe configuration error. Contact the administrator.";
            break;
          case "portal-config":
            errorMessage = "Portal configuration error. Contact support.";
            break;
          case "invalid-customer":
            errorMessage = "Your customer profile is invalid. Contact support.";
            break;
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });

        return;
      }

      if (result?.redirect) {
        // Si se obtiene una URL de redirección, navegar a ella
        window.location.href = result.redirect;
      } else {
        // Si no hay redirección pero tampoco error, usar modo de simulación
        toast({
          title: "Simulation",
          description:
            "Redirecting to simulated mode due to environment limitations.",
        });
        setTimeout(() => {
          window.location.href = "/dashboard?success=portal-simulated";
        }, 1500);
      }
    } catch (error) {
      console.error("Error accessing portal:", error);
      // Mostrar mensaje de error más descriptivo
      toast({
        title: "Could not access portal",
        description:
          "An error occurred when attempting to access the management portal. Your subscription is still active.",
        variant: "destructive",
      });
    }
  };

  // Función para ir a la página de precios para cambiar de plan
  const goToPricing = () => {
    router.push("/pricing");
  };

  // Obtener el estado de la suscripción en formato legible
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
      default:
        return user.subscriptionStatus;
    }
  };

  // Obtener color del estado de la suscripción
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Obtener el icono del estado de la suscripción
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
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const toggleLicenseVisibility = () => {
    setIsLicenseVisible(!isLicenseVisible);
  };

  const toggleShowLicense = () => {
    setShowLicense(!showLicense);
  };

  const copyToClipboard = () => {
    if (user.apiKey) {
      navigator.clipboard
        .writeText(user.apiKey)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          toast({
            title: "Success",
            description: "License key copied to clipboard!",
          });
        })
        .catch((err) => {
          console.error("Error al copiar al portapapeles:", err);
          toast({
            title: "Error",
            description: "Could not copy to clipboard",
            variant: "destructive",
          });
        });
    }
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
          console.error("Error copying to clipboard:", err);
          toast({
            title: "Error",
            description: "Could not copy to clipboard",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <section className="flex-1 px-4 gap-4 space-y-4">
      {/* Bienvenida y resumen */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
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
                onClick={handleCustomerPortal}
              >
                Manage Subscription
              </Button>
            ) : (
              <Button
                className="bg-black hover:bg-gray-800 text-white w-full md:w-auto cursor-pointer"
                onClick={goToPricing}
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
                  onClick={goToPricing}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              )}
          </div>
        </CardContent>
      </Card>
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
                disabled={!user?.stripeSubscriptionId}
              />
              <Button
                variant="outline"
                className="rounded-l-none rounded-r-none border-l-0 h-10 flex items-center cursor-pointer"
                onClick={toggleShowLicense}
                disabled={!user?.stripeSubscriptionId}
              >
                {showLicense ? "Hide" : "Show"}
              </Button>
              <Button
                variant="outline"
                className="rounded-l-none border-l-0 h-10 flex items-center cursor-pointer"
                onClick={copyMainLicenseToClipboard}
                disabled={!user?.stripeSubscriptionId || !user.apiKey}
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
              {user.subscriptionStatus === "active" ? (
                <div>
                  <p>
                    This license key allows you to activate the IPTRADE software
                    on your computer.
                  </p>
                  <p className="mt-1">
                    Current Plan:{" "}
                    <span className="font-semibold">
                      {user.planName || "Basic"}
                    </span>
                  </p>
                </div>
              ) : (
                <p>
                  <span className="text-red-500 font-medium">
                    No active license available.
                  </span>{" "}
                  Subscribe to get your license key and access premium features.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-black" />
                  <CardTitle className="text-base font-medium">
                    Account Limits
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Master Accounts:</span>
                    <span className="font-medium">
                      {user.planName === "Professional"
                        ? "Unlimited"
                        : user.planName === "Trader"
                          ? "3"
                          : "1"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Slave Accounts:</span>
                    <span className="font-medium">
                      {user.planName === "Professional"
                        ? "Unlimited"
                        : user.planName === "Trader"
                          ? "5"
                          : "2"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Cross-platform Support:</span>
                    <span className="font-medium">
                      {user.subscriptionStatus === "active" ? "Yes" : "Limited"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-black" />
                  <CardTitle className="text-base font-medium">
                    Performance
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Latency Mode:</span>
                    <span className="font-medium">
                      {user.planName === "Professional"
                        ? "Ultra-low (<10ms)"
                        : "Standard (<50ms)"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Symbol Mapping:</span>
                    <span className="font-medium">
                      {user.planName === "Basic" ? "Basic" : "Advanced"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Trade Volume Control:</span>
                    <span className="font-medium">
                      {user.planName === "Basic" ? "Limited" : "Full Control"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      {/* Downloads Card */}
      <Card>
        <CardHeader>
          <CardTitle>Software Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download the latest version of our software to use with your license
            key.
          </p>

          <p className="text-sm mb-4">
            Current Version:{" "}
            <span className="font-medium">{currentVersion}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Windows Version</h3>
                    <p className="text-sm text-muted-foreground">
                      v{currentVersion}
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">macOS Version</h3>
                    <p className="text-sm text-muted-foreground">
                      v{currentVersion}
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Linux Version</h3>
                    <p className="text-sm text-muted-foreground">
                      v{currentVersion}
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">User Manual</h3>
                    <p className="text-sm text-muted-foreground">
                      PDF Documentation
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <p className="text-sm text-muted-foreground">
            If you need assistance with your IPTRADE software, our support team
            is ready to help.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-start gap-2">
                  <BookOpen className="h-5 w-5 text-black" />
                  <h4 className="font-medium">Read Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Get detailed instructions on how to configure and use the
                    IPTRADE software.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-black"
                    asChild
                  >
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-start gap-2">
                  <LifeBuoy className="h-5 w-5 text-black" />
                  <h4 className="font-medium">Technical Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for personalized assistance with
                    any issues.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-black"
                    asChild
                  >
                    <Link href="mailto:support@iptrade.com">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
