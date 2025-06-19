"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import "highlight.js/styles/github.css";
import { Bot, MessageCircle, RotateCcw, Send, User } from "lucide-react";
import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How can I start using the platform?",
    answer:
      "To start using IPTRADE, you first need to create an account and select a plan that fits your needs. Once registered, you can download our software and follow the initial setup guide in your dashboard.",
  },
  {
    question: "What plans and pricing are available?",
    answer:
      "We offer three main plans:\n\n• **Premium**: Perfect for individual traders\n• **Unlimited**: For traders with multiple accounts\n• **Managed VPS**: Includes managed VPS\n\nYou can see all details and pricing in the 'Pricing' section of your dashboard.",
  },
  {
    question: "What should I do if my bots stopped working?",
    answer:
      "If your bots stopped working, follow these steps:\n\n1. Check your internet connection\n2. Verify that your subscription is active\n3. Check the logs in the dashboard\n4. Restart the IPTRADE software\n5. If the problem persists, contact technical support",
  },
  {
    question: "My bot is correctly configured but doesn't work, what can I do?",
    answer:
      "If your bot is configured but not working:\n\n1. Verify that broker credentials are correct\n2. Make sure the market is open\n3. Check that there are no restrictions on your broker account\n4. Check the risk configuration\n5. Verify error logs in real time",
  },
  {
    question: "How can I check the status of my bots?",
    answer:
      "You can check your bots' status in real time from your dashboard:\n\n1. Go to the 'Trading Accounts' section\n2. Here you'll see each account's status (Synchronized, Pending, Error, Offline)\n3. Color indicators help you quickly identify status\n4. Click on any account to see specific details",
  },
  {
    question: "The QR doesn't work for me? It stays loading",
    answer:
      "If the QR stays loading:\n\n1. Make sure you have a stable internet connection\n2. Close and reopen the application\n3. Clear your browser cache\n4. Verify you have the latest software version\n5. If it persists, try from another device or browser",
  },
  {
    question: "The QR doesn't load and stays blank?",
    answer:
      "To fix the blank QR:\n\n1. Refresh the page (F5)\n2. Temporarily disable your antivirus/firewall\n3. Verify that JavaScript is enabled\n4. Try in incognito mode\n5. If using VPN, disconnect it temporarily",
  },
  {
    question: "How can I duplicate my bot?",
    answer:
      'To duplicate your bot, you can follow these steps:\n\n**Access your bot configuration.**\n\nGo to the "**Manage**" section.\n\nSelect the "**Duplicate project**" option.\n\nThis will create an exact copy of your current configuration that you can modify according to your needs.',
  },
  {
    question:
      "I made the payment but my account is still in sandbox mode, what happens?",
    answer:
      "If you made the payment but your account is still in sandbox:\n\n1. Payments may take up to 24 hours to process\n2. Verify that payment was completed in your bank/card\n3. Check your email for payment confirmations\n4. If more than 24 hours have passed, contact support with your transaction number",
  },
  {
    question: "Can you review my account status?",
    answer:
      "Of course, our team can review your account status. For a faster review:\n\n1. Send a support ticket from your dashboard\n2. Include your registration email\n3. Describe the specific problem\n4. Our team will respond in less than 24 hours",
  },
  {
    question: "What is the process to request an invoice?",
    answer:
      "To request an invoice:\n\n1. Go to your dashboard in the 'Billing' section\n2. Click 'Download Invoice' on the corresponding payment\n3. If you need an invoice with specific tax data, contact support\n4. Invoices are automatically generated after each successful payment",
  },
  {
    question: "Where can I find video tutorials on using the platform?",
    answer:
      "You can find video tutorials at:\n\n1. **Dashboard**: 'Guide' section with step-by-step videos\n2. **YouTube**: Official IPTRADE channel\n3. **Help Center**: Complete documentation with videos\n4. **Webinars**: Regularly scheduled live sessions\n\nAll are available in English and constantly updated.",
  },
];

