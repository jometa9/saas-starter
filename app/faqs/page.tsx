"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight, Zap, Shield, CreditCard, Terminal, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FAQsPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqCategories = [
    {
      id: "general",
      title: "General Questions",
      icon: <HelpCircle className="h-4 w-4 text-white" />,
      questions: [
        {
          id: "what-is-iptrade",
          question: "What is IPTRADE?",
          answer: "IPTRADE is a software solution that allows you to copy trades between different MetaTrader platforms while maintaining the same IP address. This is essential for prop firm traders who need to copy trades between their challenge/evaluation accounts and funded accounts without triggering IP-based restrictions."
        },
        {
          id: "how-it-works",
          question: "How does IPTRADE work?",
          answer: "IPTRADE connects to your MetaTrader platforms and copies trades from a designated 'Master' account to one or more 'Slave' accounts. The software runs locally on your computer, ensuring all trading activities occur from the same IP address. This prevents prop firms from detecting that you're using multiple accounts."
        },
        {
          id: "supported-platforms",
          question: "Which platforms does IPTRADE support?",
          answer: "IPTRADE supports both MetaTrader 4 (MT4) and MetaTrader 5 (MT5) platforms. You can copy trades between MT4 and MT5 accounts, or between accounts on the same platform version."
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Questions",
      icon: <Terminal className="h-4 w-4 text-white" />,
      questions: [
        {
          id: "system-requirements",
          question: "What are the system requirements for IPTRADE?",
          answer: "IPTRADE requires Windows 7/8/10/11, macOS 10.12 or higher, or Linux (Ubuntu 18.04 or higher). The software is lightweight and designed to run alongside your MetaTrader platforms without significant resource usage."
        },
        {
          id: "installation",
          question: "How do I install IPTRADE?",
          answer: "Download the appropriate version for your operating system from the Dashboard tab. Run the installer and follow the on-screen instructions. No special configuration is required during installation."
        },
        {
          id: "latency",
          question: "What is the latency when copying trades?",
          answer: "IPTRADE offers ultra-low latency trade copying, typically executing trades within milliseconds. The Premium plan offers the fastest possible execution with optimized performance settings."
        }
      ]
    },
    {
      id: "account-management",
      title: "Account Management",
      icon: <CreditCard className="h-4 w-4 text-white" />,
      questions: [
        {
          id: "master-slave",
          question: "What is the difference between Master and Slave accounts?",
          answer: "The Master account is the source account from which trades are copied. This is typically your prop firm challenge or evaluation account. Slave accounts are the destination accounts that receive and execute the copied trades, usually your funded accounts."
        },
        {
          id: "multiple-accounts",
          question: "How many accounts can I connect with IPTRADE?",
          answer: "The Basic plan allows you to connect 1 Master account and 2 Slave accounts. The Premium plan supports 1 Master account and up to 10 Slave accounts, allowing for more complex trading setups."
        },
        {
          id: "lot-sizing",
          question: "Can I adjust lot sizes between accounts?",
          answer: "Yes, IPTRADE allows you to set custom lot size ratios for each Slave account. For example, you can configure a Slave account to use 0.5x the lot size of your Master account for more conservative risk management."
        }
      ]
    },
    {
      id: "security",
      title: "Security & Compliance",
      icon: <Shield className="h-4 w-4 text-white" />,
      questions: [
        {
          id: "data-security",
          question: "How secure is my trading data with IPTRADE?",
          answer: "IPTRADE operates entirely on your local machine and does not transmit your trading data to external servers. All trade copying happens directly between your MetaTrader platforms on your computer, ensuring maximum security and privacy."
        },
        {
          id: "prop-firm-compliance",
          question: "Is using IPTRADE compliant with prop firm policies?",
          answer: "IPTRADE is designed to help traders comply with prop firm policies by ensuring all trading activities occur from the same IP address. However, it is your responsibility to review and comply with your specific prop firm's terms of service."
        },
        {
          id: "account-verification",
          question: "Will IPTRADE affect my account verification process?",
          answer: "No, IPTRADE does not interfere with the account verification process. Since all trading activities occur from the same IP address, there should be no issues with account verification."
        }
      ]
    },
    {
      id: "pricing",
      title: "Pricing & Plans",
      icon: <Zap className="h-4 w-4 text-white" />,
      questions: [
        {
          id: "pricing-plans",
          question: "What pricing plans are available?",
          answer: "IPTRADE offers two plans: Basic and Premium. The Basic plan includes essential features for most traders, while the Premium plan offers advanced features like ultra-low latency, priority support, and the ability to connect more Slave accounts."
        },
        {
          id: "trial-period",
          question: "Is there a free trial available?",
          answer: "Yes, IPTRADE offers a 14-day free trial of the Premium plan, allowing you to test all features before committing to a subscription."
        },
        {
          id: "payment-methods",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and cryptocurrency payments for your convenience."
        }
      ]
    }
  ];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-16">
        <div className="px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-4 md:max-w-3xl">
            Find answers to common questions about IPTRADE and how to use our software effectively

            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="pb-8">
        <div className="px-4">
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div key={category.id} className=" rounded-xl shadow-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center mr-3">
                      {category.icon}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {category.questions.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex justify-between items-center p-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <h3 className="font-medium text-sm text-gray-900">{item.question}</h3>
                          {openItems[item.id] ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        {openItems[item.id] && (
                          <div className="p-3 ">
                            <p className="text-sm text-gray-600">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-12 pb-16">
        <div className="px-8">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Still have questions?</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help you with any questions about IPTRADE.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-black hover:bg-gray-800 text-white text-sm">
                <Link href="/contact">
                  Contact Support
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-black text-black hover:bg-gray-100 text-sm">
                <Link href="/guide">
                  View User Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 