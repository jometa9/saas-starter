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

      <div className="text-center py-12 px-6">
        <h2 className="text-5xl font-bold ">Your trades, One IP adress.</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Get our high-frequency trading software that allows you to copy trades
          between different MetaTrader platforms from the same computer.
        </p>
      </div>

      <div className="py-14 pt-10 px-6">
        <p className="text-3xl text-center text-gray-500 mb-8">
          Our Supported Platforms
        </p>
        <div className="flex items-center gap-4 justify-center">
          <div className="flex flex-col items-center bg-gray-100 rounded-xl border-2 border-gray-200 py-4 px-6 pt-6 shadow-2xl">
            <div className="h-20 w-20 rounded-xl overflow-hidden shadow-xl mx-auto ">
              <img
                src="/assets/mt4.png"
                alt="MetaTrader 4 Platform"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold">MetaTrader 4</h3>
          </div>
          <div className="flex flex-col items-center bg-gray-100 rounded-xl border-2 border-gray-200 py-4 px-6 pt-6 shadow-2xl">
            <div className="h-20 w-20 rounded-xl overflow-hidden mx-auto shadow-xl">
              <img
                src="/assets/mt5.png"
                alt="MetaTrader 5 Platform"
                className="w-full h-full object-cover "
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold">MetaTrader 5</h3>
          </div>
        </div>
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
              <div className="text-center z-10">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center mx-auto z-10">
                    <img
                      src="/assets/mt5.png"
                      alt="MetaTrader 5 Icon"
                      className="w-16 h-16 object-contain rounded-xl"
                    />
                  </div>
                  <h3 className="mt-2 mb-2 font-semibold text-gray-500">
                    MT5 Slave
                  </h3>
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
                  <h3 className="mt-2 mb-2 font-semibold text-gray-500">
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
                  <h3 className="mt-2 mb-2 font-semibold text-gray-500">
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
                  <h3 className="mt-2 mb-2 font-semibold text-gray-500">
                    MT4 Slave
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="pb-16">
        <div className="px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose IPTRADE</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover the advantages that make IPTRADE the preferred choice for professional traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex-shrink-0 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Lightning-Fast Trade Copying</h3>
                <p className="text-gray-600">
                  Experience minimal latency between your master and slave accounts. Our optimized copying system ensures your trades are replicated instantly across all connected accounts.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex-shrink-0 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Single IP Address Trading</h3>
                <p className="text-gray-600">
                  Maintain compliance with prop firm requirements by ensuring all your trading accounts operate from the same IP address, eliminating the risk of account violations.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex-shrink-0 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Customizable Trading Parameters</h3>
                <p className="text-gray-600">
                  Fine-tune your trading setup with adjustable lot sizes, risk management settings, and custom trade filters for each connected account.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex-shrink-0 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Enterprise-Grade Security</h3>
                <p className="text-gray-600">
                  Trade with confidence knowing your data and connections are protected by industry-standard encryption and security protocols.
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
