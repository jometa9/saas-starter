"use client";

import Link from "next/link";
import { useState } from "react";
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
import { forgotPassword } from "../actions";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPassword, {
    error: "",
    success: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true);
    formAction(formData);
  };

  // Reset submitting state when response is received
  if (state.success || state.error) {
    isSubmitting && setIsSubmitting(false);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Forgot Password</h2>
        <p className="text-sm text-muted-foreground mt-2">
          We'll send you a link to reset your password
        </p>
      </div>

      <Card>
        <CardContent className="pt-4">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
              />
              <p className="text-xs text-muted-foreground">
                Enter the email address associated with your account
              </p>
            </div>

            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state.success && (
              <Alert variant="default" className="bg-green-50 text-green-800">
                <AlertDescription>
                  {state.success}
                  {state.resetLink && (
                    <div className="mt-2">
                      <Link
                        href={state.resetLink}
                        className="text-blue-500 underline"
                      >
                        Reset Password Link (Development Only)
                      </Link>
                    </div>
                  )}
                </AlertDescription>
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
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            <Link
              href="/sign-in"
              className=" hover:underline text-gray-500 text-sm"
            >
              Back to Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
