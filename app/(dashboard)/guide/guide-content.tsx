"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Book,
  Download,
  Settings,
  CreditCard,
  Terminal,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GuideContent() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">IPTRADE User Guide</h1>
          <p className="text-muted-foreground">
            Learn how to use IPTRADE to copy trades between MetaTrader platforms
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with IPTRADE</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black">
                      <Download className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">
                      Step 1: Download & Install IPTRADE
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Begin by downloading the IPTRADE software that matches your
                      operating system from the Dashboard tab. This software will
                      enable you to copy trades between different MetaTrader
                      platforms.
                    </p>
                    <div className="pl-4 border-l-2 border-gray-200 text-sm">
                      <p className="mb-1">
                        <strong>Note:</strong> The software must be installed on
                        the same computer where your MetaTrader platforms are
                        running to maintain the same IP address for all trading
                        activities.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black">
                      <Terminal className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">
                      Step 2: Configure Master Account
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Launch your primary MetaTrader platform (MT4 or MT5) and
                      open the IPTRADE software. In the software, select this
                      platform as your "Master" account - this is the account from
                      which trades will be copied.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm mb-2">
                      <p className="text-xs">Master Configuration:</p>
                      <p className="text-xs mt-1">
                        1. In IPTRADE, click "Add Master Account"
                      </p>
                      <p className="text-xs mt-1">
                        2. Select your MetaTrader version (MT4/MT5)
                      </p>
                      <p className="text-xs mt-1">
                        3. Enter account name (e.g., "My Prop Firm Master")
                      </p>
                      <p className="text-xs mt-1">
                        4. Click "Connect" and verify connection status
                      </p>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black">
                      <CreditCard className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">
                      Step 3: Configure Slave Accounts
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Launch your secondary MetaTrader platform(s) and configure
                      them as "Slave" accounts in the IPTRADE software. These are
                      the accounts that will receive and execute the trades from
                      your Master account.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm mb-2">
                      <p className="text-xs">Slave Configuration:</p>
                      <p className="text-xs mt-1">
                        1. In IPTRADE, click "Add Slave Account"
                      </p>
                      <p className="text-xs mt-1">
                        2. Select your MetaTrader version (MT4/MT5)
                      </p>
                      <p className="text-xs mt-1">
                        3. Enter account name (e.g., "My Prop Firm Slave")
                      </p>
                      <p className="text-xs mt-1">
                        4. Set lot size ratio if needed (e.g., 0.5 for half the
                        size)
                      </p>
                      <p className="text-xs mt-1">
                        5. Click "Connect" and verify connection status
                      </p>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black">
                      <Settings className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">
                      Step 4: Configure Copying Settings
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Fine-tune your trade copying settings to match your trading
                      strategy and risk management preferences.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium mb-1">Basic Settings</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Copy market orders
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Copy pending orders
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Copy stop loss & take profit
                          </li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium mb-1">Advanced Settings</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Custom lot sizing
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Symbol mapping (for different brokers)
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                            Standard latency mode (Ultra-low latency in Premium)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-black">
                      <Zap className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">
                      Step 5: Start Copy Trading
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      After configuring both Master and Slave accounts, click the
                      "Start Copying" button in the IPTRADE software. All trades
                      executed on your Master account will now be automatically
                      copied to your Slave accounts with minimal latency.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-lg mb-3">Risk Management</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Custom Lot Sizing:</strong> Automatically adjust position sizes based on your risk tolerance for each account.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Maximum Open Positions:</strong> Set limits on the total number of positions that can be open simultaneously.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Account Protection:</strong> Implement maximum daily loss limits to protect your accounts.
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-3">Compatibility</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Multi-Broker Support:</strong> Copy trades between different brokers with automatic symbol mapping.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Multi-Platform:</strong> Copy between MT4 and MT5 platforms seamlessly.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Prop Firm Optimization:</strong> Special settings designed for prop firm challenge and evaluation accounts.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Create an account today and start using IPTRADE to supercharge your trading across multiple MetaTrader accounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/sign-up">Create Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 