// Componente para renderizar markdown con estilos personalizados
const MarkdownMessage = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        // Estilos para diferentes elementos
        h1: ({ children }) => (
          <h1 className="text-lg font-bold mb-2 text-foreground">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold mb-2 text-foreground">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mb-1 text-foreground">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-4 mb-2 space-y-1">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-relaxed">{children}</li>
        ),
        code: ({ inline, children, ...props }) =>
          inline ? (
            <code
              className="bg-muted/50 text-foreground px-1 py-0.5 rounded text-xs font-mono"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code
              className="block bg-muted/50 text-foreground p-2 rounded text-xs font-mono overflow-x-auto"
              {...props}
            >
              {children}
            </code>
          ),
        pre: ({ children }) => (
          <pre className="bg-muted/50 p-2 rounded mb-2 overflow-x-auto">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-muted-foreground/20 pl-3 italic mb-2 text-muted-foreground">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-2">
            <table className="min-w-full border border-muted-foreground/20 text-xs">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-muted-foreground/20 px-2 py-1 bg-muted/30 font-semibold text-left">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-muted-foreground/20 px-2 py-1">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export function SupportChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm the IPTRADE support assistant. How can I help you today? You can click on any frequently asked question or write your query directly.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // Busca el viewport interno del ScrollArea
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLElement;
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const sendToOpenAI = async (message: string): Promise<string> => {
    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fallback) {
          // Si hay un error pero podemos dar una respuesta de fallback
          return data.error;
        }
        throw new Error(data.error || "Error processing the query");
      }

      return data.response;
    } catch (error) {
      console.error("Error sending message to OpenAI:", error);

      // Fallback response in case of error
      return "Sorry, I'm experiencing technical difficulties at the moment. Please try again in a few minutes or contact our support team directly if the problem persists.";
    }
  };

  const handleSendMessage = async (text: string) => {
    if (text.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Scroll to bottom after adding user message
    setTimeout(scrollToBottom, 100);

    try {
      // Send to OpenAI
      const response = await sendToOpenAI(text);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);

      // Scroll to bottom after adding bot response
      setTimeout(scrollToBottom, 200);
    } catch (error) {
      console.error("Error getting response:", error);

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your query at this time. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);

      // Scroll to bottom after adding error response
      setTimeout(scrollToBottom, 200);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFAQClick = (faq: FAQ) => {
    handleSendMessage(faq.question);
  };

  const clearConversation = async () => {
    try {
      await fetch("/api/support/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "clear" }),
      });

      // Reset local messages
      setMessages([
        {
          id: "1",
          text: "Hello! I'm the IPTRADE support assistant. How can I help you today? You can click on any frequently asked question or write your query directly.",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error clearing conversation:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div className="px-4 mx-auto space-y-6">
      {/* Chat Interface */}
      <Card className="h-[800px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              AI Support Assistant
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Beta version - Help improve my responses by leaving your feedback
          </p>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.isBot
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <div className="text-sm">
                      {message.isBot ? (
                        <MarkdownMessage content={message.text} />
                      ) : (
                        <div className="whitespace-pre-line">
                          {message.text}
                        </div>
                      )}
                    </div>
                    <div className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {!message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {/* Show FAQ suggestions when there are only initial messages */}
              {messages.length <= 1 && (
                <div className="space-y-3 mt-6">
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted text-foreground rounded-lg px-4 py-3 max-w-[85%]">
                      <div className="text-sm font-medium mb-3">
                        Here are some frequently asked questions to get you
                        started:
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {faqs.slice(0, 6).map((faq, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="justify-start text-left h-auto p-3 whitespace-normal text-xs hover:bg-primary/5"
                            onClick={() => handleFAQClick(faq)}
                          >
                            {faq.question}
                          </Button>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-3">
                        Click on any question above or type your own question
                        below.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Form */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputMessage(e.target.value)
                }
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isTyping || inputMessage.trim() === ""}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
