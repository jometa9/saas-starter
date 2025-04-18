"use client";
import React from "react";
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
import DownloadCard from "@/components/downloads-card";
import SupportCards from "@/components/support-cards";
import { TradingAccountsConfig } from "@/components/trading-accounts-config";
import { ChevronRightIcon } from "@radix-ui/react-icons";

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

      <Button
        variant="ghost"
        className="text-gray-400 hover:bg-red-50 hover:text-red-600 mb-0 cursor-pointer"
      >
        Delete Account
      </Button>

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
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary" />
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
                      <SelectItem value="IPTRADE Premium">
                        IPTRADE Premium
                      </SelectItem>
                      <SelectItem value="IPTRADE Unlimited">
                        IPTRADE Unlimited
                      </SelectItem>
                      <SelectItem value="IPTRADE Managed VPS">
                        IPTRADE Managed VPS
                      </SelectItem>
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
