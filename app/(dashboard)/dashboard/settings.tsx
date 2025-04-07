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
      let errorMessage = "Ha ocurrido un error inesperado";

      // Mapear códigos de error a mensajes más descriptivos
      switch (errorParam) {
        case "payment-error":
          errorMessage =
            "Ha ocurrido un error al procesar el pago. Por favor intenta de nuevo más tarde.";
          break;
        case "stripe-api-key":
          errorMessage =
            "La clave API de Stripe no es válida. Por favor configura una clave de prueba válida en el archivo .env.local.";
          break;
        case "invalid-price":
          errorMessage =
            "El precio seleccionado no es válido o no existe en Stripe. Por favor configura productos y precios en tu cuenta de Stripe.";
          break;
        case "missing-price":
          errorMessage =
            "No se ha especificado un precio para la suscripción. Por favor selecciona un plan.";
          break;
        case "customer-error":
          errorMessage =
            "No se pudo crear o actualizar tu perfil de cliente en el sistema de pagos. Por favor intenta de nuevo.";
          break;
        case "update-error":
          errorMessage =
            "No se pudo actualizar tu información de usuario. Por favor intenta de nuevo más tarde.";
          break;
        case "profile-setup-error":
          errorMessage =
            "No se pudo configurar tu perfil de cliente. Por favor contacta a soporte técnico.";
          break;
        case "user-data-error":
          errorMessage =
            "Tu sesión de usuario no tiene datos suficientes. Por favor cierra sesión, vuelve a iniciar sesión e intenta de nuevo.";
          break;
        case "checkout-error":
          errorMessage =
            "Error en el proceso de pago. Por favor intenta de nuevo o contacta a soporte si el problema persiste.";
          break;
        case "portal-access":
          errorMessage =
            "No se pudo acceder al portal de gestión de suscripciones. Verifica tu conexión a internet o inténtalo más tarde.";
          break;
        case "no-customer-id":
          errorMessage =
            "No tienes una suscripción activa. Por favor suscríbete primero para acceder al portal de facturación.";
          break;
        case "no-product-id":
          errorMessage =
            "No hay un producto asociado a tu cuenta. Por favor contacta a soporte.";
          break;
        case "invalid-customer":
          errorMessage =
            "Tu información de cliente no es válida en nuestro sistema de pagos. Por favor contacta a soporte.";
          break;
        case "portal-config":
          errorMessage =
            "El portal de facturación no está correctamente configurado. Por favor contacta a soporte.";
          break;
        case "setup-failed":
          errorMessage =
            "No se pudo configurar tu perfil de pago. Por favor intenta de nuevo o contacta a soporte.";
          break;
        case "invalid-customer-id":
          errorMessage =
            "Tu ID de cliente no es válido en el sistema de pagos. Por favor contacta a soporte.";
          break;
        case "invalid-price-id":
          errorMessage =
            "El plan seleccionado no es válido. Por favor selecciona otro plan.";
          break;
        case "stripe-config":
          errorMessage =
            "Error en la configuración del sistema de pagos. Por favor contacta a soporte.";
          break;
        case "price-error":
          errorMessage =
            "Error con el precio seleccionado. Por favor elige otro plan.";
          break;
        case "stripe-create-customer":
          errorMessage =
            "No se pudo crear tu perfil de cliente en Stripe. Verifica que la configuración de Stripe es correcta o contacta a soporte.";
          break;
        case "invalid-api-key":
          errorMessage =
            "La clave API de Stripe no es válida o no está configurada correctamente. Por favor contacta con el administrador.";
          break;
        case "invalid-price-format":
          errorMessage =
            "El formato del ID de precio seleccionado no es válido. Debe comenzar con 'price_'.";
          break;
        case "stripe-verification":
          errorMessage =
            "No se pudo verificar la información de tu cuenta en Stripe. Por favor intenta más tarde.";
          break;
        case "network-error":
          errorMessage =
            "Error de conexión al procesar el pago. Verifica tu conexión a internet e intenta nuevamente.";
          break;
        case "session-error":
          errorMessage =
            "Error al crear la sesión de pago. Por favor intenta nuevamente o contacta a soporte.";
          break;
        case "no-active-subscription":
          errorMessage =
            "No tienes una suscripción activa o en período de prueba. Debes suscribirte primero.";
          break;
        case "subscription-exists":
          errorMessage =
            "Ya tienes una suscripción activa. Puedes gestionar tu suscripción desde tu dashboard.";
          break;
        case "invalid-redirect-url":
          errorMessage =
            "Error con las URLs de redirección en el proceso de pago. Por favor contacta al administrador.";
          break;
        case "url-error":
          errorMessage =
            "Error en las URLs del proceso de pago. Por favor contacta al administrador.";
          break;
        case "missing-customer":
          errorMessage =
            "No se pudo encontrar la información de cliente en la sesión de pago.";
          break;
        case "missing-subscription":
          errorMessage =
            "No se pudo encontrar la información de suscripción en la sesión de pago.";
          break;
        case "missing-price-data":
          errorMessage =
            "No se pudo encontrar la información de precio en la suscripción creada.";
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
      let successMessage = "Operación completada correctamente";

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
        title: "¡Éxito!",
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
      console.error("Error al actualizar la versión:", error);
      setActionState({ error: "Error al actualizar la versión" });
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
          console.error("Error al copiar al portapapeles:", err);
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
      console.error("Error al actualizar la contraseña:", error);
      setPasswordState({ error: "Error al actualizar la contraseña" });
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
                    ? "Suscripción activa"
                    : user.subscriptionStatus === "trialing"
                      ? "Período de prueba"
                      : user.subscriptionStatus === "canceled"
                        ? "Suscripción cancelada"
                        : user.subscriptionStatus === "past_due"
                          ? "Pago pendiente"
                          : user.subscriptionStatus === "unpaid"
                            ? "Suscripción impaga"
                            : user.subscriptionStatus === "incomplete"
                              ? "Suscripción incompleta"
                              : user.stripeSubscriptionId
                                ? `Estado: ${user.subscriptionStatus || "desconocido"}`
                                : "No hay suscripción activa"}
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
                        title: "Procesando...",
                        description: "Preparando el portal de gestión...",
                      });

                      // Intentar acceder al portal de cliente
                      const result = await customerPortalAction();

                      if (result?.error) {
                        // Si hay un error, mostrar el mensaje adecuado
                        console.error(
                          "Error al acceder al portal:",
                          result.error
                        );
                        let errorMessage =
                          "No se pudo acceder al portal de gestión.";

                        // Mapear códigos de error a mensajes más descriptivos
                        switch (result.error) {
                          case "no-customer-id":
                            errorMessage =
                              "No tienes un perfil de cliente configurado. Contacta con soporte.";
                            break;
                          case "no-active-subscription":
                            errorMessage =
                              "No tienes una suscripción activa o en período de prueba. Debes suscribirte primero.";
                            break;
                          case "no-product-id":
                            errorMessage =
                              "Tu suscripción no tiene un producto asignado. Contacta con soporte.";
                            break;
                          case "stripe-api-key":
                            errorMessage =
                              "Error de configuración de Stripe. Contacta con el administrador.";
                            break;
                          case "portal-config":
                            errorMessage =
                              "Error en la configuración del portal. Contacta con soporte.";
                            break;
                          case "invalid-customer":
                            errorMessage =
                              "Tu perfil de cliente no es válido. Contacta con soporte.";
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
                              title: "Modo de demostración",
                              description:
                                "¿Quieres ver una simulación del portal?",
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
                                    Sí, simular
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
                          title: "Simulación",
                          description:
                            "Redirigiendo a modo simulado debido a limitaciones del entorno.",
                        });
                        setTimeout(() => {
                          window.location.href =
                            "/dashboard?success=portal-simulated";
                        }, 1500);
                      }
                    } catch (error) {
                      console.error("Error al acceder al portal:", error);
                      // Mostrar mensaje de error más descriptivo
                      toast({
                        title: "No se pudo acceder al portal",
                        description:
                          "Se ha producido un error al intentar acceder al portal de gestión. Tu suscripción sigue activa.",
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
                        URL donde los usuarios pueden descargar esta versión
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
                      placeholder="Describe los cambios en esta versión..."
                      value={releaseNotes}
                      onChange={(e) => setReleaseNotes(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Estos cambios se enviarán a los usuarios por email
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
                Administrador - Herramientas
              </h3>
              <p className="text-sm text-gray-500">
                Herramientas para administradores del sistema
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
                        title: "Configuración correcta",
                        description: `Email configurado correctamente. Modo: ${result.emailMode}`,
                      });
                    } else {
                      toast({
                        title: "Error en configuración",
                        description:
                          result.message ||
                          "La configuración de email no es correcta",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error al verificar",
                      description:
                        "No se pudo verificar la configuración de email",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Probar email
              </Button>

              {/* Botón para diagnosticar configuración de Stripe */}
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    toast({
                      title: "Verificando Stripe...",
                      description:
                        "Comprobando configuración de Stripe y acceso a la API...",
                    });

                    const response = await fetch("/api/debug/payment", {
                      method: "GET",
                    });

                    const result = await response.json();

                    if (response.ok) {
                      // Determinar estado general del sistema de pagos
                      let statusTitle = "Estado del sistema de pagos";
                      let statusDescription = "";
                      let statusVariant: "default" | "destructive" = "default";

                      // Análisis del resultado
                      if (
                        result.stripe.status === "no-key" ||
                        result.stripe.status === "invalid-key"
                      ) {
                        statusTitle = "⚠️ Configuración de Stripe inválida";
                        statusDescription =
                          result.stripe.message +
                          ". No se pueden procesar pagos.";
                        statusVariant = "destructive";
                      } else if (result.pricesError) {
                        statusTitle = "⚠️ Error al conectar con Stripe";
                        statusDescription =
                          "La clave API parece válida, pero no se pudo obtener la lista de precios: " +
                          result.pricesError;
                        statusVariant = "destructive";
                      } else if (!result.prices || result.prices.length === 0) {
                        statusTitle = "⚠️ No hay precios configurados";
                        statusDescription =
                          "Stripe está configurado, pero no hay productos o precios definidos. Configúralos en tu dashboard de Stripe.";
                        statusVariant = "destructive";
                      } else if (
                        result.customerError &&
                        result.user.stripeCustomerId
                      ) {
                        statusTitle = "⚠️ Error de cliente en Stripe";
                        statusDescription = `El ID de cliente almacenado (${result.user.stripeCustomerId}) no es válido en Stripe: ${result.customerError}`;
                        statusVariant = "destructive";
                      } else {
                        statusTitle = "✅ Configuración de Stripe correcta";
                        statusDescription = `Modo: ${result.stripe.status}. Se encontraron ${result.prices?.length || 0} precios.`;
                      }

                      toast({
                        title: statusTitle,
                        description: statusDescription,
                        variant: statusVariant,
                      });
                    } else {
                      toast({
                        title: "Error en diagnóstico",
                        description:
                          result.error ||
                          "No se pudo realizar el diagnóstico de Stripe",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error al verificar",
                      description:
                        "No se pudo contactar con el servidor para diagnosticar Stripe",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Diagnosticar Stripe
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
