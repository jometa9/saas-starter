'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Code,
  CreditCard,
  FileJson,
  Fingerprint,
  Lock,
  Terminal,
  Layers,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const DocsContent = ({ activeTab }: { activeTab: string }) => {
  switch (activeTab) {
    case 'getting-started':
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Getting Started</h2>
          <p>This guide will help you set up and configure your SaaS starter project for development and production.</p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Installation</h3>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">git clone https://github.com/yourusername/saas-starter.git</code>
            </div>
            <p>Install dependencies:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">cd saas-starter<br/>npm install</code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Environment Setup</h3>
            <p>Create a <code>.env.local</code> file in the root of your project with the following variables:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                DATABASE_URL="your-postgres-connection-string"<br/>
                NEXTAUTH_SECRET="your-nextauth-secret"<br/>
                STRIPE_SECRET_KEY="your-stripe-secret-key"<br/>
                STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"<br/>
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
              </code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Database Setup</h3>
            <p>Run the following command to set up your database:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">npx prisma migrate dev</code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Running the Application</h3>
            <p>Start the development server:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">npm run dev</code>
            </div>
            <p>Your application should now be running at <code>http://localhost:3000</code>.</p>
          </div>
        </div>
      );
    case 'api-usage':
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">API Usage</h2>
          <p>The SaaS Starter provides several APIs for integrating with your frontend or desktop applications.</p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Authentication</h3>
            <p>Authenticate requests using JWT tokens. Include the token in your Authorization header:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                GET /api/protected-route<br/>
                Authorization: Bearer [your-jwt-token]
              </code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">License Validation</h3>
            <p>Validate a license key:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                POST /api/license/validate<br/>
                {'{'}<br/>
                {'  '}"licenseKey": "xxxx-xxxx-xxxx-xxxx",<br/>
                {'  '}"appVersion": "1.0.0" // optional<br/>
                {'}'}
              </code>
            </div>
            <p>Response:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                {'{'}<br/>
                {'  '}"valid": true,<br/>
                {'  '}"message": "License is valid",<br/>
                {'  '}"subscription": {'{'}<br/>
                {'    '}"status": "active",<br/>
                {'    '}"plan": "pro",<br/>
                {'    '}"validUntil": "2023-12-31T23:59:59Z"<br/>
                {'  }'}<br/>
                {'}'}
              </code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Version Check</h3>
            <p>Check if an app version is current:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                GET /api/version?current=1.0.0
              </code>
            </div>
            <p>Response:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                {'{'}<br/>
                {'  '}"current": false,<br/>
                {'  '}"latest": "1.1.0",<br/>
                {'  '}"downloadUrl": "https://example.com/download/latest"<br/>
                {'}'}
              </code>
            </div>
          </div>
        </div>
      );
    case 'subscription-management':
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Subscription Management</h2>
          <p>Learn how to manage user subscriptions and integrate with Stripe for payment processing.</p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Creating Subscriptions</h3>
            <p>Users can subscribe to your service through the dashboard:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Navigate to the dashboard and click "Upgrade Plan"</li>
              <li>Select a subscription plan</li>
              <li>Complete the payment process through Stripe</li>
              <li>The system will automatically generate a license key</li>
            </ol>
            
            <h3 className="text-xl font-semibold mt-6">Webhook Integration</h3>
            <p>Set up Stripe webhooks to handle subscription events:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                # In your Stripe dashboard, add this webhook endpoint:<br/>
                https://your-domain.com/api/webhooks/stripe
              </code>
            </div>
            <p>Events to listen for:</p>
            <ul className="list-disc pl-6">
              <li>customer.subscription.created</li>
              <li>customer.subscription.updated</li>
              <li>customer.subscription.deleted</li>
              <li>invoice.paid</li>
              <li>invoice.payment_failed</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">Managing Subscriptions</h3>
            <p>Administrators can manage user subscriptions through the admin dashboard:</p>
            <ul className="list-disc pl-6">
              <li>View all active subscriptions</li>
              <li>Manually extend or revoke subscriptions</li>
              <li>Generate new license keys</li>
              <li>Apply promotional offers or discounts</li>
            </ul>
          </div>
        </div>
      );
    case 'license-key-validation':
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">License Key Validation</h2>
          <p>Implement license key validation in your desktop or mobile applications.</p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">License Key Format</h3>
            <p>License keys follow this format: <code>XXXX-XXXX-XXXX-XXXX</code></p>
            <p>Each key is tied to a specific subscription and can include metadata such as:</p>
            <ul className="list-disc pl-6">
              <li>User identifier</li>
              <li>Subscription plan</li>
              <li>Expiration date</li>
              <li>Allowed features</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">Validation Flow</h3>
            <p>Follow this flow to validate licenses in your application:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>User enters the license key in your application</li>
              <li>Application makes an API call to the validation endpoint</li>
              <li>Server verifies the license key against the database</li>
              <li>Response indicates validity and provides subscription details</li>
              <li>Application enables features based on the subscription plan</li>
            </ol>
            
            <h3 className="text-xl font-semibold mt-6">Offline Validation</h3>
            <p>For applications that need offline validation:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Implement a local caching mechanism for validation results</li>
              <li>Require online validation at least once every 7 days</li>
              <li>Store the last successful validation date</li>
              <li>Implement grace periods for temporary connectivity issues</li>
            </ol>
            
            <h3 className="text-xl font-semibold mt-6">Security Considerations</h3>
            <p>To prevent license key abuse:</p>
            <ul className="list-disc pl-6">
              <li>Implement device fingerprinting to limit activations</li>
              <li>Use secure storage for license information</li>
              <li>Obfuscate your validation code</li>
              <li>Implement server-side rate limiting for validation requests</li>
            </ul>
          </div>
        </div>
      );
    case 'desktop-integration':
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Desktop Integration</h2>
          <p>Learn how to integrate your SaaS backend with desktop applications using Electron, Tauri, or similar frameworks.</p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Electron Integration</h3>
            <p>To integrate with Electron:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                // In your Electron app<br/>
                const {'{ net }'} = require('electron');<br/>
                <br/>
                async function validateLicense(licenseKey) {'{'}<br/>
                {'  '}const request = net.request({'{'}<br/>
                {'    '}method: 'POST',<br/>
                {'    '}url: 'https://your-saas-domain.com/api/license/validate'<br/>
                {'  }'});<br/>
                {'  '}<br/>
                {'  '}request.setHeader('Content-Type', 'application/json');<br/>
                {'  '}<br/>
                {'  '}return new Promise((resolve, reject) => {'{'}<br/>
                {'    '}request.on('response', (response) => {'{'}<br/>
                {'      '}let data = '';<br/>
                {'      '}<br/>
                {'      '}response.on('data', (chunk) => {'{'}<br/>
                {'        '}data += chunk;<br/>
                {'      }'});<br/>
                {'      '}<br/>
                {'      '}response.on('end', () => {'{'}<br/>
                {'        '}resolve(JSON.parse(data));<br/>
                {'      }'});<br/>
                {'    }'});<br/>
                {'    '}<br/>
                {'    '}request.on('error', (error) => {'{'}<br/>
                {'      '}reject(error);<br/>
                {'    }'});<br/>
                {'    '}<br/>
                {'    '}request.write(JSON.stringify({'{'} licenseKey {'}'}));<br/>
                {'    '}request.end();<br/>
                {'  }'});<br/>
                {'}'}
              </code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Tauri Integration</h3>
            <p>For Tauri applications:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                // In your Tauri app<br/>
                import {'{ fetch }'} from '@tauri-apps/api/http';<br/>
                <br/>
                async function validateLicense(licenseKey) {'{'}<br/>
                {'  '}try {'{'}<br/>
                {'    '}const response = await fetch(<br/>
                {'      '}'https://your-saas-domain.com/api/license/validate',<br/>
                {'      '}{'{'}<br/>
                {'        '}method: 'POST',<br/>
                {'        '}headers: {'{'} 'Content-Type': 'application/json' {'}'},<br/>
                {'        '}body: JSON.stringify({'{'} licenseKey {'}'})<br/>
                {'      '}{'}'}
                {'    '})<br/>
                {'    '}<br/>
                {'    '}return response.data;<br/>
                {'  }'} catch (error) {'{'}<br/>
                {'    '}console.error('License validation failed:', error);<br/>
                {'    '}return {'{'} valid: false, message: 'Validation request failed' {'}'};<br/>
                {'  }'}<br/>
                {'}'}
              </code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Auto-Update Integration</h3>
            <p>Implement auto-updates using the version API:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                // Check for updates<br/>
                async function checkForUpdates(currentVersion) {'{'}<br/>
                {'  '}try {'{'}<br/>
                {'    '}const response = await fetch(<br/>
                {'      '}{'`https://your-saas-domain.com/api/version?current=${currentVersion}`'}<br/>
                {'    '});<br/>
                {'    '}const data = await response.json();<br/>
                {'    '}<br/>
                {'    '}if (!data.current) {'{'}<br/>
                {'      '}// Prompt user to update<br/>
                {'      '}showUpdateDialog(data.latest, data.downloadUrl);<br/>
                {'    }'}<br/>
                {'  }'} catch (error) {'{'}<br/>
                {'    '}console.error('Update check failed:', error);<br/>
                {'  }'}<br/>
                {'}'}
              </code>
            </div>
          </div>
        </div>
      );
    case 'version-checking':
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Version Checking</h2>
          <p>Implement version checking to ensure users are running the latest version of your application.</p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Version API</h3>
            <p>The version API allows you to check if a client is running the latest version:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                GET /api/version?current=1.0.0
              </code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Response Format</h3>
            <p>The API returns information about the current version status:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                {'{'}<br/>
                {'  '}"current": boolean,    // Whether the provided version is current<br/>
                {'  '}"latest": string,      // The latest version available<br/>
                {'  '}"downloadUrl": string, // URL to download the latest version<br/>
                {'  '}"notes": string,       // Release notes (optional)<br/>
                {'  '}"critical": boolean    // Whether this is a critical update (optional)<br/>
                {'}'}
              </code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Version Management</h3>
            <p>Administrators can manage application versions through the admin dashboard:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Navigate to the admin dashboard</li>
              <li>Go to the "App Versions" section</li>
              <li>Add a new version with version number, download URL, and release notes</li>
              <li>Mark versions as current or critical</li>
            </ol>
            
            <h3 className="text-xl font-semibold mt-6">Client Implementation</h3>
            <p>Implement version checking in your client applications:</p>
            <div className="bg-slate-950 p-4 rounded-md">
              <code className="text-green-400">
                // Regular version check example<br/>
                async function checkVersion() {'{'}<br/>
                {'  '}try {'{'}<br/>
                {'    '}const appVersion = "1.0.0"; // Your app's current version<br/>
                {'    '}const response = await fetch({'`https://your-domain.com/api/version?current=${appVersion}`'});<br/>
                {'    '}const data = await response.json();<br/>
                {'    '}<br/>
                {'    '}if (!data.current) {'{'}<br/>
                {'      '}console.log({'`New version available: ${data.latest}`'});<br/>
                {'      '}console.log({'`Download URL: ${data.downloadUrl}`'});<br/>
                {'      '}<br/>
                {'      '}// Prompt user to update<br/>
                {'      '}if (data.critical) {'{'}<br/>
                {'        '}// Force update for critical versions<br/>
                {'        '}showForcedUpdateDialog(data);<br/>
                {'      }'} else {'{'}<br/>
                {'        '}// Suggest update for non-critical versions<br/>
                {'        '}showUpdateSuggestionDialog(data);<br/>
                {'      }'}<br/>
                {'    }'}<br/>
                {'  }'} catch (error) {'{'}<br/>
                {'    '}console.error("Failed to check for updates:", error);<br/>
                {'  }'}<br/>
                {'}'}
              </code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Semver Compliance</h3>
            <p>The version checking system follows semantic versioning (semver) principles:</p>
            <ul className="list-disc pl-6">
              <li>MAJOR version for incompatible API changes</li>
              <li>MINOR version for new functionality in a backward compatible manner</li>
              <li>PATCH version for backward compatible bug fixes</li>
            </ul>
          </div>
        </div>
      );
    default:
      return <div>Select a topic from the sidebar to view documentation.</div>;
  }
};

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // En una implementación real, aquí enviarías los datos a tu backend
    console.log({ feedback, comment });
  };
  
  if (isSubmitted) {
    return (
      <div className="mt-8 p-4 bg-green-50 border border-green-100 rounded-lg">
        <p className="text-green-700 font-medium">¡Gracias por tu feedback!</p>
        <p className="text-green-600 text-sm">Tu opinión nos ayuda a mejorar nuestra documentación.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-lg">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-slate-600" />
        ¿Te ha resultado útil esta documentación?
      </h3>
      
      <div className="flex gap-4 mt-4">
        <Button 
          variant={feedback === 'helpful' ? 'default' : 'outline'} 
          className="flex items-center gap-2"
          onClick={() => setFeedback('helpful')}
        >
          <ThumbsUp className="h-4 w-4" />
          Sí, me ha ayudado
        </Button>
        
        <Button 
          variant={feedback === 'not-helpful' ? 'default' : 'outline'} 
          className="flex items-center gap-2"
          onClick={() => setFeedback('not-helpful')}
        >
          <ThumbsDown className="h-4 w-4" />
          No me ha ayudado
        </Button>
      </div>
      
      {feedback && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-2">
            <Label htmlFor="comment">¿Tienes algún comentario adicional?</Label>
            <Textarea 
              id="comment" 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              className="w-full" 
              placeholder="Dinos cómo podemos mejorar..." 
            />
          </div>
          
          <Button type="submit" className="mt-4">
            Enviar feedback
          </Button>
        </form>
      )}
    </div>
  );
};

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('getting-started');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-gray-900 hover:text-gray-600">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                    <span>Documentation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="flex flex-col space-y-1">
                    <Button
                      variant={activeTab === 'getting-started' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('getting-started')}
                    >
                      Getting Started
                    </Button>
                    <Button
                      variant={activeTab === 'api-usage' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('api-usage')}
                    >
                      API Usage
                    </Button>
                    <Button
                      variant={activeTab === 'subscription' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('subscription')}
                    >
                      Subscription Management
                    </Button>
                    <Button
                      variant={activeTab === 'license-key' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('license-key')}
                    >
                      License Key Validation
                    </Button>
                    <Button
                      variant={activeTab === 'desktop-integration' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('desktop-integration')}
                    >
                      Desktop Integration
                    </Button>
                    <Button
                      variant={activeTab === 'version-check' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('version-check')}
                    >
                      Version Checking
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:w-3/4">
            <Card className="h-full">
              <CardContent className="p-6">
                <DocsContent activeTab={activeTab} />
                <FeedbackForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 