'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useFormState } from 'react-dom';
import { resetPasswordAction } from '../actions';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [state, formAction] = useFormState(resetPasswordAction, { error: '', success: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (formData: FormData) => {
    // Asegurarse de que el token se incluya en el formulario
    formData.append('token', token);
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Error</CardTitle>
          <CardDescription>
            Invalid reset link. Please request a new password reset.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/forgot-password" className="w-full">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Request Password Reset
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
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
            <div className="text-sm font-medium text-red-500">{state.error}</div>
          )}
          {state.success && (
            <div className="text-sm font-medium text-green-500">{state.success}</div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSubmitting || !!state.success}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
          {state.success && (
            <Link href="/sign-in" className="w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
              >
                Go to Sign In
              </Button>
            </Link>
          )}
        </CardFooter>
      </form>
    </Card>
  );
} 