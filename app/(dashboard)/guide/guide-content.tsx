"use client";

import {
  CheckCircle2,
  Book,
  Download,
  Settings,
  CreditCard,
  Terminal,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GuideContent() {
  return (
    <main className="flex-1">
      <section className="py-16">
        <div className="px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              IPTRADE User Guide
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-4 md:max-w-3xl">
              Learn how to use IPTRADE to copy trades between MetaTrader
              platforms while maintaining IP integrity
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section>
        <div className="px-4 pb-16">
          <div className="rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 pb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Getting Started with IPTRADE
              </h2>

              <ol className="space-y-8">
                <li className="flex">
                  <div className="flex-shrink-0 mr-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                      <Download className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Step 1: Download & Install IPTRADE
                    </h3>
                    <p className="text-base text-gray-500 mb-3">
                      Begin by downloading the IPTRADE software that matches
                      your operating system from the Dashboard tab. This
                      software will enable you to copy trades between different
                      MetaTrader platforms.
                    </p>
                    <div className="pl-4 border-l-2 border-gray-200 text-sm bg-gray-50 p-3 rounded-lg">
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
                  <div className="flex-shrink-0 mr-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                      <Terminal className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Step 2: Configure Master Account
                    </h3>
                    <p className="text-base text-gray-500 mb-3">
                      Launch your primary MetaTrader platform (MT4 or MT5) and
                      open the IPTRADE software. In the software, select this
                      platform as your "Master" account - this is the account
                      from which trades will be copied.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <p className="font-medium mb-2">Master Configuration:</p>
                      <ol className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>In IPTRADE, click "Add Master Account"</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>Select your MetaTrader version (MT4/MT5)</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>
                            Enter account name (e.g., "My Prop Firm Master")
                          </span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>
                            Click "Connect" and verify connection status
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 mr-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                      <CreditCard className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Step 3: Configure Slave Accounts
                    </h3>
                    <p className="text-base text-gray-500 mb-3">
                      Launch your secondary MetaTrader platform(s) and configure
                      them as "Slave" accounts in the IPTRADE software. These
                      are the accounts that will receive and execute the trades
                      from your Master account.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <p className="font-medium mb-2">Slave Configuration:</p>
                      <ol className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>In IPTRADE, click "Add Slave Account"</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>Select your MetaTrader version (MT4/MT5)</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>
                            Enter account name (e.g., "My Prop Firm Slave")
                          </span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>
                            Set lot size ratio if needed (e.g., 0.5 for half the
                            size)
                          </span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>
                            Click "Connect" and verify connection status
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 mr-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                      <Settings className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Step 4: Configure Copying Settings
                    </h3>
                    <p className="text-base text-gray-500 mb-3">
                      Fine-tune your trade copying settings to match your
                      trading strategy and risk management preferences.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-base mb-2">
                          Basic Settings
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            <span>Copy market orders</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            <span>Copy pending orders</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            <span>Copy stop loss & take profit</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg">
                        <h4 className="font-bold text-base mb-2">
                          Advanced Settings
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            <span>Custom lot sizing</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            <span>Symbol mapping (for different brokers)</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            <span>
                              Standard latency mode (Ultra-low latency in
                              Premium)
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 mr-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">
                      <Zap className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Step 5: Start Copy Trading
                    </h3>
                    <p className="text-base text-gray-500 mb-3">
                      After configuring both Master and Slave accounts, click
                      the "Start Copying" button in the IPTRADE software. All
                      trades executed on your Master account will now be
                      automatically copied to your Slave accounts with minimal
                      latency.
                    </p>
                    <div className="mt-4">
                      <Button
                        asChild
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <Link href="/dashboard">
                          Download IPTRADE
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="pb-12 pt-4 ">
        <div>
          <div className="text-center mb-12 px-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Advanced Features
            </h2>
            <p className="mt-2 max-w-2xl mx-auto text-base text-gray-500">
              Discover the powerful capabilities that make IPTRADE the leading
              solution for prop firm traders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Risk Management
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Custom Lot Sizing</p>
                    <p className="text-gray-500 text-sm">
                      Automatically adjust position sizes based on your risk
                      tolerance for each account.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">
                      Maximum Open Positions
                    </p>
                    <p className="text-gray-500 text-sm">
                      Set limits on the total number of positions that can be
                      open simultaneously.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Account Protection</p>
                    <p className="text-gray-500 text-sm">
                      Implement maximum daily loss limits to protect your
                      accounts.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center mb-3">
                <Book className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Compatibility
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Multi-Broker Support</p>
                    <p className="text-gray-500 text-sm">
                      Copy trades between different brokers with automatic
                      symbol mapping.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Multi-Platform</p>
                    <p className="text-gray-500 text-sm">
                      Copy between MT4 and MT5 platforms seamlessly.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">
                      Prop Firm Optimization
                    </p>
                    <p className="text-gray-500 text-sm">
                      Special settings designed for prop firm challenge and
                      evaluation accounts.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="p-12 pb-20">
        <div className="px-4 text-center">
          <h2 className="text-3xl font-bold">
            Ready to transform your trading?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-300">
            Join thousands of traders who are already using IPTRADE to copy
            trades between platforms while maintaining IP integrity.
          </p>
          <div className="mt-8">
            <Button asChild className="bg-white text-black hover:bg-gray-100">
              <Link href="/dashboard">
                Get started today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
