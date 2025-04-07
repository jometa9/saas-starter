'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  const [isSending, setIsSending] = useState(false);

  const handleTestEmails = async () => {
    try {
      setIsSending(true);
      const response = await fetch('/api/admin/test-emails', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test emails');
      }

      toast.success('Test emails sent successfully! Check your inbox.');
    } catch (error) {
      console.error('Error sending test emails:', error);
      toast.error('Failed to send test emails. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Send test emails to verify how they look in different email clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleTestEmails} 
              disabled={isSending}
              className="w-full sm:w-auto"
            >
              {isSending ? 'Sending...' : 'Send Test Emails'}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will send one email of each type to your admin email address.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 