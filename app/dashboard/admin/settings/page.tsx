"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminSettingsPage() {
  const [isSending, setIsSending] = useState(false);
  const [isAssigningSubscription, setIsAssigningSubscription] = useState(false);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("");
  const [duration, setDuration] = useState("1");
  const [forceAssign, setForceAssign] = useState(false);
  const [subscriptionWarning, setSubscriptionWarning] = useState<{
    message: string;
    existingSubscription: {
      planName: string;
      status: string;
      isPaid: boolean;
    };
  } | null>(null);

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

      toast.success("Test emails sent successfully! Check your inbox.");
    } catch (error) {
      console.error("Error sending test emails:", error);
      toast.error("Failed to send test emails. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleAssignFreeSubscription = async () => {
    try {
      setIsAssigningSubscription(true);
      setSubscriptionWarning(null);

      if (!email || !plan || !duration) {
        toast.error("Please fill in all fields");
        return;
      }

      const response = await fetch("/api/admin/assign-free-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          plan,
          duration: parseInt(duration, 10),
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

      toast.success(data.message || "Free subscription assigned successfully!");

      // Resetear el formulario solo en caso de éxito
      setEmail("");
      setPlan("");
      setDuration("1");
      setForceAssign(false);
    } catch (error) {
      console.error("Error assigning free subscription:", error);
      toast.error("Failed to assign free subscription. Please try again.");
    } finally {
      setIsAssigningSubscription(false);
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
              This will send one email of each type to your admin email address.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
