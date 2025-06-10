"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Toast } from "@/components/ui/toast";

export default function AdminSettingsPage() {
  // Test Emails
  const [isSending, setIsSending] = useState(false);

  // Version Management
  const [isUpdatingVersion, setIsUpdatingVersion] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isCritical, setIsCritical] = useState(false);

  // Mass Email
  const [isSendingMassEmail, setIsSendingMassEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailIsImportant, setEmailIsImportant] = useState(false);

  const [isAssigningSubscription, setIsAssigningSubscription] = useState(false);
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [subscriptionDuration, setSubscriptionDuration] = useState("1");
  const [forceAssign, setForceAssign] = useState(false);
  const [subscriptionWarning, setSubscriptionWarning] = useState<{
    message: string;
    existingSubscription: {
      planName: string;
      status: string;
      isPaid: boolean;
    };
  } | null>(null);

  const availablePlans = [
    { value: "IPTRADE Premium", label: "Premium" },
    { value: "IPTRADE Unlimited", label: "Unlimited" },
    { value: "IPTRADE Managed VPS", label: "Managed VPS" }
  ];

  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentVersion = async () => {
      try {
        const response = await fetch("/api/admin/version");
        if (response.ok) {
          const data = await response.json();
          setCurrentVersion(data.version);
        }
      } catch (error) {
        
      }
    };

    fetchCurrentVersion();
  }, []); // Array vacío para que solo se ejecute una vez al montar el componente

  // Handler para enviar emails de prueba
  const handleTestEmails = async () => {
    try {
      setIsSending(true);
      const response = await fetch("/api/admin/test-emails", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test emails");
      }

      toast({
        title: "Success",
        description: "Test emails sent successfully! Check your inbox.",
      });
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send test emails. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handler para actualizar la versión
  const handleUpdateVersion = async () => {
    try {
      if (!newVersion) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a new version",
        });
        return;
      }

      // Validar formato de versión (x.y.z)
      const versionRegex = /^\d+\.\d+\.\d+$/;
      if (!versionRegex.test(newVersion)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid version format. Use x.y.z format.",
        });
        return;
      }

      setIsUpdatingVersion(true);
      const response = await fetch("/api/admin/version", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: newVersion,
          releaseNotes,
          downloadUrl,
          isCritical,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update version");
      }

      // Usar el nombre de campo correcto de la respuesta
      const updatedVersion = data.newVersion || data.version;

      // Mostrar los toasts para confirmar la actualización
      toast({
        title: "Success",
        description: `Version updated to ${updatedVersion}`,
      });

      // Toast separado para el envío de emails
      toast({
        title: "Success",
        description: "Email notifications sent to users",
      });

      setCurrentVersion(updatedVersion);
      setNewVersion("");
      setReleaseNotes("");
      setDownloadUrl("");
      setIsCritical(false);
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update version. Please try again.",
      });
    } finally {
      setIsUpdatingVersion(false);
    }
  };

  // Handler para enviar email masivo
  const handleSendMassEmail = async () => {
    try {
      if (!emailSubject || !emailMessage) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Subject and message are required"
        });
        return;
      }
      
      setIsSendingMassEmail(true);
      const response = await fetch("/api/admin/mass-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: emailSubject,
          message: emailMessage,
          isImportant: emailIsImportant
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send mass email");
      }

      if (data.warning) {
        toast({
          variant: "warning",
          title: "Warning",
          description: data.message
        });
      } else {
        toast({
          title: "Success",
          description: data.message || "Mass email sent successfully!"
        });
        // Resetear el formulario
        setEmailSubject("");
        setEmailMessage("");
        setEmailIsImportant(false);
      }
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send mass email. Please try again."
      });
    } finally {
      setIsSendingMassEmail(false);
    }
  };

  // Handler para asignar suscripción gratuita
  const handleAssignFreeSubscription = async () => {
    try {
      setIsAssigningSubscription(true);
      setSubscriptionWarning(null);

      if (!subscriptionEmail || !subscriptionPlan || !subscriptionDuration) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all fields"
        });
        return;
      }

      const response = await fetch("/api/admin/assign-free-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: subscriptionEmail,
          plan: subscriptionPlan,
          duration: parseInt(subscriptionDuration, 10),
          force: forceAssign,
        }),
      });

      const data = await response.json();

      if (response.status === 409 && data.warning) {
        // Usuario tiene una suscripción activa, mostrar advertencia
        setSubscriptionWarning({
          message: data.message,
          existingSubscription: data.existingSubscription,
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign free subscription");
      }

      // Si había una advertencia previa, limpiarla
      setSubscriptionWarning(null);

      toast({
        title: "Success",
        description: data.message || `Free ${subscriptionPlan} subscription assigned successfully!`
      });

      // Resetear el formulario solo en caso de éxito
      setSubscriptionEmail("");
      setSubscriptionPlan("");
      setSubscriptionDuration("1");
      setForceAssign(false);
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign free subscription. Please try again."
      });
    } finally {
      setIsAssigningSubscription(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <Tabs defaultValue="version" className="space-y-6 mb-0 pb-0">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="version">Version</TabsTrigger>
          <TabsTrigger value="email">Emails</TabsTrigger>
          <TabsTrigger value="mass-email">Mass Email</TabsTrigger>
          <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
        </TabsList>

        {/* Tab de Gestión de Versiones */}
        <TabsContent value="version">
          <Card>
            <CardHeader>
              <CardTitle>Version Management</CardTitle>
              <CardDescription>
                Update application version and notify users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-sm font-medium mb-1">Current Version</h3>
                <p className="text-lg font-semibold">
                  {currentVersion || "Loading..."}
                </p>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="version">New Version</Label>
                <Input
                  id="version"
                  placeholder="1.0.0"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use semantic versioning: X.Y.Z (example: 1.0.0)
                </p>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="release-notes">Release Notes</Label>
                <Textarea
                  id="release-notes"
                  placeholder="Detail the changes included in this version..."
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This information will be sent to users via email.
                </p>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="download-url">Download URL (optional)</Label>
                <Input
                  id="download-url"
                  placeholder="https://example.com/download"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  URL where users can download this version.
                </p>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="critical-update"
                  checked={isCritical}
                  onCheckedChange={(checked) => setIsCritical(checked === true)}
                />
                <Label htmlFor="critical-update">Critical Update</Label>
                <p className="text-xs text-muted-foreground ml-2">
                  Check this option if the update contains important security
                  fixes.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdateVersion}
                disabled={isUpdatingVersion || !newVersion}
                className="w-full"
              >
                {isUpdatingVersion
                  ? "Updating..."
                  : "Update Version and Notify Users"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab de Test Emails */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Send test emails to verify how they look in different email
                clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleTestEmails}
                disabled={isSending}
                className="w-full sm:w-auto"
              >
                {isSending ? "Sending..." : "Send Test Emails"}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will send one email of each type to your admin email
                address.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Mass Email */}
        <TabsContent value="mass-email">
          <Card>
            <CardHeader>
              <CardTitle>Mass Email</CardTitle>
              <CardDescription>
                Send emails to all users or specific groups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  placeholder="Important announcement"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email-message">Message</Label>
                <Textarea
                  id="email-message"
                  placeholder="Your message to users..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-important"
                  checked={emailIsImportant}
                  onCheckedChange={(checked) => {
                    setEmailIsImportant(checked === true);
                  }}
                />
                <Label htmlFor="is-important">Mark as important (adds [IMPORTANT] to subject)</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSendMassEmail}
                disabled={isSendingMassEmail || !emailSubject || !emailMessage}
              >
                {isSendingMassEmail ? "Sending..." : "Send Mass Email"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab de Promotional Free Subscriptions */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Assign Free Subscription</CardTitle>
              <CardDescription>
                Assign free subscription plans to users with specified duration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscriptionWarning && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
                  <p className="font-medium">{subscriptionWarning.message}</p>
                  <p className="text-sm">
                    Current plan: {subscriptionWarning.existingSubscription.planName}
                    <br />
                    Status: {subscriptionWarning.existingSubscription.status}
                    <br />
                    {subscriptionWarning.existingSubscription.isPaid && (
                      <strong>Warning: This is a paid subscription!</strong>
                    )}
                  </p>
                </div>
              )}

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="sub-email">User Email</Label>
                <Input
                  id="sub-email"
                  placeholder="user@example.com"
                  value={subscriptionEmail}
                  onChange={(e) => setSubscriptionEmail(e.target.value)}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="sub-plan">Plan Name</Label>
                <Select
                  value={subscriptionPlan}
                  onValueChange={setSubscriptionPlan}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlans.map((plan) => (
                      <SelectItem key={plan.value} value={plan.value}>
                        {plan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="sub-duration">Duration (months)</Label>
                <Select
                  value={subscriptionDuration}
                  onValueChange={setSubscriptionDuration}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">1 year</SelectItem>
                    <SelectItem value="24">2 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="force-assign"
                  checked={forceAssign}
                  onCheckedChange={(checked) => {
                    setForceAssign(checked === true);
                  }}
                />
                <Label htmlFor="force-assign">
                  Force assign (override existing subscriptions)
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleAssignFreeSubscription}
                disabled={
                  isAssigningSubscription ||
                  !subscriptionEmail ||
                  !subscriptionPlan ||
                  !subscriptionDuration
                }
                className="w-full"
              >
                {isAssigningSubscription
                  ? "Assigning..."
                  : "Assign Free Subscription"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
