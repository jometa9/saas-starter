import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Terminal } from "../(dashboard)/terminal";

export default function ContactPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Get in Touch
            </h1>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Left Column */}
            <form className="space-y-6 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-2 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-2 border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-2 border-gray-200"
                />
              </div>
            </form>

            {/* Right Column with Message and Terminal */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Type your message here..."
                  className="w-full px-4 py-2 border-gray-200 h-35"
                />
              </div>

              <Button className="w-full py-6 text-lg bg-black hover:bg-gray-800 text-white cursor-pointer">
                Send Message
              </Button>
            </div>
          </div>
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
