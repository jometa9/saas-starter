'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { forgotPassword } from '../actions';

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPassword, { error: '', success: '' });
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
            />
          </div>
          {state.error && (
            <div className="text-sm font-medium text-red-500">{state.error}</div>
          )}
          {state.success && (
            <div className="text-sm font-medium text-green-500">
              {state.success}
              {state.resetLink && (
                <div className="mt-2">
                  <Link href={state.resetLink} className="text-blue-500 underline">
                    Reset Password Link (Development Only)
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
          <div className="text-sm text-center">
            <Link
              href="/sign-in"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
} 