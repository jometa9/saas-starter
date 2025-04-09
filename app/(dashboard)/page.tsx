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

      <div className="py-12 ">
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
      <section className="py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How IPTRADE Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Simple setup, powerful results. Copy trades between platforms
              while maintaining your IP integrity.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div
              className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"
              aria-hidden="true"
            ></div>

            {/* Step 1 */}
            <div className="relative mb-12">
              <div className="lg:flex items-center">
                <div className="hidden lg:block w-1/2 pr-16 text-right">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Install & Setup
                  </h3>
                  <p className="text-gray-500">
                    Download IPTRADE and install it on your computer. The setup
                    takes less than 2 minutes.
                  </p>
                </div>
                <div className="lg:w-14 mx-auto lg:mx-0 flex justify-center items-center">
                  <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                    <span className="text-xl font-bold">1</span>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 lg:w-1/2 lg:pl-16 text-center lg:text-left">
                  <h3 className="block lg:hidden text-2xl font-bold text-gray-900 mb-3">
                    Install & Setup
                  </h3>
                  <p className="block lg:hidden text-gray-500 mb-4">
                    Download IPTRADE and install it on your computer. The setup
                    takes less than 2 minutes.
                  </p>
                  <div className="relative h-64 w-full max-w-md mx-auto lg:mx-0 rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white group">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center p-6">
                        <p className="text-sm text-gray-500">
                          Our installer handles all the technical details. Just
                          download, run, and follow the simple prompts.
                        </p>
                        <Button variant="outline" className="mt-4">
                          <Download className="mr-2 h-4 w-4" />
                          Get Started
                        </Button>
                      </div>
                    </div>
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="animate-pulse">
                        <Download className="h-16 w-16 text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative mb-12">
              <div className="lg:flex items-center">
                <div className="lg:w-1/2 pr-16 text-center lg:text-right order-last lg:order-first">
                  <div className="relative h-64 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white group">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center p-6">
                        <p className="text-sm text-gray-500">
                          Configure which accounts should copy trades from your
                          master account with just a few clicks.
                        </p>
                        <Button variant="outline" className="mt-4">
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Guide
                        </Button>
                      </div>
                    </div>
                    <div className="h-full w-full flex items-center justify-center p-4">
                      <div className="animate-bounce">
                        <svg
                          className="h-16 w-16 text-black"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 6.1H3" />
                          <path d="M21 12.1H3" />
                          <path d="M15.9 18.1H3" />
                          <circle cx="19" cy="18" r="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-14 mx-auto lg:mx-0 flex justify-center items-center my-6 lg:my-0">
                  <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                    <span className="text-xl font-bold">2</span>
                  </div>
                </div>
                <div className="lg:w-1/2 lg:pl-16 text-center lg:text-left order-first lg:order-last">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Configure Accounts
                  </h3>
                  <p className="text-gray-500">
                    Connect your MetaTrader platforms and select which accounts
                    should copy trades from your master account.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="lg:flex items-center">
                <div className="hidden lg:block w-1/2 pr-16 text-right">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Trade & Copy
                  </h3>
                  <p className="text-gray-500">
                    Start trading on your master account and watch as trades are
                    instantly copied to your follower accounts—all using the
                    same IP address.
                  </p>
                </div>
                <div className="lg:w-14 mx-auto lg:mx-0 flex justify-center items-center">
                  <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                    <span className="text-xl font-bold">3</span>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 lg:w-1/2 lg:pl-16 text-center lg:text-left">
                  <h3 className="block lg:hidden text-2xl font-bold text-gray-900 mb-3">
                    Trade & Copy
                  </h3>
                  <p className="block lg:hidden text-gray-500 mb-4">
                    Start trading on your master account and watch as trades are
                    instantly copied to your follower accounts—all using the
                    same IP address.
                  </p>
                  <div className="relative h-64 w-full max-w-md mx-auto lg:mx-0 rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                    <div className="h-full w-full overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full max-w-xs">
                          <div className="space-y-2 font-mono text-xs text-gray-500">
                            <div className="flex animate-pulse">
                              <div className="h-4 w-full bg-gray-100 rounded"></div>
                            </div>
                            <div className="flex animate-pulse delay-100">
                              <div className="h-4 w-full bg-gray-100 rounded"></div>
                            </div>
                            <div className="flex animate-pulse delay-200">
                              <div className="h-4 w-full bg-gray-100 rounded"></div>
                            </div>
                            <div className="bg-green-100 p-2 rounded animate-pulse">
                              <p className="text-green-800">
                                [1100574562] BTCUSD BUY 1.23 LOT ✓
                              </p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded mt-1 animate-pulse delay-300">
                              <p className="text-blue-800">
                                [COPIED] → Account #2 ✓
                              </p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded mt-1 animate-pulse delay-500">
                              <p className="text-blue-800">
                                [COPIED] → Account #3 ✓
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-20">
            <Button
              asChild
              className="bg-black hover:bg-gray-800 text-white border border-gray-200 rounded-full text-lg px-8 py-6 inline-flex items-center"
            >
              <a href="#download">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
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
