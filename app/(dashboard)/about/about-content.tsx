"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart3,
  Clock,
  Code2,
  Cpu,
  Globe,
  LineChart,
  Shield,
  Zap,
} from "lucide-react";

export function AboutContent() {
  return (
    <section className="mx-auto px-4 py-4">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold mb-4">About IPTRADE</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The most reliable trade copying solution for MetaTrader platforms
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At IPTRADE, we're dedicated to providing traders with the most
                reliable, fast, and user-friendly trade copying solution for
                MetaTrader platforms. Our goal is to help you manage multiple
                accounts effortlessly while maintaining consistent performance.
              </p>
              <p className="text-muted-foreground">
                Whether you're a prop firm trader juggling multiple accounts, a
                money manager handling client accounts, or simply looking to
                copy your strategies across personal accounts, IPTRADE offers
                the technology you need to succeed.
              </p>
            </div>
            <div className="rounded-lg bg-gray-100 p-6 flex justify-center">
              <div className="w-full h-64 relative flex items-center justify-center">
                <div className="text-4xl font-bold">IPTRADE</div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose IPTRADE?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black">
                        <Zap className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Ultra-Fast Copying</h3>
                      <p className="text-sm text-muted-foreground">
                        Our proprietary technology ensures trade execution with minimal
                        latency, maintaining similar entry prices across all accounts.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black">
                        <Shield className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Complete Security</h3>
                      <p className="text-sm text-muted-foreground">
                        IPTRADE never requires your trading account passwords, accessing
                        only the local terminal data needed for copying.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black">
                        <Globe className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Multi-Broker Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Copy trades between different brokers with automatic symbol
                        mapping and adjustments for different specifications.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black">
                        <Cpu className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Lightweight & Efficient</h3>
                      <p className="text-sm text-muted-foreground">
                        Our software is optimized to use minimal system resources while
                        maintaining maximum performance, even on older computers.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black">
                        <Code2 className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">No EA Required</h3>
                      <p className="text-sm text-muted-foreground">
                        IPTRADE works without requiring any Expert Advisors or scripts
                        to be installed in your MetaTrader platforms.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Advanced Risk Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Customize risk parameters for each account with flexible lot sizing
                        and account protection features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className=" p-4 text-center">
            <h2 className="text-2xl font-bold mb-4 mt-8">Designed for Prop Traders</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              IPTRADE is built with prop firm traders in mind, offering specialized
              features to help you manage multiple challenge and evaluation accounts
              while maintaining consistent performance across all platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/sign-up">Try IPTRADE Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/guide">View User Guide</Link>
              </Button>
            </div>
          </div>
        </div>
    </section>
  );
} 