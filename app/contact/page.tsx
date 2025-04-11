"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Zap } from "lucide-react";
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl text-center font-bold text-gray-900 tracking-tight sm:text-5xl sm:text-left md:text-6xl">
                <span className="italic">Get in</span>
                <span className="block text-black text-gray-500">
                  Touch
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl text-center sm:text-left">
                Have questions about IPTRADE or need help with your setup? Our
                team is here to help you get the most out of your trade copying
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Send us a <span className="text-black">Message</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-4 py-3 border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="w-full px-4 py-3 border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Message
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border-gray-200 rounded-lg h-32"
                required
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border border-blue-600 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-xl cursor-pointer border-2"
              >
                {isLoading ? "Sending..." : "Send Message"}
                <Zap className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ CTA Section */}
      <section className="py-12">
        <div className="px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Looking for <span className="text-black">quick answers</span>?
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Check out our frequently asked questions for immediate assistance.
            </p>
            <div className="mt-10">
              <Button
                variant="outline"
                className="border-black text-black hover:bg-black/5 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center cursor-pointer border-2"
              >
                Visit FAQ
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <p className="text-3xl font-bold text-gray-200 text-center py-12 px-6">
        <i>See you copying trades!</i>
      </p>
    </main>
  );
}
