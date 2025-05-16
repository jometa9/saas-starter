"use client";
import React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "./actions";
import { ActionState } from "@/lib/auth/middleware";
import { signIn as nextAuthSignIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const inviteId = searchParams.get("inviteId");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === "signin" ? signIn : signUp,
    { error: "" }
  );
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loginError, setLoginError] = React.useState<string>("");

  const handleGoogleSignIn = async () => {
    await nextAuthSignIn("google", { 
      redirect: true,
      callbackUrl: redirect || "/dashboard" 
    });
  };

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    const res = await nextAuthSignIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: redirect || "/dashboard"
    });
    if (res?.error) {
      let message = "";
      if (res.error === "CredentialsSignin") {
        message =
          "Invalid email or password, or this account was registered with Google. Please sign in with Google or reset your password to enable email login.";
      } else {
        message = res.error;
      }
      setLoginError(message);
    } else if (res?.ok) {
      router.replace(res.url || "/dashboard");
    }
  };

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold">
          {mode === "signin"
            ? "Sign in to IPTRADE"
            : "Create your account"}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {mode === "signin"
            ? "Enter your credentials to access your account"
            : "Fill in the information below to get started"}
        </p>
      </div>

      <Card className="w-full">
        <CardContent className="pt-4">
          <div className="space-y-4">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-4 py-6 border-2 rounded-full cursor-pointer"
              onClick={handleGoogleSignIn}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              {mode === "signin" ? "Sign in with Google" : "Register with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <form className="space-y-4" action={mode === "signin" ? undefined : formAction} onSubmit={mode === "signin" ? handleCredentialsSignIn : undefined}>
              <input type="hidden" name="redirect" value={redirect || ""} />
              <input type="hidden" name="priceId" value={priceId || ""} />
              <input type="hidden" name="inviteId" value={inviteId || ""} />

              <div>
                <Label htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email}
                  required
                  maxLength={50}
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  defaultValue={state.password}
                  required
                  minLength={8}
                  maxLength={100}
                  placeholder="••••••••"
                />
                <p className="text-xs text-muted-foreground">
                  {mode === "signup" &&
                    "Password must be at least 8 characters long"}
                </p>
              </div>

              {mode === "signin" && loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              {mode !== "signin" && state?.error && (
                <Alert variant="destructive">
                  {typeof state.error === "string" && state.error.includes("<a") ? (
                    <AlertDescription>
                      <span dangerouslySetInnerHTML={{ __html: state.error }} />
                    </AlertDescription>
                  ) : (
                    <AlertDescription>{state.error}</AlertDescription>
                  )}
                </Alert>
              )}

              <Button type="submit" className="w-full bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white border border-gray-600 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-xl cursor-pointer border-2" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    {mode === "signin" ? "Signing in..." : "Creating account..."}
                  </>
                ) : mode === "signin" ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center mb-4 text-gray-500">
            {mode === "signin"
              ? "New to our platform?"
              : "Already have an account?"}
          </div>

          <Link
            href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
              redirect ? `?redirect=${redirect}` : ""
            }${priceId ? `&priceId=${priceId}` : ""}`}
            className="w-full"
          >
            <Button variant="outline" className="w-full border-black text-black hover:bg-black/5 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center cursor-pointer border-2">
              {mode === "signin"
                ? "Create an account"
                : "Sign in to existing account"}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
