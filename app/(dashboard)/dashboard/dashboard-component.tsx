'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/db/schema';
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function Dashboard({ user, currentVersion }: { user: User, currentVersion: string }) {
  const getUserDisplayName = (user: User) => {
    return user.name || user.email || 'Unknown User';
  };

  const [isLicenseVisible, setIsLicenseVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const toggleLicenseVisibility = () => {
    setIsLicenseVisible(!isLicenseVisible);
  };
  
  const copyToClipboard = () => {
    if (user.apiKey) {
      navigator.clipboard.writeText(user.apiKey)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          toast({
            title: "Success",
            description: "License key copied to clipboard!",
          });
        })
        .catch(err => {
          console.error('Error al copiar al portapapeles:', err);
          toast({
            title: "Error",
            description: "Could not copy to clipboard",
            variant: "destructive"
          });
        });
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Dashboard</h1>
      
      {/* Bienvenida y resumen */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome, {getUserDisplayName(user)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
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
              <p className="text-sm text-muted-foreground">
                Current Plan: {user.planName || 'Free'}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.subscriptionStatus === 'active'
                  ? 'Active subscription'
                  : user.subscriptionStatus === 'trialing'
                    ? 'Trial period'
                    : 'No active subscription'}
              </p>
            </div>
          </div>
          
          <p className="text-sm mb-4">
            Current Version: <span className="font-medium">{currentVersion}</span>
          </p>
        </CardContent>
      </Card>
      
      {/* License Key Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>License Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use this license key to activate your subscription in the application.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 w-full">
                <div className="bg-gray-100 p-2 rounded w-full overflow-hidden relative">
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
      
      {/* Downloads Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Software Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download the latest version of our software to use with your license key.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Windows Version</h3>
                    <p className="text-sm text-muted-foreground">v{currentVersion}</p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">macOS Version</h3>
                    <p className="text-sm text-muted-foreground">v{currentVersion}</p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Linux Version</h3>
                    <p className="text-sm text-muted-foreground">v{currentVersion}</p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">User Manual</h3>
                    <p className="text-sm text-muted-foreground">PDF Documentation</p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
} 