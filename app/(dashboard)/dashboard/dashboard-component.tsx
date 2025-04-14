"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { LicenseCard } from "@/components/licence-card";

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
  const [isSending, setIsSending] = useState(false);
  const [isAssigningSubscription, setIsAssigningSubscription] = useState(false);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("");
  const [duration, setDuration] = useState("1");
  const [forceAssign, setForceAssign] = useState(false);
  const [subscriptionWarning, setSubscriptionWarning] = useState<{
    message: string;
    existingSubscription: {
      planName: string;
      status: string;
      isPaid: boolean;
    };
  } | null>(null);

  const handleTestEmails = async () => {
    try {
      setIsSending(true);
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
      setIsSending(false);
    }
  };

  const handleAssignFreeSubscription = async () => {
    try {
      setIsAssigningSubscription(true);
      setSubscriptionWarning(null);

      if (!email || !plan || !duration) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/admin/assign-free-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          plan,
          duration: parseInt(duration, 10),
          force: forceAssign,
        }),
      });

      const data = await response.json();

      if (response.status === 409 && data.warning) {
        // Usuario tiene una suscripción activa, mostrar advertencia
        setSubscriptionWarning({
          message: data.message,
          existingSubscription: data.existingSubscription,
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign free subscription");
      }

      // Si había una advertencia previa, limpiarla
      setSubscriptionWarning(null);

      toast({
        title: "Success",
        description: data.message || "Free subscription assigned successfully!",
      });

      // Resetear el formulario solo en caso de éxito
      setEmail("");
      setPlan("");
      setDuration("1");
      setForceAssign(false);
    } catch (error) {
      console.error("Error assigning free subscription:", error);
      toast({
        title: "Error",
        description: "Failed to assign free subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigningSubscription(false);
    }
  };

  const isAdmin = user?.role === "admin";

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

  const handleSendTestEmail = async () => {
    try {
      setIsTestEmailPending(true);
      const formData = new FormData();
      formData.append("subject", "Test Email");
      formData.append(
        "message",
        "This is a test email to verify the email system configuration."
      );
      formData.append("important", "false");

      const result = await sendBroadcastEmailAction(formData, {});

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

  const handleCustomerPortal = async () => {
    try {
      const result = await customerPortalAction();

      if (result?.error) {
        console.error("Error accessing portal:", result.error);
        let errorMessage = "Could not access the management portal.";

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
        window.location.href = result.redirect;
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error accessing portal:", error);
      toast({
        title: "Could not access portal",
        description:
          "An error occurred when attempting to access the management portal. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const goToPricing = () => {
    router.push("/pricing");
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

  const isManagedServicePlan = (): boolean => {
    // Verificar si el usuario tiene un plan que le da acceso a la API key
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
    // Solo usuarios con planes avanzados pueden acceder a la configuración de cuentas de trading
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
        subscriptionButtonText={user.subscriptionStatus === "admin_assigned" ? "Switch to Paid Plan" : "Subscribe Now"}
      />
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
      {hasTradingAccountsAccess() && <ManagedServiceForm user={user} />}

      <Card>
        <CardHeader>
          <CardTitle>Software Downloads</CardTitle>
          <p className="text-sm text-muted-foreground">
            Download IPTRADE v{currentVersion} for your operating system
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0">
            <Card className="border border-gray-200 hover:shadow-md transition-shadow w-full">
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

            <Card className="border border-gray-200 hover:shadow-md transition-shadow w-full">
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

          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>
                Check and update expired free subscriptions and validate Stripe
                subscriptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={async () => {
                    try {
                      setIsSending(true);
                      const response = await fetch("/api/subscription-check", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({}),
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(
                          data.error || "Failed to check subscriptions"
                        );
                      }

                      // Mostrar resultados detallados
                      const { results } = data;
                      const summaryMessage = [
                        `✅ ${results.freeExpired} free subscriptions expired`,
                        `🔄 ${results.stripeUpdated} Stripe subscriptions updated`,
                        `❌ ${results.stripeCanceled} Stripe subscriptions canceled`,
                        `⚠️ ${results.inconsistencies} subscriptions with inconsistencies`,
                        `📧 ${results.notifications} notifications sent`,
                      ].join("\n");

                      toast({
                        title: "Success",
                        description: `Subscription check completed successfully!\n${summaryMessage}`,
                      });
                    } catch (error) {
                      console.error("Error checking subscriptions:", error);
                      toast({
                        title: "Error",
                        description:
                          "Failed to check subscriptions. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsSending(false);
                    }
                  }}
                  disabled={isSending}
                  className="w-full sm:w-auto"
                >
                  {isSending ? "Processing..." : "Check All Subscriptions"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  This will find and update expired free subscriptions, verify
                  Stripe subscription statuses, and detect inconsistencies in
                  the database.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Promotional Free Subscriptions</CardTitle>
              <CardDescription>
                Assign free subscriptions to users for promotional purposes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionWarning && (
                  <Alert
                    variant="warning"
                    className="bg-amber-50 border-amber-200"
                  >
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      <p>{subscriptionWarning.message}</p>
                      <p className="mt-2">
                        Current subscription:{" "}
                        {subscriptionWarning.existingSubscription.planName} (
                        {subscriptionWarning.existingSubscription.status})
                        {subscriptionWarning.existingSubscription.isPaid && (
                          <span className="font-semibold text-amber-700">
                            {" "}
                            (paid subscription)
                          </span>
                        )}
                      </p>
                      <div className="mt-4 flex items-center space-x-2">
                        <Checkbox
                          id="force-assign"
                          checked={forceAssign}
                          onCheckedChange={(checked) =>
                            setForceAssign(!!checked)
                          }
                        />
                        <label
                          htmlFor="force-assign"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Force assignment (overrides existing subscription)
                        </label>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">User Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Al cambiar el email, resetear la advertencia
                      setSubscriptionWarning(null);
                      setForceAssign(false);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan">Subscription Plan</Label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IPTRADE Premium">IPTRADE Premium</SelectItem>
                      <SelectItem value="IPTRADE Unlimited">IPTRADE Unlimited</SelectItem>
                      <SelectItem value="IPTRADE Managed VPS">IPTRADE Managed VPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 month</SelectItem>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAssignFreeSubscription}
                  disabled={
                    isAssigningSubscription ||
                    !email ||
                    !plan ||
                    !duration ||
                    (subscriptionWarning && !forceAssign)
                  }
                  className="w-full sm:w-auto mt-2"
                >
                  {isAssigningSubscription
                    ? "Assigning..."
                    : subscriptionWarning
                      ? "Override Existing Subscription"
                      : "Assign Free Subscription"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}

function ManagedServiceForm({ user }: { user: User }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [accounts, setAccounts] = useState([
    {
      id: "1",
      accountNumber: "12345678",
      platform: "mt4",
      server: "ICMarkets-Live1",
      password: "••••••••",
      copyingTo: ["MT5 Demo Account", "FXCM Live"],
      accountType: "master",
      status: "synchronized",
    },
    {
      id: "2",
      accountNumber: "87654321",
      platform: "mt5",
      server: "FXCM-Real",
      password: "••••••••",
      copyingTo: [],
      accountType: "slave",
      lotCoefficient: 1.5,
      forceLot: 0,
      reverseTrade: false,
      status: "pending",
    },
  ]);

  const [formState, setFormState] = useState({
    serverIp: "",
    accountNumber: "",
    password: "",
    additionalInfo: "",
    platform: "mt4",
    accountType: "master",
    lotCoefficient: 1.0,
    forceLot: 0,
    reverseTrade: false,
    status: "pending",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setFormState({
      serverIp: "",
      accountNumber: "",
      password: "",
      additionalInfo: "",
      platform: "mt4",
      accountType: "master",
      lotCoefficient: 1.0,
      forceLot: 0,
      reverseTrade: false,
      status: "pending",
    });
    setIsAddingAccount(true);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setFormState({
      serverIp: account.server,
      accountNumber: account.accountNumber,
      password: "",
      additionalInfo: "",
      platform: account.platform,
      accountType: account.accountType || "master",
      lotCoefficient: account.lotCoefficient || 1.0,
      forceLot: account.forceLot || 0,
      reverseTrade: account.reverseTrade || false,
      status: account.status || "pending",
    });
    setIsAddingAccount(true);
  };

  const handleDeleteAccount = (id: string) => {
    setAccountToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteAccount = () => {
    if (accountToDelete) {
      // En una aplicación real, aquí haríamos una llamada a la API para eliminar la cuenta
      setAccounts(accounts.filter((account) => account.id !== accountToDelete));

      toast({
        title: "Account Removed",
        description:
          "The trading account has been successfully removed from your configuration.",
      });

      setShowDeleteConfirmModal(false);
      setAccountToDelete(null);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirmModal(false);
    setAccountToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingAccount) {
        // Actualizar cuenta existente
        setAccounts(
          accounts.map((acc) =>
            acc.id === editingAccount.id
              ? {
                  ...acc,
                  server: formState.serverIp,
                  accountNumber: formState.accountNumber,
                  platform: formState.platform,
                  password: formState.password ? "••••••••" : acc.password,
                  accountType: formState.accountType,
                  status: formState.status,
                  lotCoefficient:
                    formState.accountType === "slave"
                      ? formState.lotCoefficient
                      : undefined,
                  forceLot:
                    formState.accountType === "slave"
                      ? formState.forceLot
                      : undefined,
                  reverseTrade:
                    formState.accountType === "slave"
                      ? formState.reverseTrade
                      : undefined,
                }
              : acc
          )
        );

        toast({
          title: "Account Updated",
          description: "Your trading account has been updated successfully.",
        });
      } else {
        // Agregar nueva cuenta
        setAccounts([
          ...accounts,
          {
            id: Date.now().toString(),
            accountNumber: formState.accountNumber,
            platform: formState.platform,
            server: formState.serverIp,
            password: "••••••••",
            copyingTo: [],
            accountType: formState.accountType,
            status: formState.status,
            ...(formState.accountType === "slave" && {
              lotCoefficient: formState.lotCoefficient,
              forceLot: formState.forceLot,
              reverseTrade: formState.reverseTrade,
            }),
          },
        ]);

        toast({
          title: "Account Added",
          description:
            "Your trading account has been added successfully. You can now configure copy trading for this account.",
        });
      }

      setIsAddingAccount(false);
      setEditingAccount(null);
      setFormState({
        serverIp: "",
        accountNumber: "",
        password: "",
        additionalInfo: "",
        platform: "mt4",
        accountType: "master",
        lotCoefficient: 1.0,
        forceLot: 0,
        reverseTrade: false,
        status: "pending",
      });
    } catch (error) {
      console.error("Error submitting trading account:", error);
      toast({
        title: "Error",
        description:
          "We couldn't process your information. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAddingAccount(false);
    setEditingAccount(null);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "mt4":
        return (
          <div className="bg-blue-100 p-1 rounded-md text-blue-800 text-xs font-medium">
            MT4
          </div>
        );
      case "mt5":
        return (
          <div className="bg-green-100 p-1 rounded-md text-green-800 text-xs font-medium">
            MT5
          </div>
        );
      default:
        return null;
    }
  };

  const getAccountTypeIcon = (accountType: string) => {
    switch (accountType) {
      case "master":
        return (
          <div className="bg-indigo-100 p-1 rounded-md text-indigo-800 text-xs font-medium">
            Master
          </div>
        );
      case "slave":
        return (
          <div className="bg-orange-100 p-1 rounded-md text-orange-800 text-xs font-medium">
            Slave
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synchronized":
        return (
          <div className="bg-green-100 p-1 rounded-md text-green-800 text-xs font-medium">
            Synchronized
          </div>
        );
      case "pending":
        return (
          <div className="bg-yellow-100 p-1 rounded-md text-yellow-800 text-xs font-medium">
            Pending
          </div>
        );
      default:
        return null;
    }
  };

  const getServerStatus = () => {
    const allSynchronized = accounts.every(
      (account) => account.status === "synchronized"
    );
    return allSynchronized ? "synchronized" : "pending";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trading Accounts Configuration</CardTitle>
            <CardDescription>
              Manage your trading accounts and copy trading configuration (up to
              50 accounts)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Server Status:</div>
            {getStatusIcon(getServerStatus())}
          </div>
          {!isAddingAccount && (
            <Button
              onClick={handleAddAccount}
              className="ml-auto"
              disabled={accounts.length >= 50}
            >
              Add Trading Account
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAddingAccount && (
          <div className="bg-muted/10 rounded-lg border p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingAccount
                  ? "Edit Trading Account"
                  : "Add Trading Account"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serverIp">Server Address</Label>
                  <Input
                    id="serverIp"
                    name="serverIp"
                    placeholder="e.g. demo.icmarkets.com"
                    value={formState.serverIp}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="Your trading account number"
                    value={formState.accountNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {editingAccount
                      ? "New Password (leave empty to keep current)"
                      : "Account Password"}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={
                      editingAccount
                        ? "New password (optional)"
                        : "Your trading account password"
                    }
                    value={formState.password}
                    onChange={handleChange}
                    required={!editingAccount}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formState.platform}
                    onValueChange={(value: string) =>
                      handleSelectChange("platform", value)
                    }
                  >
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mt4">MetaTrader 4</SelectItem>
                      <SelectItem value="mt5">MetaTrader 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select
                    value={formState.accountType}
                    onValueChange={(value: string) =>
                      handleSelectChange("accountType", value)
                    }
                  >
                    <SelectTrigger id="accountType">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="master">Master (Source)</SelectItem>
                      <SelectItem value="slave">Slave (Copy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formState.accountType === "slave" && (
                <div className="mt-4 bg-muted/20 p-4 rounded-md border">
                  <h4 className="text-sm font-medium mb-3">
                    Slave Account Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lotCoefficient">Lot Coefficient</Label>
                      <Input
                        id="lotCoefficient"
                        name="lotCoefficient"
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="1.0"
                        value={formState.lotCoefficient}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            lotCoefficient: parseFloat(e.target.value),
                          }))
                        }
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Multiplier for the lot size
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="forceLot">
                        Force Lot Size (optional)
                      </Label>
                      <Input
                        id="forceLot"
                        name="forceLot"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        value={formState.forceLot}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            forceLot: parseFloat(e.target.value),
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        0 = disabled
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="reverseTrade"
                      checked={formState.reverseTrade}
                      onCheckedChange={(checked: boolean) =>
                        setFormState((prev) => ({
                          ...prev,
                          reverseTrade: checked,
                        }))
                      }
                    />
                    <Label
                      htmlFor="reverseTrade"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Reverse Trades (buy becomes sell, sell becomes buy)
                    </Label>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingAccount
                      ? "Update Account"
                      : "Add Account"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <CircleCheckIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-2">
              No Trading Accounts Configured
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your first trading account to start configuring copy trading
            </p>
            <Button onClick={handleAddAccount}>Add Trading Account</Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Server
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Settings
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-muted/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`h-3 w-3 rounded-full animate-pulse mr-2 ${
                              account.status === "synchronized"
                                ? "bg-green-500"
                                : account.status === "pending"
                                  ? "bg-yellow-500"
                                  : account.status === "error"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {account.status === "synchronized"
                              ? "Synced"
                              : account.status === "pending"
                                ? "Pending"
                                : account.status === "error"
                                  ? "Error"
                                  : account.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {account.accountNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getAccountTypeIcon(account.accountType)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getPlatformIcon(account.platform)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {account.server}
                      </td>
                      <td className="px-4 py-4">
                        {account.accountType === "slave" ? (
                          <div className="flex flex-col gap-1 text-xs">
                            <span className="text-gray-700">
                              <span className="font-medium">Lot Coef:</span>{" "}
                              {account.lotCoefficient}
                            </span>
                            <span className="text-gray-700">
                              <span className="font-medium">Force Lot:</span>{" "}
                              {account.forceLot && account.forceLot > 0
                                ? account.forceLot
                                : "Disabled"}
                            </span>
                            <span className="text-gray-700">
                              <span className="font-medium">Reverse:</span>{" "}
                              {account.reverseTrade ? "Yes" : "No"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {account.copyingTo &&
                            account.copyingTo.length > 0 ? (
                              account.copyingTo.map(
                                (target: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                                  >
                                    {target}
                                  </span>
                                )
                              )
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                No copy targets
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAccount(account)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleDeleteAccount(account.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showDeleteConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
                <p className="mb-6 text-muted-foreground">
                  Are you sure you want to delete this trading account? This
                  action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelDeleteAccount}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={confirmDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {!isAddingAccount && (
        <CardFooter className="flex flex-col text-sm text-muted-foreground border-t pt-4">
          <p>
            Set up multiple trading accounts and configure which accounts copy
            trades from each other. You can add up to 50 accounts.
          </p>
          <p className="mt-2">
            Need help? Contact our support at{" "}
            <a
              href="mailto:support@iptrade.com"
              className="text-blue-600 hover:underline"
            >
              support@iptrade.com
            </a>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
