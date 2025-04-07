"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/db/schema";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/app/(login)/actions";
import { toast } from "@/components/ui/use-toast";
import {
  Lock,
  Mail,
  Loader2,
  User as UserIcon,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";
import { getAvatarBgColor, getAvatarTextColor } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { customerPortalAction } from "@/lib/payments/actions";
import { AccountInfoCard } from "@/components/account-info-card";

type ActionState = {
  error?: string;
  success?: string;
  info?: string;
};

export function Profile({ user }: { user: User }) {
  const getUserDisplayName = (user: User) => {
    return user.name || user.email || "Unknown User";
  };

  // Estado para el formulario de email
  const [isEmailPending, setIsEmailPending] = useState(false);
  const [emailState, setEmailState] = useState<ActionState>({});
  const emailFormRef = useRef<HTMLFormElement>(null);

  // Estado para el cambio de contraseña
  const [passwordState, setPasswordState] = useState<ActionState>({});
  const [isPasswordPending, setIsPasswordPending] = useState(false);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  // Manejar el cambio de email
  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEmailPending(true);

    try {
      // En una implementación real, aquí iría el código para actualizar el email
      // Por ahora, simulamos una actualización exitosa
      setTimeout(() => {
        setEmailState({
          success:
            "Email updated successfully. Please check your inbox for verification.",
        });
        setIsEmailPending(false);

        // Mostrar toast de éxito
        toast({
          title: "Email Update",
          description:
            "Your email address has been updated. A verification email has been sent to your new address.",
        });

        // Restablecer el formulario
        if (emailFormRef.current) {
          emailFormRef.current.reset();
        }
      }, 1000);
    } catch (error) {
      console.error("Error al actualizar el email:", error);
      setEmailState({
        error: "Could not update email. Please try again later.",
      });
      setIsEmailPending(false);
    }
  };

  // Manejar el cambio de contraseña
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
        if (passwordFormRef.current) {
          passwordFormRef.current.reset();
        }
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      setPasswordState({ error: "Error updating password" });
    } finally {
      setIsPasswordPending(false);
    }
  };

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

  const goToPricing = () => {
    router.push("/pricing");
  };

  return (
    <section className="flex-1 px-4 gap-4">
      <AccountInfoCard 
        user={user}
        onManageSubscription={handleCustomerPortal}
        onGoToPricing={goToPricing}
        className="mb-4"
      />

      {/* Sección de Account Settings con diseño responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {/* Commented out - Change Email Address section 
        <Card>
          <CardHeader>
            <CardTitle>Change Email Address</CardTitle>
          </CardHeader>
          <CardContent className="ml-0 pl-4">
            <form
              ref={emailFormRef}
              onSubmit={handleEmailSubmit}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="current-email">Current Email</Label>
                <Input
                  id="current-email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="new-email">New Email</Label>
                <Input
                  id="new-email"
                  name="newEmail"
                  type="email"
                  placeholder="Enter your new email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password to confirm"
                  required
                  minLength={8}
                />
              </div>
              {emailState.error && (
                <p className="text-red-500 text-sm">{emailState.error}</p>
              )}
              {emailState.success && (
                <p className="text-green-500 text-sm">{emailState.success}</p>
              )}
              <Button type="submit" disabled={isEmailPending}>
                {isEmailPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Update Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        */}

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              ref={passwordFormRef}
              className="space-y-4"
              onSubmit={handlePasswordSubmit}
            >
              <div>
                <Label htmlFor="current-password">Current Password</Label>
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
                <Label htmlFor="new-password">New Password</Label>
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
                <Label htmlFor="confirm-password">Confirm New Password</Label>
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
                <p className="text-green-500 text-sm">
                  {passwordState.success}
                </p>
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
      </div>
      <Button
        variant="outline"
        className="text-red-500 hover:bg-red-50 hover:text-red-600 mb-0"
      >
        Delete Account
      </Button>
    </section>
  );
}
