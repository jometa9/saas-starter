"use client";

import { Book, HelpCircle, Mail } from "lucide-react";
import Link from "next/link";

const SupportCards = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guide Card */}
        <SupportCard
          title="User Guide"
          description="Learn how to set up and use IPTRADE"
          icon={<Book className="h-8 w-8 p-1" />}
          color="green"
          href="/guide"
        />

        {/* FAQs Card */}
        <SupportCard
          title="FAQs"
          description="Find answers to common questions"
          icon={<HelpCircle className="h-8 w-8 p-1" />}
          color="blue"
          href="/faqs"
        />

        {/* Contact Card */}
        <SupportCard
          title="Contact Support"
          description="Get help from our support team"
          icon={<Mail className="h-8 w-8 p-1" />}
          color="purple"
          href="/contact"
        />
      </div>
    </section>
  );
};

interface SupportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "green" | "blue" | "purple";
  href: string;
}

const SupportCard = ({
  title,
  description,
  icon,
  color,
  href,
}: SupportCardProps) => {
  const colorClasses = {
    green: " border-green-200 hover:bg-green-50",
    blue: " border-blue-200 hover:bg-blue-50",
    purple: " border-purple-200 hover:bg-purple-50",
  };

  return (
    <Link href={href} className="block">
      <div
        className={`border-1 rounded-xl p-6 shadow hover:shadow-md transition-all duration-200 h-full ${colorClasses[color]}`}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`rounded-full p-2 ${color === "green" ? "bg-green-100" : color === "blue" ? "bg-blue-100" : "bg-purple-100"}`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SupportCards;
