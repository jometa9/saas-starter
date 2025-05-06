"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/db/schema";
import {
  CheckCircle2,
  ChevronRight,
  Book,
  Download,
  Settings,
  CreditCard,
  Terminal,
  Shield,
  Zap,
} from "lucide-react";

export function Guide({ user }: { user: User }) {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">
        IPTRADE Guide
      </h1>

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
                    <p className=" text-xs">Master Configuration:</p>
                    <p className=" text-xs mt-1">
                      1. In IPTRADE, click "Add Master Account"
                    </p>
                    <p className=" text-xs mt-1">
                      2. Select your MetaTrader version (MT4/MT5)
                    </p>
                    <p className=" text-xs mt-1">
                      3. Enter account name (e.g., "My Prop Firm Master")
                    </p>
                    <p className=" text-xs mt-1">
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
                    <p className=" text-xs">Slave Configuration:</p>
                    <p className=" text-xs mt-1">
                      1. In IPTRADE, click "Add Slave Account"
                    </p>
                    <p className=" text-xs mt-1">
                      2. Select your MetaTrader version (MT4/MT5)
                    </p>
                    <p className=" text-xs mt-1">
                      3. Enter account name (e.g., "My Prop Firm Slave")
                    </p>
                    <p className=" text-xs mt-1">
                      4. Set lot size ratio if needed (e.g., 0.5 for half the
                      size)
                    </p>
                    <p className=" text-xs mt-1">
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
                          {user.planName === "Premium"
                            ? "Ultra-low latency mode"
                            : "Standard latency mode"}
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
                  <div className="p-3 bg-gray-50 rounded text-sm border-l-4 border-black">
                    <p>
                      <strong>Important:</strong> Keep the IPTRADE software
                      running at all times while you want trades to be copied.
                      Closing the software will stop the copy process.
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  Will using IPTRADE violate prop firm rules?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  No. Since the IPTRADE operates locally on your computer, all
                  trades originate from the same IP address. This complies with
                  most prop firms' rules about not sharing accounts across
                  different locations.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  How fast are trades copied between accounts?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  IPTRADE operates with extremely low latency - typically under
                  50ms for trade execution.{" "}
                  {user.planName === "Premium"
                    ? "With your Premium subscription, you have access to ultra-low latency mode, reducing this to under 10ms."
                    : "Upgrade to our Premium plan for access to ultra-low latency mode (under 10ms)."}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  Can I copy trades between MT4 and MT5 platforms?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  Yes. IPTRADE supports cross-platform copying between MT4 and
                  MT5, allowing you to use different platforms for your various
                  accounts while maintaining perfect trade synchronization.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  Does IPTRADE work with all brokers?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  IPTRADE is designed to work with any broker that supports
                  MetaTrader 4 or 5 platforms. This includes most prop firms and
                  retail brokers worldwide.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  What happens if my internet disconnects during trading?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  IPTRADE operates locally on your computer, so it will continue
                  to copy trades between MetaTrader instances even if your
                  internet connection is temporarily lost. However, your
                  MetaTrader platforms themselves will need internet to execute
                  trades with your broker.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Common Issues</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-sm">Connection Problems</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      If IPTRADE cannot connect to your MetaTrader platform,
                      ensure the platform is running and try restarting both the
                      platform and IPTRADE software.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-sm">
                      Trades Not Being Copied
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Verify that symbol names match or are properly mapped, and
                      check that the "Start Copying" button has been activated.
                      Also confirm that both platforms are connected to their
                      respective brokers.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-sm">License Key Issues</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      If you receive a license error, ensure your subscription
                      is active and that you've entered your license key
                      correctly. You can find your license key in the Dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Getting Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  If you need additional help, our support team is available to
                  assist you:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="bg-black p-2 rounded-full mr-3">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Technical Support</p>
                      <p className="text-xs text-muted-foreground">
                        Email: support@iptrade.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-black p-2 rounded-full mr-3">
                      <Book className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Documentation</p>
                      <p className="text-xs text-muted-foreground">
                        Detailed guides and API documentation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 