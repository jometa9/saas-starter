"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerPortalAction } from "@/lib/payments/actions";
import { User } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, useTransition } from "react";
import { updateAppVersionAction } from "@/lib/db/actions";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EyeIcon,
  EyeOffIcon,
  CopyIcon,
  CheckIcon,
  Lock,
  Loader2,
  CreditCard,
} from "lucide-react";
import { Label as UILabel } from "@/components/ui/label";
import { updatePassword } from "@/app/(login)/actions";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { getAvatarBgColor, getAvatarTextColor } from "@/lib/utils";

type ActionState = {
  error?: string;
  success?: string;
  info?: string;
};

export function Settings({
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
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [version, setVersion] = useState(currentVersion || "1.0.0");
  const [displayedVersion, setDisplayedVersion] = useState(
    currentVersion || "1.0.0"
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [isValidFormat, setIsValidFormat] = useState(true);
  const [actionState, setActionState] = useState<ActionState>({});
  const [isLicenseVisible, setIsLicenseVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Estado para el cambio de contraseña
  const [passwordState, setPasswordState] = useState<ActionState>({});
  const [isPasswordPending, setIsPasswordPending] = useState(false);

  // Estado adicional para los nuevos campos
  const [releaseNotes, setReleaseNotes] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    if (currentVersion) {
      setVersion(currentVersion);
      setDisplayedVersion(currentVersion);
    }
  }, [currentVersion]);

  useEffect(() => {
    if (actionState.success) {
      const match = actionState.success.match(
        /App version updated to ([\d.]+)/
      );
      if (match && match[1]) {
        const updatedVersion = match[1];
        setDisplayedVersion(updatedVersion);

        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    }
  }, [actionState.success, router]);

  useEffect(() => {
    if (errorParam) {
      let errorMessage = "An error occurred unexpectedly";

      // Mapear códigos de error a mensajes más descriptivos
      switch (errorParam) {
        case "payment-error":
          errorMessage =
            "An error occurred while processing the payment. Please try again later.";
          break;
        case "stripe-api-key":
          errorMessage =
            "The Stripe API key is not valid. Please configure a valid test key in your .env.local file.";
          break;
        case "invalid-price":
          errorMessage =
            "The selected price is not valid or does not exist in Stripe. Please configure products and prices in your Stripe account.";
          break;
        case "missing-price":
          errorMessage =
            "No price has been specified for the subscription. Please select a plan.";
          break;
        case "customer-error":
          errorMessage =
            "Your customer profile could not be created or updated in the payment system. Please try again.";
          break;
        case "update-error":
          errorMessage =
            "Your user information could not be updated. Please try again later.";
          break;
        case "profile-setup-error":
          errorMessage =
            "Your customer profile could not be set up. Please contact technical support.";
          break;
        case "user-data-error":
          errorMessage =
            "Your user session does not have sufficient data. Please log out, log back in, and try again.";
          break;
        case "checkout-error":
          errorMessage =
            "Error in the payment process. Please try again or contact support if the problem persists.";
          break;
        case "portal-access":
          errorMessage =
            "Could not access the subscription management portal. Check your internet connection or try again later.";
          break;
        case "no-customer-id":
          errorMessage =
            "You don't have an active subscription. Please subscribe first to access the billing portal.";
          break;
        case "no-product-id":
          errorMessage =
            "There is no product associated with your account. Please contact support.";
          break;
        case "invalid-customer":
          errorMessage =
            "Your customer information is not valid in our payment system. Please contact support.";
          break;
        case "portal-config":
          errorMessage =
            "The billing portal is not properly configured. Please contact support.";
          break;
        case "setup-failed":
          errorMessage =
            "Your payment profile could not be set up. Please try again or contact support.";
          break;
        case "invalid-customer-id":
          errorMessage =
            "Your customer ID is not valid in the payment system. Please contact support.";
          break;
        case "invalid-price-id":
          errorMessage =
            "The selected plan is not valid. Please select another plan.";
          break;
        case "stripe-config":
          errorMessage =
            "Error in the payment system configuration. Please contact support.";
          break;
        case "price-error":
          errorMessage =
            "Error with the selected price. Please choose another plan.";
          break;
        case "stripe-create-customer":
          errorMessage =
            "Could not create your customer profile in Stripe. Verify that the Stripe configuration is correct or contact support.";
          break;
        case "invalid-api-key":
          errorMessage =
            "The Stripe API key is not valid or is not configured correctly. Please contact the administrator.";
          break;
        case "invalid-price-format":
          errorMessage =
            "The format of the selected price ID is not valid. It must start with 'price_'.";
          break;
        case "stripe-verification":
          errorMessage =
            "Could not verify your account information in Stripe. Please try again later.";
          break;
        case "network-error":
          errorMessage =
            "Connection error while processing the payment. Check your internet connection and try again.";
          break;
        case "session-error":
          errorMessage =
            "Error creating the payment session. Please try again or contact support.";
          break;
        case "no-active-subscription":
          errorMessage =
            "You don't have an active subscription or trial period. You must subscribe first.";
          break;
        case "subscription-exists":
          errorMessage =
            "You already have an active subscription. You can manage your subscription from your dashboard.";
          break;
        case "invalid-redirect-url":
          errorMessage =
            "Error with redirect URLs in the payment process. Please contact the administrator.";
          break;
        case "url-error":
          errorMessage =
            "Error in the payment process URLs. Please contact the administrator.";
          break;
        case "missing-customer":
          errorMessage =
            "Could not find customer information in the payment session.";
          break;
        case "missing-subscription":
          errorMessage =
            "Could not find subscription information in the payment session.";
          break;
        case "missing-price-data":
          errorMessage =
            "Could not find price information in the created subscription.";
          break;
      }

      // Mostrar toast de error
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Limpiar el parámetro de error de la URL
      const params = new URLSearchParams(window.location.search);
      params.delete("error");
      router.replace(
        `/dashboard/settings${params.toString() ? `?${params.toString()}` : ""}`
      );
    }

    // Mostrar mensaje de éxito si hay uno
    const successParam = searchParams.get("success");
    if (successParam) {
      let successMessage = "Operation completed successfully";

      // Mapear códigos de éxito a mensajes más descriptivos
      switch (successParam) {
        case "subscription-activated":
          successMessage =
            "¡Tu suscripción ha sido activada correctamente! Ya puedes disfrutar de todas las funcionalidades premium.";
          break;
        case "subscription-simulated":
          successMessage =
            "Simulación de suscripción completada. En un entorno real, ahora tendrías acceso a todas las funcionalidades premium.";
          break;
      }

      // Mostrar toast de éxito
      toast({
        title: "Success!",
        description: successMessage,
        variant: "default",
      });

      // Limpiar el parámetro de éxito de la URL
      const params = new URLSearchParams(window.location.search);
      params.delete("success");
      router.replace(
        `/dashboard/settings${params.toString() ? `?${params.toString()}` : ""}`
      );
    }
  }, [errorParam, router, searchParams]);

  const validateVersionFormat = (value: string) => {
    const versionRegex = /^\d+\.\d+\.\d+$/;
    return versionRegex.test(value.trim());
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVersion = e.target.value;
    setVersion(newVersion);
    setIsValidFormat(validateVersionFormat(newVersion));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    // Limpiar estados de alerta previos
    setActionState({});

    // Validar formato de versión
    let versionToSend = version.trim();
    if (!validateVersionFormat(versionToSend)) {
      setIsValidFormat(false);
      setIsPending(false);
      return;
    }

    try {
      // Crear un FormData para enviar todos los campos
      const formData = new FormData(event.currentTarget);
      // Añadir el estado del checkbox crítico explícitamente
      formData.set("isCritical", isCritical.toString());

      const result = await updateAppVersionAction(formData, {});
      setActionState(result || {});

      // Limpiar campos si fue exitoso
      if (result.success) {
        setReleaseNotes("");
        setDownloadUrl("");
        setIsCritical(false);
      }
    } catch (error) {
      
      setActionState({ error: "Error updating version" });
    } finally {
      setIsPending(false);
    }
  };

  const toggleLicenseVisibility = () => {
    setIsLicenseVisible(!isLicenseVisible);
  };

  const copyToClipboard = () => {
    if (user.apiKey) {
      navigator.clipboard
        .writeText(user.apiKey)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          
        });
    }
  };

  // Manejo del formulario de cambio de contraseña
  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsPasswordPending(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await updatePassword(formData);
      setPasswordState(result || {});

      // Limpiar el formulario si hay éxito
      if (result.success) {
        (event.target as HTMLFormElement).reset();
      }
    } catch (error) {
      
      setPasswordState({ error: "Error updating password" });
    } finally {
      setIsPasswordPending(false);
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Dashboard</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center space-x-4 mb-4">
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
                    <p className="font-medium">{getUserDisplayName(user)}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user.email}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  Current Plan: {user.planName || "Free"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.subscriptionStatus === "active"
                    ? "Active Subscription"
                    : user.subscriptionStatus === "trialing"
                      ? "Trial Period"
                      : user.subscriptionStatus === "canceled"
                        ? "Subscription Canceled"
                        : user.subscriptionStatus === "past_due"
                          ? "Unpaid Subscription"
                          : user.subscriptionStatus === "incomplete"
                            ? "Incomplete Subscription"
                            : user.stripeSubscriptionId
                              ? `Status: ${user.subscriptionStatus || "unknown"}`
                              : "No active subscription"}
                </p>
              </div>

              {/* Mostrar botones diferentes según si el usuario tiene suscripción o no */}
              {user.stripeSubscriptionId ? (
                // Si tiene cualquier tipo de suscripción, mostrar el botón para gestionarla
                <form
                  action={async () => {
                    try {
                      // Mostrar mensaje de espera mientras se procesa
                      toast({
                        title: "Processing...",
                        description: "Preparing management portal...",
                      });

                      // Intentar acceder al portal de cliente
                      const result = await customerPortalAction();

                      if (result?.error) {
                        // Si hay un error, mostrar el mensaje adecuado
                        
                        let errorMessage =
                          "Could not access management portal.";

                        // Mapear códigos de error a mensajes más descriptivos
                        switch (result.error) {
                          case "no-customer-id":
                            errorMessage =
                              "No customer profile configured. Contact support.";
                            break;
                          case "no-active-subscription":
                            errorMessage =
                              "You don't have an active or trial subscription. You must subscribe first.";
                            break;
                          case "no-product-id":
                            errorMessage =
                              "Your subscription does not have an assigned product. Contact support.";
                            break;
                          case "stripe-api-key":
                            errorMessage =
                              "Stripe configuration error. Contact the administrator.";
                            break;
                          case "portal-config":
                            errorMessage =
                              "Error in portal configuration. Contact support.";
                            break;
                          case "invalid-customer":
                            errorMessage =
                              "Your customer profile is not valid. Contact support.";
                            break;
                        }

                        toast({
                          title: "Error",
                          description: errorMessage,
                          variant: "destructive",
                        });

                        // Si es un error de conexión, ofrecer modo de simulación
                        if (
                          result.error === "stripe-api-key" ||
                          result.error === "portal-config"
                        ) {
                          setTimeout(() => {
                            toast({
                              title: "Demo Mode",
                              description:
                                "Would you like to see a portal simulation?",
                              action: (
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      (window.location.href =
                                        "/dashboard?success=portal-simulated")
                                    }
                                  >
                                    Yes, simulate
                                  </Button>
                                </div>
                              ),
                            });
                          }, 1500);
                        }

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
                            "Redirigiendo a demo mode due to environment limitations.",
                        });
                        setTimeout(() => {
                          window.location.href =
                            "/dashboard?success=portal-simulated";
                        }, 1500);
                      }
                    } catch (error) {
                      
                      // Mostrar mensaje de error más descriptivo
                      toast({
                        title: "No access to portal",
                        description:
                          "An error occurred while trying to access the management portal. Your subscription is still active.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Button type="submit" variant="outline">
                    Manage Subscription
                  </Button>
                </form>
              ) : (
                // Si no tiene suscripción activa, mostrar botón para suscribirse
                <Button
                  variant="default"
                  onClick={() => {
                    // Redirección directa sin mensajes de espera
                    router.push("/pricing");
                  }}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>License Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use this license key to validate your subscription from
              application.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 w-full">
                <div className="bg-gray-100 p-2 rounded w-full overflow-hidden relative">
                  {user.apiKey
                    ? isLicenseVisible
                      ? user.apiKey
                      : "•".repeat(
                          user.apiKey.length > 12 ? 12 : user.apiKey.length
                        )
                    : "No License key generated"}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={toggleLicenseVisibility}
                  title={
                    isLicenseVisible ? "Hide License Key" : "Show License Key"
                  }
                >
                  {isLicenseVisible ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={!user.apiKey}
                  title="Copy to Clipboard"
                >
                  {isCopied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {isCopied && (
                <p className="text-xs text-green-500">
                  License key copied to clipboard!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de seguridad integrada */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <UILabel htmlFor="current-password">Current Password</UILabel>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                maxLength={100}
              />
            </div>
            <div>
              <UILabel htmlFor="new-password">New Password</UILabel>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={100}
              />
            </div>
            <div>
              <UILabel htmlFor="confirm-password">Confirm New Password</UILabel>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                maxLength={100}
              />
            </div>
            {passwordState.error && (
              <p className="text-red-500 text-sm">{passwordState.error}</p>
            )}
            {passwordState.success && (
              <p className="text-green-500 text-sm">{passwordState.success}</p>
            )}
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white"
              disabled={isPasswordPending}
            >
              {isPasswordPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {user.role === "admin" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>App Version Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Set the current application version. This will be returned by
                the version API.
              </p>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <UILabel htmlFor="version">Version Number</UILabel>
                    <Input
                      id="version"
                      type="text"
                      name="version"
                      placeholder="1.0.0"
                      value={version}
                      onChange={handleVersionChange}
                      className={`${!isValidFormat ? "border-red-500" : ""}`}
                    />
                    {!isValidFormat && (
                      <p className="text-sm text-red-500">
                        Invalid version format. Use X.Y.Z (e.g., 1.0.0)
                      </p>
                    )}

                    <div className="mt-4">
                      <UILabel htmlFor="downloadUrl">
                        Download URL (optional)
                      </UILabel>
                      <Input
                        id="downloadUrl"
                        type="url"
                        name="downloadUrl"
                        placeholder="https://example.com/download"
                        value={downloadUrl}
                        onChange={(e) => setDownloadUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        URL where users can download this version
                      </p>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      <Checkbox
                        id="isCritical"
                        name="isCritical"
                        checked={isCritical}
                        onCheckedChange={(checked) =>
                          setIsCritical(checked === true)
                        }
                      />
                      <UILabel htmlFor="isCritical">Critical Update</UILabel>
                    </div>

                    {/* Advertencia de entorno de desarrollo */}
                    {process.env.NEXT_PUBLIC_EMAIL_MODE !== "production" && (
                      <div className="p-4 mb-4 text-sm bg-gray-100 border border-gray-200 rounded text-gray-800">
                        <p className="font-medium">
                          ⚠️ Development mode active
                        </p>
                        <p>Emails will be sent to safe test addresses.</p>
                        <p>
                          Domains like test.com, example.com and other similar
                          ones will be redirected to:{" "}
                          {process.env.RESEND_TEST_EMAIL ||
                            "onboarding@resend.dev"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <UILabel htmlFor="releaseNotes">
                      Release Notes (optional)
                    </UILabel>
                    <Textarea
                      id="releaseNotes"
                      name="releaseNotes"
                      placeholder="Describe the changes in this version..."
                      value={releaseNotes}
                      onChange={(e) => setReleaseNotes(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      These changes will be sent to users by email
                    </p>
                  </div>
                </div>

                {actionState.error && (
                  <p className="text-sm text-red-500">{actionState.error}</p>
                )}
                {actionState.success && (
                  <p className="text-sm text-green-500">
                    {actionState.success}
                  </p>
                )}
                {actionState.info && (
                  <p className="text-sm text-blue-500">{actionState.info}</p>
                )}

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm font-medium">
                    Current Version:{" "}
                    <span className="text-blue-500">{displayedVersion}</span>
                  </div>

                  <Button type="submit" disabled={isPending || !isValidFormat}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Version"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sección de administrador para actualización de versiones */}
      {user.role === "admin" && (
        <div className="space-y-4 p-4 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-medium">
                Administrator - Tools
              </h3>
              <p className="text-sm text-gray-500">
                Tools for system administrators
              </p>
            </div>

            <div className="mt-2 sm:mt-0 flex space-x-2">
              {/* Botón para probar configuración de email */}
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/email/test", {
                      method: "GET",
                    });

                    const result = await response.json();

                    if (result.success) {
                      toast({
                        title: "Correct Configuration",
                        description: `Email configured correctly. Mode: ${result.emailMode}`,
                      });
                    } else {
                      toast({
                        title: "Configuration Error",
                        description:
                          result.message ||
                          "Email configuration is not correct",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error verifying",
                      description:
                        "Could not verify email configuration",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Test Email
              </Button>

              {/* Botón para diagnosticar configuración de Stripe */}
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    toast({
                      title: "Checking Stripe...",
                      description:
                        "Checking Stripe configuration and API access...",
                    });

                    const response = await fetch("/api/debug/payment", {
                      method: "GET",
                    });

                    const result = await response.json();

                    if (response.ok) {
                      // Determinar estado general del sistema de pagos
                      let statusTitle = "Status of payment system";
                      let statusDescription = "";
                      let statusVariant: "default" | "destructive" = "default";

                      // Análisis del resultado
                      if (
                        result.stripe.status === "no-key" ||
                        result.stripe.status === "invalid-key"
                      ) {
                        statusTitle = "⚠️ Invalid Stripe Configuration";
                        statusDescription =
                          result.stripe.message +
                          ". Payments cannot be processed.";
                        statusVariant = "destructive";
                      } else if (result.pricesError) {
                        statusTitle = "⚠️ Stripe Connection Error";
                        statusDescription =
                          "The API key seems valid, but the price list could not be obtained: " +
                          result.pricesError;
                        statusVariant = "destructive";
                      } else if (!result.prices || result.prices.length === 0) {
                        statusTitle = "⚠️ No Prices Configured";
                        statusDescription =
                          "Stripe is configured, but there are no products or prices defined. Configure them in your Stripe dashboard.";
                        statusVariant = "destructive";
                      } else if (
                        result.customerError &&
                        result.user.stripeCustomerId
                      ) {
                        statusTitle = "⚠️ Customer Error in Stripe";
                        statusDescription = `Stored customer ID (${result.user.stripeCustomerId}) is not valid in Stripe: ${result.customerError}`;
                        statusVariant = "destructive";
                      } else {
                        statusTitle = "✅ Correct Stripe Configuration";
                        statusDescription = `Mode: ${result.stripe.status}. Found ${result.prices?.length || 0} prices.`;
                      }

                      toast({
                        title: statusTitle,
                        description: statusDescription,
                        variant: statusVariant,
                      });
                    } else {
                      toast({
                        title: "Diagnostic Error",
                        description:
                          result.error ||
                          "Could not perform Stripe diagnostic",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error verifying",
                      description:
                        "Could not contact server to diagnose Stripe",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Diagnose Stripe
              </Button>
            </div>
          </div>

          {process.env.NEXT_PUBLIC_EMAIL_MODE !== "production" && (
            <div className="p-4 mb-4 text-sm bg-gray-100 border border-gray-200 rounded text-gray-800">
              <p className="font-medium">⚠️ Development mode active</p>
              <p>Emails will be sent to safe test addresses.</p>
              <p>
                Domains like test.com, example.com and other similar ones will
                be redirected to:{" "}
                {process.env.RESEND_TEST_EMAIL || "onboarding@resend.dev"}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
