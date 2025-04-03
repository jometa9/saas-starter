'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/db/schema';
import { CheckCircle2, ChevronRight, Book, Download, Settings, Key } from 'lucide-react';

export function Documents({ user }: { user: User }) {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Documents</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-6">
              <li className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black">
                    <Download className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Step 1: Download the Software</h3>
                  <p className="text-muted-foreground mb-2">
                    Begin by downloading the latest version of our software from the Dashboard tab. Choose the version that matches your operating system (Windows, macOS, or Linux).
                  </p>
                  <div className="pl-4 border-l-2 border-gray-200 text-sm">
                    <p className="mb-1"><strong>Tip:</strong> Always use the latest version to ensure you have all the features and security updates.</p>
                  </div>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black">
                    <Key className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Step 2: Get Your License Key</h3>
                  <p className="text-muted-foreground mb-2">
                    Copy your license key from the Dashboard tab. This key is required to activate the full features of the software.
                  </p>
                  <div className="pl-4 border-l-2 border-gray-200 text-sm">
                    <p className="mb-1"><strong>Note:</strong> Your license key is tied to your subscription. Make sure to keep it private and secure.</p>
                  </div>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black">
                    <Settings className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Step 3: Install and Activate</h3>
                  <p className="text-muted-foreground mb-2">
                    Install the software on your computer and launch it. When prompted, enter your license key to activate all premium features.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-sm mb-2">
                    <p className="font-mono text-xs">Installation Path (recommended):</p>
                    <p className="font-mono text-xs mt-1">Windows: C:\Program Files\YourApp</p>
                    <p className="font-mono text-xs mt-1">macOS: /Applications/YourApp.app</p>
                    <p className="font-mono text-xs mt-1">Linux: /opt/YourApp</p>
                  </div>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black">
                    <Book className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Step 4: Explore Features</h3>
                  <p className="text-muted-foreground mb-2">
                    With your software activated, you can now explore all the features. Refer to the user manual for detailed instructions on each feature.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <h4 className="font-medium mb-1">For Free Plan Users</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          Basic functionality
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          Limited storage
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <h4 className="font-medium mb-1">For Premium Users</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          Advanced features
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          Unlimited storage
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          Priority support
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  How do I update my software?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  You can update by downloading the latest version from the Dashboard and installing it over your existing installation. Your settings and data will be preserved.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  Can I use my license on multiple devices?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  Yes, your license can be used on up to {user.planName === 'Premium' ? '5' : '2'} devices simultaneously, depending on your subscription plan.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  What happens if my subscription expires?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  When your subscription expires, you'll still have access to basic features, but premium features will be disabled until you renew your subscription.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  How do I get technical support?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  For technical support, please email support@example.com or use the in-app support feature. Premium users receive priority support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 