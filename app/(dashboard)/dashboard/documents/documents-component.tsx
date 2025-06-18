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

export function Documents({ user }: { user: User }) {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">IPTRADE Guide</h1>

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
                  Can I copy from MT4 to MT5 and vice versa?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  Yes. IPTRADE supports cross-platform copying between MT4 and
                  MT5. The software automatically handles the technical
                  differences between platforms to ensure accurate trade
                  copying.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  How many accounts can I copy to?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  This depends on your subscription plan. Basic allows up to 2
                  slave accounts, Trader allows up to 5 slave accounts, and
                  Professional allows unlimited slave accounts.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 text-black" />
                  Is my trading data secure?
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  Absolutely. IPTRADE operates 100% locally on your computer. No
                  trading data is ever sent to our servers or third parties,
                  ensuring maximum privacy and security for your trading
                  activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
