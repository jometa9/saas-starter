import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CreditCard,
  Database,
  BookOpen,
  Check,
  Download,
} from "lucide-react";
import { Terminal } from "./terminal";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                <span className="italic ">Lightning-Fast</span>
                <span className="block text-black text-gray-500">
                  Trade Copier
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Copy trades instantly between MetaTrader accounts while
                maintaining the same IP address. Perfect for prop firm traders
                who need lightning-fast execution without triggering IP security
                alerts.
              </p>
              <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center md:justify-center lg:justify-start gap-4 mx-auto lg:mx-0">
                <a href="#download">
                  <Button className="bg-black hover:bg-gray-800 text-white border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center cursor-pointer w-full sm:w-auto">
                    Download Now
                    <Download className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/guide">
                  <Button
                    variant="outline"
                    className="rounded-full text-lg px-8 py-4 inline-flex items-center justify-center cursor-pointer w-full sm:w-auto"
                  >
                    Read the Guide
                    <BookOpen className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <div className="text-center py-12">
        <h2 className="text-5xl font-bold ">Your trades, One IP adress.</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Get our high-frequency trading software that allows you to copy trades
          between different MetaTrader platforms from the same computer.
        </p>
      </div>

      <div className="pb-12 ">
        <div className="flex items-center gap-10 justify-center">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-xl overflow-hidden shadow-2xl mx-auto">
              <img
                src="/assets/mt4.png"
                alt="MetaTrader 4 Platform"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold">MetaTrader 4</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-xl overflow-hidden mx-auto shadow-2xl">
              <img
                src="/assets/mt5.png"
                alt="MetaTrader 5 Platform"
                className="w-full h-full object-cover "
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold">MetaTrader 5</h3>
          </div>
        </div>
        <p className="mt-10 text-center text-gray-500">
          Working with the bests.
        </p>
      </div>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              How IPTRADE Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple and efficient trade copying between your MetaTrader
              accounts
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Master Account */}
              <div className="text-center">
                <div className="inline-block bg-black text-white px-8 py-4 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold">Master Account</h3>
                  <p className="text-sm text-gray-300">
                    Your source trading account
                  </p>
                </div>
              </div>

              {/* Connecting Line from Master to IPTRADE */}
              <div className="w-px h-12 bg-gray-300 mx-auto"></div>

              {/* IPTRADE Server */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center mx-auto">
                  <img
                    src="/assets/iconShadow025.png"
                    alt="IPTRADE Icon"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="mt-2 mb-2 text-xl font-semibold">IPTRADE APP</h3>
              </div>

              {/* Connecting Lines Container */}
              <div className="relative h-20">
                {/* Horizontal Line */}
                <div className="absolute left-1/6 right-1/6 top-1/2 h-px bg-gray-300"></div>
                {/* Vertical Lines */}
                <div className="absolute left-1/6 top-1/2 h-full w-px bg-gray-300"></div>
                <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300"></div>
                <div className="absolute left-5/6 top-1/2 h-full w-px bg-gray-300"></div>
              </div>

              {/* Slave Accounts */}
              <div className="grid grid-cols-3">
                <div className="text-center z-10">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center mx-auto z-10">
                    <img
                      src="/assets/mt4.png"
                      alt="MetaTrader 4 Icon"
                      className="w-16 h-16 object-contain rounded-xl"
                    />
                  </div>
                  <h3 className="mt-4 mb-2 font-semibold text-gray-500">
                    MT4 Slave
                  </h3>
                </div>

                <div className="text-center z-10">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center mx-auto z-10">
                    <img
                      src="/assets/mt5.png"
                      alt="MetaTrader 5 Icon"
                      className="w-16 h-16 object-contain rounded-xl"
                    />
                  </div>
                  <h3 className="mt-4 mb-2 font-semibold text-gray-500">
                    MT5 Slave
                  </h3>
                </div>

                <div className="text-center z-10">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center mx-auto z-10">
                    <img
                      src="/assets/mt4.png"
                      alt="MetaTrader 4 Icon"
                      className="w-16 h-16 object-contain rounded-xl"
                    />
                  </div>
                  <h3 className="mt-4 mb-2 font-semibold text-gray-500">
                    MT4 Slave
                  </h3>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="mt-16">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Copy trades from one master account to multiple MT4/MT5
                  accounts simultaneously
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Software Download Section */}
      <section id="download" className="py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Download IPTRADE
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Get our high-frequency trading software that allows you to copy
              trades between different MetaTrader platforms from the same
              computer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">Windows Version</h3>
                  <p className="text-sm text-muted-foreground">v1.0.0</p>
                </div>
                <Button variant="outline" className="ml-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Compatible with Windows 10 and above. Supports MetaTrader 4 & 5
                for high-frequency trading with IPTRADE.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">macOS Version</h3>
                  <p className="text-sm text-muted-foreground">v1.0.0</p>
                </div>
                <Button variant="outline" className="ml-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Compatible with macOS Monterey and above. Optimized for Apple
                Silicon with IPTRADE support.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">Linux Version</h3>
                  <p className="text-sm text-muted-foreground">v1.0.0</p>
                </div>
                <Button variant="outline" className="ml-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                For Linux distributions with Wine support. Ideal for
                server-based trading setups.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Need help with setup? Check our{" "}
              <Link href="/dashboard/guide" className="text-black font-medium">
                guide
              </Link>{" "}
              for detailed installation instructions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path
                    fill="currentColor"
                    d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15 1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16z"
                  />
                </svg>
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Same IP Trading
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Copy trades between accounts from the same IP address,
                  eliminating the risk of account blocks by prop firms due to IP
                  changes.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                <Database className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Local Execution
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  All trading data stays on your computer. No third-party
                  servers involved, ensuring maximum privacy and security for
                  your trading activities.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Ultra-Fast Execution
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Lightning-fast trade copying with minimal latency. Crucial for
                  high-frequency trading where every millisecond counts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Pricing Plans
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Choose the perfect plan for your trading needs. All plans include
              a 14-day free trial.
            </p>
          </div>

          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Basic</h3>
                <p className="mt-4 text-sm text-gray-500">
                  Essential copying features for individual traders.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $0
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /mo
                  </span>
                </p>
                <Button
                  asChild
                  className="mt-8 block w-full bg-white border border-gray-800 rounded-md py-2 text-sm font-semibold text-gray-900 text-center hover:bg-gray-50"
                >
                  <Link href="/sign-up">Sign up for free</Link>
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Single master account
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Up to 2 slave accounts
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Community support
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Trader</h3>
                <p className="mt-4 text-sm text-gray-500">
                  Advanced features for serious traders with multiple accounts.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $29
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /mo
                  </span>
                </p>
                <Button
                  asChild
                  className="mt-8 block w-full bg-black border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-800"
                >
                  <Link href="/pricing">Go Premium</Link>
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      All Basic features
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Up to 3 master accounts
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Up to 5 slave accounts
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Priority email support
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-black rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Professional
                </h3>
                <p className="mt-4 text-sm text-gray-500">
                  Ultimate solution for professional traders and fund managers.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $79
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /mo
                  </span>
                </p>
                <Button
                  asChild
                  className="mt-8 block w-full bg-black border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-800"
                >
                  <Link href="/pricing">Go Premium</Link>
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      All Trader features
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Unlimited master accounts
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Unlimited slave accounts
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      24/7 priority support
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Ultra-low latency mode
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to revolutionize your trading?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Our IPTRADE software provides everything you need to copy trades
                between platforms with the same IP address. Perfect for prop
                firm traders who want to maintain compliance while copying
                trades.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <a href="#download">
                <Button className="bg-black hover:bg-gray-800 text-white border border-transparent rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
                  Download now
                  <Download className="ml-3 h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
