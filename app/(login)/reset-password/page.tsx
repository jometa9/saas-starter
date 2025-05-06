"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { resetPasswordAction } from "../actions";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Componente que utiliza useSearchParams envuelto en Suspense
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, formAction] = useActionState(resetPasswordAction, {
    error: "",
    success: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (formData: FormData) => {
    // Asegurarse de que el token se incluya en el formulario
    formData.append("token", token);
    setIsSubmitting(true);
    formAction(formData);
  };

  // Reset submitting state when response is received
  if (state.success || state.error) {
    isSubmitting && setIsSubmitting(false);
  }

  // Si no hay token, mostrar un mensaje de error
  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Invalid Reset Link</h2>
          <p className="text-sm text-muted-foreground mt-2">
            The password reset link is invalid or has expired.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <p className="mb-4 text-sm">
                Please request a new password reset link.
              </p>
              <Link href="/forgot-password" className="w-full">
                <Button className="w-full">Request New Reset Link</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Reset Your Password</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Create a new password for your IPTRADE account
        </p>
      </div>

      <Card>
        <CardContent className="pt-4">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state.success && (
              <Alert
                variant="default"
                className="bg-green-50 border-green-200 text-green-800"
              >
                <AlertDescription>{state.success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !!state.success}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col">
          {state.success ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/sign-in">Go to Sign In</Link>
            </Button>
          ) : (
            <Link
              href="/sign-in"
              className=" hover:underline text-gray-500 text-sm"
            >
              Back to Sign In
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p>Loading reset password form...</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
