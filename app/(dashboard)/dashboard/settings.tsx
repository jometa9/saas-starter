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
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from 'lucide-react';

type ActionState = {
  error?: string;
  success?: string;
};

export function Settings({ user, currentVersion }: { user: User, currentVersion: string }) {
  const getUserDisplayName = (user: User) => {
    return user.name || user.email || 'Unknown User';
  };

  const router = useRouter();
  const [version, setVersion] = useState(currentVersion || '1.0.0');
  const [displayedVersion, setDisplayedVersion] = useState(currentVersion || '1.0.0');
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isValidFormat, setIsValidFormat] = useState(true);
  const [actionState, setActionState] = useState<ActionState>({});
  const [isLicenseVisible, setIsLicenseVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
    
    const versionToSend = validateVersionFormat(version) 
      ? version.trim() 
      : currentVersion || '1.0.0';
    
    if (!validateVersionFormat(versionToSend)) {
      setIsValidFormat(false);
      return;
    }
    
    console.log("Enviando versión:", versionToSend);
    
    startTransition(async () => {
      try {
        // Crear un objeto normal y enviarlo directamente
        const result = await updateAppVersionAction({ version: versionToSend }, {});
        setActionState(result || {});
      } catch (error) {
        console.error("Error al actualizar la versión:", error);
        setActionState({ error: "Error al actualizar la versión" });
      }
    });
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
              <form action={customerPortalAction}>
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
                <div className="flex flex-row space-x-4 items-center">
                  <Input
                    type="text"
                    name="version"
                    placeholder="1.0.0"
                    value={version}
                    onChange={handleVersionChange}
                    className={`max-w-xs ${!isValidFormat ? 'border-red-500' : ''}`}
                  />
                  <Button 
                    type="submit" 
                    disabled={isPending || !isValidFormat}
                  >
                    {isPending ? 'Updating...' : 'Update Version'}
                  </Button>
                </div>
                
                {!isValidFormat && (
                  <p className="text-sm text-red-500">
                    Invalid version format. Use X.Y.Z (e.g., 1.0.0)
                  </p>
                )}
                {actionState.error && (
                  <p className="text-sm text-red-500">{actionState.error}</p>
                )}
                {actionState.success && (
                  <p className="text-sm text-green-500">{actionState.success}</p>
                )}
                
                <div className="text-sm font-medium mt-2">
                  Current Version: <span className="text-blue-500">{displayedVersion}</span>
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
    </section>
  );
}
