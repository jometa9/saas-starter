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
  Apple,
  Monitor,
  HelpCircle,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getAvatarBgColor, getAvatarTextColor } from "@/lib/utils";
import { customerPortalAction } from "@/lib/payments/actions";
import { useRouter } from "next/navigation";
import { AccountInfoCard } from "@/components/account-info-card";

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

  // Función para acceder al portal de cliente de Stripe
  const handleCustomerPortal = async () => {
    try {
      // Intentar acceder al portal de cliente directamente
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
        // Redirección inmediata sin toasts ni retrasos
        window.location.href = result.redirect;
      } else {
        // Solo en caso de fallar la redirección pero no tener error específico
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error accessing portal:", error);
      // Mostrar mensaje de error más descriptivo
      toast({
        title: "Could not access portal",
        description:
          "An error occurred when attempting to access the management portal. Please try again later.",
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
      {/* Reemplazar la tarjeta de información de cuenta con el nuevo componente */}
      <AccountInfoCard 
        user={user}
        onGoToPricing={goToPricing}
        className="mb-4"
      />
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
                disabled={!user?.stripeSubscriptionId || (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "trialing")}
              />
              <Button
                variant="outline"
                className="rounded-l-none rounded-r-none border-l-0 h-10 flex items-center cursor-pointer"
                onClick={toggleShowLicense}
                disabled={!user?.stripeSubscriptionId || (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "trialing")}
              >
                {showLicense ? "Hide" : "Show"}
              </Button>
              <Button
                variant="outline"
                className="rounded-l-none border-l-0 h-10 flex items-center cursor-pointer"
                onClick={copyMainLicenseToClipboard}
                disabled={!user?.stripeSubscriptionId || !user.apiKey || (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "trialing")}
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
              {user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing" ? (
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
                    {user.subscriptionStatus === "trialing" && (
                      <span className="ml-1 text-blue-500 font-medium">
                        (Trial Period)
                      </span>
                    )}
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
        </CardContent>
      </Card>
      {/* Downloads Card */}
      <Card>
        <CardHeader>
          <CardTitle>Software Downloads</CardTitle>
          <p className="text-sm text-muted-foreground">
            Download IPTRADE v{currentVersion} for your operating system
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0">
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full">
                      <Monitor className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Windows Version</h3>
                      <p className="text-sm text-muted-foreground">
                        v{currentVersion} - 64-bit installer
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="ml-auto cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full">
                      <Apple className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">macOS Version</h3>
                      <p className="text-sm text-muted-foreground">
                        v{currentVersion} - Universal Binary
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="ml-auto cursor-pointer">
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
        <CardHeader className="pb-0">
          <CardTitle>Need Help?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Find answers to your questions or contact support
          </p>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Guide</h3>
                      <p className="text-sm text-muted-foreground">
                        Setup guides and tutorials
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Link href="/guide">View Guide</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-full">
                      <LifeBuoy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Technical Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Get help with any issues
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Link href="mailto:support@iptrade.com">Contact</Link>
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
