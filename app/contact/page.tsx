"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about IPTRADE or need help with your setup? Our
              team is here to help you get the most out of your trade copying
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Form Left Column */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full px-4 py-2 border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-4 py-2 border-gray-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full px-4 py-2 border-gray-200"
                  required
                />
              </div>
            </div>

            {/* Right Column with Message and Terminal */}
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-2 border-gray-200 h-32"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-lg bg-black hover:bg-gray-800 text-white cursor-pointer"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ CTA Section */}
      <section className="py-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Looking for quick answers?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Check out our frequently asked questions for immediate assistance.
          </p>
          <Button
            variant="outline"
            className="border-black text-black hover:bg-black/5 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center cursor-pointer"
          >
            Visit FAQ
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </section>
    </main>
  );
}
