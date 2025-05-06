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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl text-center font-bold text-gray-900 tracking-tight sm:text-5xl sm:text-left md:text-6xl">
                <span className="italic">IPTRADE</span>
                <span className="block text-black text-gray-500">
                  User Guide
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl text-center sm:text-left">
                Learn how to use IPTRADE to copy trades between MetaTrader
                platforms while maintaining IP integrity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section>
        <div className="px-6 pb-16">
          <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 pb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Getting Started with IPTRADE
              </h2>

              <ol className="space-y-12">
                <li className="flex">
                  <div className="flex-shrink-0 mr-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg border-4 border-blue-200">
                      <Download className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">
                      Step 1: Download & Install IPTRADE
                    </h3>
                    <p className="text-lg text-gray-500 mb-4">
                      Begin by downloading the IPTRADE software that matches
                      your operating system from the Dashboard tab. This
                      software will enable you to copy trades between different
                      MetaTrader platforms.
                    </p>
                    <div className="pl-4 border-l-2 border-blue-200 text-base bg-blue-50 p-4 rounded-lg">
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
                  <div className="flex-shrink-0 mr-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg border-4 border-purple-200">
                      <Terminal className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">
                      Step 2: Configure Master Account
                    </h3>
                    <p className="text-lg text-gray-500 mb-4">
                      Launch your primary MetaTrader platform (MT4 or MT5) and
                      open the IPTRADE software. In the software, select this
                      platform as your "Master" account - this is the account
                      from which trades will be copied.
                    </p>
                    <div className="bg-purple-50 p-4 rounded-lg text-base">
                      <p className="font-medium mb-3">Master Configuration:</p>
                      <ol className="space-y-3">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>In IPTRADE, click "Add Master Account"</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>Select your MetaTrader version (MT4/MT5)</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>
                            Enter account name (e.g., "My Prop Firm Master")
                          </span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>
                            Click "Connect" and verify connection status
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 mr-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg border-4 border-green-200">
                      <CreditCard className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">
                      Step 3: Configure Slave Accounts
                    </h3>
                    <p className="text-lg text-gray-500 mb-4">
                      Launch your secondary MetaTrader platform(s) and configure
                      them as "Slave" accounts in the IPTRADE software. These
                      are the accounts that will receive and execute the trades
                      from your Master account.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg text-base">
                      <p className="font-medium mb-3">Slave Configuration:</p>
                      <ol className="space-y-3">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>In IPTRADE, click "Add Slave Account"</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>Select your MetaTrader version (MT4/MT5)</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>
                            Enter account name (e.g., "My Prop Firm Slave")
                          </span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>
                            Set lot size ratio if needed (e.g., 0.5 for half the
                            size)
                          </span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span>
                            Click "Connect" and verify connection status
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 mr-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-600 text-white shadow-lg border-4 border-yellow-200">
                      <Settings className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">
                      Step 4: Configure Copying Settings
                    </h3>
                    <p className="text-lg text-gray-500 mb-4">
                      Fine-tune your trade copying settings to match your
                      trading strategy and risk management preferences.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="bg-yellow-50 p-6 rounded-lg">
                        <h4 className="font-bold text-lg mb-3">
                          Basic Settings
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                            <span>Copy market orders</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                            <span>Copy pending orders</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                            <span>Copy stop loss & take profit</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-yellow-50 p-6 rounded-lg">
                        <h4 className="font-bold text-lg mb-3">
                          Advanced Settings
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                            <span>Custom lot sizing</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                            <span>Symbol mapping (for different brokers)</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
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
                  <div className="flex-shrink-0 mr-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg border-4 border-red-200">
                      <Zap className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">
                      Step 5: Start Copy Trading
                    </h3>
                    <p className="text-lg text-gray-500 mb-4">
                      After configuring both Master and Slave accounts, click
                      the "Start Copying" button in the IPTRADE software. All
                      trades executed on your Master account will now be
                      automatically copied to your Slave accounts with minimal
                      latency.
                    </p>
                    <div className="mt-6">
                      <Button
                        asChild
                        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border border-blue-600 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-xl cursor-pointer border-2"
                      >
                        <Link href="/dashboard">
                          Download IPTRADE
                          <ArrowRight className="ml-3 h-5 w-5" />
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
      <section className="py-12">
        <div className="px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Advanced Features</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Discover the powerful capabilities that make IPTRADE the leading
              solution for prop firm traders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Risk Management
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-base">Custom Lot Sizing</p>
                    <p className="text-gray-500 text-base">
                      Automatically adjust position sizes based on your risk
                      tolerance for each account.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-base">
                      Maximum Open Positions
                    </p>
                    <p className="text-gray-500 text-base">
                      Set limits on the total number of positions that can be
                      open simultaneously.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-base">Account Protection</p>
                    <p className="text-gray-500 text-base">
                      Implement maximum daily loss limits to protect your
                      accounts.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-purple-200 mb-4">
                <Book className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Compatibility
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-base">Multi-Broker Support</p>
                    <p className="text-gray-500 text-base">
                      Copy trades between different brokers with automatic
                      symbol mapping.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-base">Multi-Platform</p>
                    <p className="text-gray-500 text-base">
                      Copy between MT4 and MT5 platforms seamlessly.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-base">
                      Prop Firm Optimization
                    </p>
                    <p className="text-gray-500 text-base">
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
      <section className="py-12">
        <div className="px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Ready to <span className="text-black">revolutionize</span> your
              trading?
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Join thousands of traders who trust IPTRADE for lightning-fast
              trade copying between platforms. Perfect for prop firm traders who
              need to maintain compliance while maximizing efficiency.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a href="/sign-in">
                <Button className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border border-blue-600 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-xl cursor-pointer border-2">
                  Start now
                  <Zap className="ml-3 h-5 w-5" />
                </Button>
              </a>
              <Link href="/dashboard/guide">
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-black/5 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center cursor-pointer border-2"
                >
                  View guide
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
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
