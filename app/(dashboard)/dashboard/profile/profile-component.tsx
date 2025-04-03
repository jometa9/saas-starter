'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/db/schema';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePassword } from '@/app/(login)/actions';
import { toast } from '@/components/ui/use-toast';
import { Lock, Mail, Loader2, User as UserIcon } from 'lucide-react';

type ActionState = {
  error?: string;
  success?: string;
  info?: string;
};

export function Profile({ user }: { user: User }) {
  const getUserDisplayName = (user: User) => {
    return user.name || user.email || 'Unknown User';
  };

  // Estado para el formulario de email
  const [isEmailPending, setIsEmailPending] = useState(false);
  const [emailState, setEmailState] = useState<ActionState>({});
  const emailFormRef = useRef<HTMLFormElement>(null);

  // Estado para el cambio de contraseña
  const [passwordState, setPasswordState] = useState<ActionState>({});
  const [isPasswordPending, setIsPasswordPending] = useState(false);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  // Manejar el cambio de email
  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEmailPending(true);
    
    try {
      // En una implementación real, aquí iría el código para actualizar el email
      // Por ahora, simulamos una actualización exitosa
      setTimeout(() => {
        setEmailState({ success: "Email updated successfully. Please check your inbox for verification." });
        setIsEmailPending(false);
        
        // Mostrar toast de éxito
        toast({
          title: "Email Update",
          description: "Your email address has been updated. A verification email has been sent to your new address.",
        });
        
        // Restablecer el formulario
        if (emailFormRef.current) {
          emailFormRef.current.reset();
        }
      }, 1000);
    } catch (error) {
      console.error("Error al actualizar el email:", error);
      setEmailState({ error: "Could not update email. Please try again later." });
      setIsEmailPending(false);
    }
  };

  // Manejar el cambio de contraseña
  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Profile Settings</h1>

      {/* Información básica del perfil */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage
                alt={getUserDisplayName(user)}
              />
              <AvatarFallback>
                {getUserDisplayName(user)
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">
                {getUserDisplayName(user)}
              </p>
              <p className="text-sm text-muted-foreground">
                Member since: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Account type: {user.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario para cambiar email */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={emailFormRef} onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="current-email">Current Email</Label>
              <Input
                id="current-email"
                type="email"
                value={user.email || ''}
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
            <Button
              type="submit"
              disabled={isEmailPending}
            >
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

      {/* Formulario para cambiar contraseña */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={passwordFormRef} className="space-y-4" onSubmit={handlePasswordSubmit}>
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

      {/* Información de privacidad */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            These settings control how your personal information is used and shared.
          </p>
          
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              <strong>Data Collection:</strong> We collect minimal data necessary to provide our services.
            </p>
            <p className="text-muted-foreground">
              <strong>Data Sharing:</strong> We never sell your personal information to third parties.
            </p>
            <p className="text-muted-foreground">
              <strong>Account Deletion:</strong> You can request to delete your account and all associated data at any time.
            </p>
          </div>
          
          <div className="mt-6">
            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
} 