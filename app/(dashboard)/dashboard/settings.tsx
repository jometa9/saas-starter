'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customerPortalAction } from '@/lib/payments/actions';
import { useActionState } from 'react';
import { User } from '@/lib/db/schema';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef, useTransition } from 'react';
import { updateAppVersionAction } from '@/lib/db/actions';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon, Lock, Loader2, CircleSlash, CreditCard, ShieldAlert, BadgeCheck, ShieldQuestion, Wrench, Timer } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { updatePassword } from '@/app/(login)/actions';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

type ActionState = {
  error?: string;
  success?: string;
  info?: string;
};

export function Settings({ user, currentVersion }: { user: User, currentVersion: string }) {
  const getUserDisplayName = (user: User) => {
    return user.name || user.email || 'Unknown User';
  };

  const router = useRouter();
  const [version, setVersion] = useState(currentVersion || '1.0.0');
  const [displayedVersion, setDisplayedVersion] = useState(currentVersion || '1.0.0');
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
  const [releaseNotes, setReleaseNotes] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    if (currentVersion) {
      setVersion(currentVersion);
      setDisplayedVersion(currentVersion);
    }
  }, [currentVersion]);
  
  useEffect(() => {
    if (actionState.success) {
      const match = actionState.success.match(/App version updated to ([\d.]+)/);
      if (match && match[1]) {
        const updatedVersion = match[1];
        setDisplayedVersion(updatedVersion);
        
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    }
  }, [actionState.success, router]);
  
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
      formData.set('isCritical', isCritical.toString());
      
      const result = await updateAppVersionAction(formData, {});
      setActionState(result || {});
      
      // Limpiar campos si fue exitoso
      if (result.success) {
        setReleaseNotes('');
        setDownloadUrl('');
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
      navigator.clipboard.writeText(user.apiKey)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Error al copiar al portapapeles:', err);
        });
    }
  };
  
  // Manejo del formulario de cambio de contraseña
  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
                <p className="font-medium">
                  Current Plan: {user.planName || 'Free'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.subscriptionStatus === 'active'
                    ? 'Billed monthly'
                    : user.subscriptionStatus === 'trialing'
                      ? 'Trial period'
                      : 'No active subscription'}
                </p>
              </div>
              <form action={async (formData) => {
                try {
                  await customerPortalAction();
                } catch (error) {
                  console.error('Error accessing customer portal:', error);
                  toast({
                    title: "Error",
                    description: "No se pudo acceder al portal de gestión de suscripciones. Verifica tu conexión a internet o inténtalo más tarde.",
                    variant: "destructive"
                  });
                }
              }}>
                <Button type="submit" variant="outline">
                  Manage Subscription
                </Button>
              </form>
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
              Use this license key to validate your subscription from application.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 w-full">
                <div className="font-mono bg-gray-100 p-2 rounded w-full overflow-hidden relative">
                  {user.apiKey ? (
                    isLicenseVisible ? (
                      user.apiKey
                    ) : (
                      "•".repeat(user.apiKey.length > 12 ? 12 : user.apiKey.length)
                    )
                  ) : (
                    'No License key generated'
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleLicenseVisibility} 
                  title={isLicenseVisible ? "Hide License Key" : "Show License Key"}
                >
                  {isLicenseVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={copyToClipboard} 
                  disabled={!user.apiKey}
                  title="Copy to Clipboard"
                >
                  {isCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
              {isCopied && (
                <p className="text-xs text-green-500">License key copied to clipboard!</p>
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
      
      {user.role === 'admin' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>App Version Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Set the current application version. This will be returned by the version API.
              </p>
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="version">Version Number</Label>
                    <Input
                      id="version"
                      type="text"
                      name="version"
                      placeholder="1.0.0"
                      value={version}
                      onChange={handleVersionChange}
                      className={`${!isValidFormat ? 'border-red-500' : ''}`}
                    />
                    {!isValidFormat && (
                      <p className="text-sm text-red-500">
                        Invalid version format. Use X.Y.Z (e.g., 1.0.0)
                      </p>
                    )}
                    
                    <div className="mt-4">
                      <Label htmlFor="downloadUrl">Download URL (optional)</Label>
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
                        onCheckedChange={(checked) => setIsCritical(checked === true)}
                      />
                      <Label htmlFor="isCritical">Critical Update</Label>
                    </div>
                    
                    {/* Advertencia de entorno de desarrollo */}
                    {process.env.NEXT_PUBLIC_EMAIL_MODE !== 'production' && (
                      <div className="p-4 mb-4 text-sm bg-orange-100 border border-orange-200 rounded text-orange-800">
                        <p className="font-medium">⚠️ Modo de desarrollo activo</p>
                        <p>Los emails serán enviados a direcciones de prueba seguras.</p>
                        <p>Dominios como test.com, example.com y otros similares serán redirigidos a: {process.env.RESEND_TEST_EMAIL || 'onboarding@resend.dev'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="releaseNotes">Release Notes (optional)</Label>
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
                  <p className="text-sm text-green-500">{actionState.success}</p>
                )}
                {actionState.info && (
                  <p className="text-sm text-blue-500">{actionState.info}</p>
                )}
                
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm font-medium">
                    Current Version: <span className="text-blue-500">{displayedVersion}</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isPending || !isValidFormat}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Version'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar>
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
              <p className="font-medium">
                {getUserDisplayName(user)}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de administrador para actualización de versiones */}
      {user.role === 'admin' && (
        <div className="space-y-4 p-4 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-medium">Administrador - Actualización de versiones</h3>
              <p className="text-sm text-gray-500">Actualizar la versión de la aplicación</p>
            </div>
            
            {/* Botón para probar configuración de email */}
            <div className="mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/email/test', {
                      method: 'GET',
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
                        description: result.message || "La configuración de email no es correcta",
                        variant: "destructive"
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error al verificar",
                      description: "No se pudo verificar la configuración de email",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Probar configuración de email
              </Button>
            </div>
          </div>
          
          {/* Advertencia de entorno de desarrollo */}
          {process.env.NEXT_PUBLIC_EMAIL_MODE !== 'production' && (
            <div className="p-4 mb-4 text-sm bg-orange-100 border border-orange-200 rounded text-orange-800">
              <p className="font-medium">⚠️ Modo de desarrollo activo</p>
              <p>Los emails serán enviados a direcciones de prueba seguras.</p>
              <p>Dominios como test.com, example.com y otros similares serán redirigidos a: {process.env.RESEND_TEST_EMAIL || 'onboarding@resend.dev'}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
