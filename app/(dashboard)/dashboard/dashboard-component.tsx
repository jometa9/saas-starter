"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/db/schema";
import {
  Download,
  BookOpen,
  Link as LinkIcon,
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
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getAvatarBgColor, getAvatarTextColor } from "@/lib/utils";
import { customerPortalAction } from "@/lib/payments/actions";
import { useRouter } from "next/navigation";
import { AccountInfoCard } from "@/components/account-info-card";
import Link from "next/link";

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  updateAppVersionAction,
  sendBroadcastEmailAction,
} from "@/lib/db/actions";

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
  const [isTestEmailPending, setIsTestEmailPending] = useState(false);
  const [isVersionUpdatePending, setIsVersionUpdatePending] = useState(false);
  const [versionUpdateState, setVersionUpdateState] = useState<{
    error?: string;
    success?: string;
    info?: string;
  }>({});
  const [isMassEmailPending, setIsMassEmailPending] = useState(false);
  const [massEmailState, setMassEmailState] = useState<{
    error?: string;
    success?: string;
  }>({});
  const [massEmailForm, setMassEmailForm] = useState({
    subject: "",
    message: "",
    ctaLabel: "",
    ctaUrl: "",
    isImportant: false,
  });

  // Definir isAdmin basado en el rol del usuario
  const isAdmin = user?.role === "admin";

  // Esquema de validación para el formulario de versión
  const versionFormSchema = z.object({
    version: z
      .string()
      .regex(/^\d+\.\d+\.\d+$/, "El formato debe ser X.Y.Z (ej. 1.0.0)"),
    releaseNotes: z
      .string()
      .min(10, "Las notas de versión deben tener al menos 10 caracteres"),
    downloadUrl: z
      .string()
      .url("Debe ser una URL válida")
      .optional()
      .or(z.literal("")),
    isCritical: z.boolean().default(false),
  });

  type VersionFormValues = z.infer<typeof versionFormSchema>;

  const versionForm = useForm<VersionFormValues>({
    resolver: zodResolver(versionFormSchema),
    defaultValues: {
      version: currentVersion,
      releaseNotes: "",
      downloadUrl: "",
      isCritical: false,
    },
  });

  // Manejar el envío del formulario de actualización de versión
  const handleVersionUpdate = async (data: VersionFormValues) => {
    try {
      setIsVersionUpdatePending(true);
      setVersionUpdateState({});

      const formData = new FormData();
      formData.append("version", data.version);
      formData.append("releaseNotes", data.releaseNotes);
      formData.append("downloadUrl", data.downloadUrl || "");
      formData.append("isCritical", data.isCritical ? "true" : "false");

      const result = await updateAppVersionAction(formData, {});
      setVersionUpdateState(result || {});

      if (result.success) {
        versionForm.reset({
          version: data.version,
          releaseNotes: "",
          downloadUrl: "",
          isCritical: false,
        });

        const isDevMode =
          process.env.NODE_ENV === "development" ||
          window.location.hostname === "localhost";

        toast({
          title: "Success",
          description: `${result.success}${isDevMode ? " (In development mode, emails are redirected to test addresses)" : ""}`,
          variant: "default",
        });

        if (isDevMode) {
          setTimeout(() => {
            toast({
              title: "Email Information",
              description:
                "In development mode, emails are not sent to real users. Check the server console for details.",
              variant: "default",
            });
          }, 1000);
        }
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating version:", error);
      setVersionUpdateState({
        error:
          "An error occurred while updating the version. Please try again.",
      });
      toast({
        title: "Error",
        description:
          "An error occurred while updating the version. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVersionUpdatePending(false);
    }
  };

  // Manejar el envío de email de prueba
  const handleSendTestEmail = async () => {
    try {
      setIsTestEmailPending(true);
      const result = await sendBroadcastEmailAction(
        {
          subject: "Test Email",
          message:
            "This is a test email to verify the email system configuration.",
          important: false,
        },
        {}
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Test email sent successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Could not send test email",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error",
        description: "Error sending test email",
        variant: "destructive",
      });
    } finally {
      setIsTestEmailPending(false);
    }
  };

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
          console.error("Error copying to clipboard:", err);
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

  // Handle mass email form submission
  const handleMassEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsMassEmailPending(true);
      setMassEmailState({});

      const formData = new FormData();
      formData.append("subject", massEmailForm.subject);
      formData.append("message", massEmailForm.message);
      formData.append("ctaLabel", massEmailForm.ctaLabel || "");
      formData.append("ctaUrl", massEmailForm.ctaUrl || "");
      formData.append(
        "isImportant",
        massEmailForm.isImportant ? "true" : "false"
      );

      const result = await sendBroadcastEmailAction(formData, {});
      setMassEmailState(result || {});

      if (result.success) {
        // Reset form
        setMassEmailForm({
          subject: "",
          message: "",
          ctaLabel: "",
          ctaUrl: "",
          isImportant: false,
        });

        toast({
          title: "Success",
          description: result.success,
          variant: "default",
        });
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending mass email:", error);
      setMassEmailState({
        error:
          "An error occurred while sending the mass email. Please try again.",
      });
      toast({
        title: "Error",
        description:
          "An error occurred while sending the mass email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMassEmailPending(false);
    }
  };

  return (
    <section className="flex-1 px-4 gap-4 space-y-4">
      <AccountInfoCard
        user={user}
        onGoToPricing={goToPricing}
        className="mb-4"
        title="User Profile"
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
                disabled={
                  !user?.stripeSubscriptionId ||
                  (user.subscriptionStatus !== "active" &&
                    user.subscriptionStatus !== "trialing")
                }
              />
              <Button
                variant="outline"
                className="rounded-l-none rounded-r-none border-l-0 h-10 flex items-center cursor-pointer"
                onClick={toggleShowLicense}
                disabled={
                  !user?.stripeSubscriptionId ||
                  (user.subscriptionStatus !== "active" &&
                    user.subscriptionStatus !== "trialing")
                }
              >
                {showLicense ? "Hide" : "Show"}
              </Button>
              <Button
                variant="outline"
                className="rounded-l-none border-l-0 h-10 flex items-center cursor-pointer"
                onClick={copyMainLicenseToClipboard}
                disabled={
                  !user?.stripeSubscriptionId ||
                  !user.apiKey ||
                  (user.subscriptionStatus !== "active" &&
                    user.subscriptionStatus !== "trialing")
                }
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
              user.subscriptionStatus === "trialing" ? (
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto cursor-pointer"
                  >
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => router.push("/dashboard/guide")}
                  >
                    View Guide
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-full">
                      <LifeBuoy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Technical Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Get help by emailing support@iptrade.com
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="text-red-500 hover:bg-red-50 hover:text-red-600 mb-0"
      >
        Delete Account
      </Button>

      {isAdmin && (
        <div className="pt-4 px-0">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Version Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update application version and notify users
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-md bg-muted">
                  <div className="flex-1">
                    <div className="font-sm">Current Version</div>
                    <div className="text-xl font-bold pt-1">
                      {currentVersion}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendTestEmail}
                    disabled={isTestEmailPending}
                    className="bg-white"
                  >
                    {isTestEmailPending ? (
                      <>
                        <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-3 w-3 mr-1" />
                        Test Email
                      </>
                    )}
                  </Button>
                </div>

                {versionUpdateState.error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {versionUpdateState.error}
                    </AlertDescription>
                  </Alert>
                )}

                {versionUpdateState.success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-green-800" />
                    <AlertTitle>Update Completed</AlertTitle>
                    <AlertDescription>
                      {versionUpdateState.success}
                      <p className="mt-2 font-medium">
                        The application has been updated successfully.
                      </p>
                      <p className="mt-1 text-sm">
                        {process.env.NODE_ENV === "development" ||
                        (typeof window !== "undefined" &&
                          window.location.hostname === "localhost")
                          ? "Note: In development mode, emails are not sent to real users. They are redirected to test addresses or simulated."
                          : "Email notifications have been sent to users."}
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                {versionUpdateState.info && (
                  <Alert variant="default" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      {versionUpdateState.info}
                    </AlertDescription>
                  </Alert>
                )}

                <form
                  onSubmit={versionForm.handleSubmit(handleVersionUpdate)}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="version">New Version</Label>
                    <Input
                      id="version"
                      placeholder="1.0.0"
                      {...versionForm.register("version")}
                      className={
                        versionForm.formState.errors.version
                          ? "border-red-500"
                          : ""
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use semantic versioning: X.Y.Z (example: 1.0.0)
                    </p>
                    {versionForm.formState.errors.version && (
                      <p className="text-xs text-red-500 mt-1">
                        {versionForm.formState.errors.version.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="release-notes">Release Notes</Label>
                    <Textarea
                      id="release-notes"
                      placeholder="Detail the changes included in this version..."
                      className={`min-h-[120px] ${
                        versionForm.formState.errors.releaseNotes
                          ? "border-red-500"
                          : ""
                      }`}
                      {...versionForm.register("releaseNotes")}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This information will be sent to users via email.
                    </p>
                    {versionForm.formState.errors.releaseNotes && (
                      <p className="text-xs text-red-500 mt-1">
                        {versionForm.formState.errors.releaseNotes.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="download-url">
                      Download URL (optional)
                    </Label>
                    <Input
                      id="download-url"
                      placeholder="https://example.com/download"
                      {...versionForm.register("downloadUrl")}
                      className={
                        versionForm.formState.errors.downloadUrl
                          ? "border-red-500"
                          : ""
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL where users can download this version.
                    </p>
                    {versionForm.formState.errors.downloadUrl && (
                      <p className="text-xs text-red-500 mt-1">
                        {versionForm.formState.errors.downloadUrl.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 rounded-md border p-4">
                    <Checkbox
                      id="critical"
                      checked={versionForm.watch("isCritical")}
                      onCheckedChange={(checked) =>
                        versionForm.setValue("isCritical", checked as boolean)
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="critical" className="font-medium">
                        Critical Update
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Check this option if the update contains important
                        security fixes.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isVersionUpdatePending}
                  >
                    {isVersionUpdatePending ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Updating version... Please wait
                      </>
                    ) : (
                      "Update Version and Notify Users"
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-0">
            <CardHeader>
              <CardTitle>Mass Email</CardTitle>
              <p className="text-sm text-muted-foreground">
                Send notifications or announcements to all platform users
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 rounded-md bg-muted">
                  <Mail className="h-6 w-6 mr-3 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">Mass Email Sending</div>
                    <div className="text-sm text-muted-foreground">
                      This tool will send emails to all active platform users.
                    </div>
                  </div>
                </div>

                {massEmailState.error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{massEmailState.error}</AlertDescription>
                  </Alert>
                )}

                {massEmailState.success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200 p-4">
                    <AlertTitle>Email Sent</AlertTitle>
                    <AlertDescription>
                      {massEmailState.success}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleMassEmailSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email-subject">Email Subject</Label>
                    <Input
                      id="email-subject"
                      placeholder="Important announcement for our users"
                      value={massEmailForm.subject}
                      onChange={(e) =>
                        setMassEmailForm({
                          ...massEmailForm,
                          subject: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Clear and descriptive subject for the email.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="email-message">Message Content</Label>
                    <Textarea
                      id="email-message"
                      placeholder="Write the detailed message content here..."
                      className="min-h-[200px]"
                      value={massEmailForm.message}
                      onChange={(e) =>
                        setMassEmailForm({
                          ...massEmailForm,
                          message: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can use line breaks to format the text. HTML is not
                      supported.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="cta-label">Button Text (optional)</Label>
                    <Input
                      id="cta-label"
                      placeholder="More Information"
                      value={massEmailForm.ctaLabel}
                      onChange={(e) =>
                        setMassEmailForm({
                          ...massEmailForm,
                          ctaLabel: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Text for the call-to-action (CTA) button.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="cta-url">Button URL (optional)</Label>
                    <Input
                      id="cta-url"
                      placeholder="https://example.com/info"
                      value={massEmailForm.ctaUrl}
                      onChange={(e) =>
                        setMassEmailForm({
                          ...massEmailForm,
                          ctaUrl: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL where the CTA button will redirect.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 rounded-md border p-4">
                    <Checkbox
                      id="important"
                      checked={massEmailForm.isImportant}
                      onCheckedChange={(checked) =>
                        setMassEmailForm({
                          ...massEmailForm,
                          isImportant: checked as boolean,
                        })
                      }
                    />
                    <div>
                      <Label htmlFor="important" className="font-medium">
                        Mark as Important
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Adds an [IMPORTANT] tag to the subject and visually
                        highlights the message.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isMassEmailPending}
                  >
                    {isMassEmailPending ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Sending emails... Please wait
                      </>
                    ) : (
                      "Send Email to All Users"
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
