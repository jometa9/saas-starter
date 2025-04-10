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
                  <Button className="bg-black hover:bg-gray-800 text-white border border-transparent rounded-full text-lg px-8 py-6 inline-flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer">
                    Download now
                    <Download className="ml-3 h-5 w-5" />
                  </Button>
                </a>
                <Link href="/dashboard/guide">
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-black/5 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center cursor-pointer"
                  >
                    View guide
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <div className="text-center py-12 pt-8 px-6">
        <h2 className="text-5xl font-bold ">
          Your trades, <span className="text-gray-500">One IP adress.</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Get our high-frequency trading software that allows you to copy trades
          between different MetaTrader platforms from the same computer.
        </p>
      </div>

      <div className="py-14 pt-6 px-6">
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

      {/* Benefits Section */}
      <section className="py-12">
        <div className="px-6">
          <div className="r mb-14">
            <span className="text-3xl text-center text-gray-500 mb-8">
              IPTRADE Features
            </span>
            
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4 mx-auto">
            {/* Benefit 1 - Lightning Fast */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-blue-200">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Lightning-Fast Trade Copying
                </h3>
                <p className="text-gray-600">
                  Experience minimal latency between your master and slave
                  accounts. Our optimized copying system ensures your trades are
                  replicated instantly.
                </p>
              </div>
            </div>

            {/* Benefit 2 - Single IP */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-purple-200">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Single IP Address Trading
                </h3>
                <p className="text-gray-600">
                  Maintain compliance with prop firm requirements by ensuring
                  all your trading accounts operate from the same IP address.
                </p>
              </div>
            </div>

            {/* Benefit 3 - Customizable */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-green-200">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Customizable Parameters
                </h3>
                <p className="text-gray-600">
                  Fine-tune your trading setup with adjustable lot sizes, risk
                  management settings, and custom trade filters.
                </p>
              </div>
            </div>

            {/* Benefit 4 - Security */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-red-200">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                <p className="text-gray-600">
                  Trade with confidence knowing your data and connections are
                  protected by industry-standard encryption protocols.
                </p>
              </div>
            </div>

            {/* Benefit 5 - Analytics */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-amber-200">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Performance Analytics
                </h3>
                <p className="text-gray-600">
                  Monitor your trading performance with detailed statistics and
                  real-time analytics across all connected accounts.
                </p>
              </div>
            </div>

            {/* Benefit 6 - Support */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-indigo-200">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Get expert assistance whenever you need it with our dedicated
                  support team available around the clock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="py-12">
        <div className="px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Get Started with IPTRADE
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Follow these simple steps to set up your trade copying system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8  mx-auto">
            {/* Step 1 */}
            <div className="relative bg-white p-8 rounded-2xl border border-gray-200 border-2 shadow-lg flex flex-col">
              <div className="flex-grow">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200 mb-6">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Download IPTRADE App
                </h3>
                <p className="text-gray-600">
                  Download and install the IPTRADE desktop application. This app
                  acts as a central hub, receiving and sending orders between
                  your trading accounts.
                </p>
              </div>
              <div className="mt-6">
                <a
                  href="#download"
                  className="inline-flex items-center text-sm font-medium text-black hover:text-gray-600 cursor-pointer"
                >
                  Go to downloads
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white p-8 rounded-2xl border border-gray-400 border-2 shadow-lg flex flex-col">
              <div className="flex-grow">
                <div className="h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-purple-200 mb-6">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Install MetaTrader Platform
                </h3>
                <p className="text-gray-600">
                  Download and install MetaTrader 4 or MetaTrader 5. We
                  recommend downloading directly from the official MQL5 website
                  for the latest version and security updates.
                </p>
              </div>
              <div className="mt-6">
                <a
                  href="#download"
                  className="inline-flex items-center text-sm font-medium text-black hover:text-gray-600 cursor-pointer"
                >
                  Get MetaTrader
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white p-8 rounded-2xl border border-gray-500 border-2 shadow-lg flex flex-col">
              <div className="flex-grow">
                <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-green-200 mb-6">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Configure Your Accounts
                </h3>
                <p className="text-gray-600">
                  Set up your master account and configure your slave accounts
                  in the IPTRADE app. Follow our detailed guide for step-by-step
                  instructions on account configuration.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/dashboard/guide"
                  className="inline-flex items-center text-sm font-medium text-black hover:text-gray-600 cursor-pointer"
                >
                  View configuration guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/*
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
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

              <div className="w-px h-12 bg-gray-300 mx-auto"></div>

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

              <div className="relative h-20">
                <div className="absolute left-1/6 right-1/6 top-1/2 h-px bg-gray-300"></div>
                <div className="absolute left-1/6 top-1/2 h-full w-px bg-gray-300"></div>
                <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300"></div>
                <div className="absolute left-5/6 top-1/2 h-full w-px bg-gray-300"></div>
              </div>

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
      */}

      {/* Pricing Section */}
      <section className="py-12">
        <div className="px-4">
          <div className="r mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Simple Pricing</h2>
            <p className="mt-3 max-w-2xl text-lg text-gray-600">
              Choose the plan that fits your trading needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Free Plan */}
            <div className="lg:col-span-4 border border-gray-200 rounded-2xl shadow-lg bg-white p-8">
              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                  <p className="mt-4 text-gray-600">
                    Perfect for getting started with trade copying
                  </p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-gray-900">$0</span>
                    <span className="text-xl text-gray-500">/month</span>
                  </div>
                </div>

                <div className="mt-8 flex-grow">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Single master account
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Up to 2 slave accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Fixed lot size (0.01)
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Community support
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <a href="#steps">
                    <Button
                      variant="outline"
                      className="w-full py-6 text-lg border-black text-black hover:bg-black/5 cursor-pointer"
                    >
                      Get Started
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="lg:col-span-4 border-2 border-black rounded-2xl shadow-xl bg-white p-8 relative">
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                  MOST POPULAR
                </span>
              </div>

              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
                  <p className="mt-4 text-gray-600">
                    Advanced features for serious traders
                  </p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-gray-900">
                      $20
                    </span>
                    <span className="text-xl text-gray-500">/month</span>
                  </div>
                </div>

                <div className="mt-8 flex-grow">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        All Free features
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Customizable lot sizes
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Up to 5 slave accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Priority support
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Advanced risk management
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    asChild
                    className="w-full py-6 text-lg bg-black hover:bg-gray-800 text-white cursor-pointer"
                  >
                    <Link href="/pricing">Go Premium</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="lg:col-span-4 border-2 border-purple-500 rounded-2xl shadow-xl bg-white p-8 relative">
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
                  MANAGED SERVICE
                </span>
              </div>

              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Managed VPS
                  </h3>
                  <p className="mt-4 text-gray-600">
                    Fully managed trade copying service
                  </p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-gray-900">
                      $499
                    </span>
                    <span className="text-xl text-gray-500">/month</span>
                  </div>
                </div>

                <div className="mt-8 flex-grow">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        All Premium features
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Dedicated VPS server
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Single IP for all accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Up to 10 slave accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        24/7 server monitoring
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Full setup & configuration
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    asChild
                    className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                  >
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Software Download Section */}
      <section id="download" className="py-12 w-full">
        <div className="px-4">
          <div className="r mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Download IPTRADE
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-gray-600">
              Get everything you need to start copying trades between MetaTrader
              platforms
            </p>
          </div>

          {/* IPTRADE Desktop App */}
          <div className="mb-6">
            <div className="flex items-center mb-4 gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center shadow">
                <img
                  src="/assets/iconShadow025.png"
                  alt="IPTRADE Icon"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                IPTRADE Desktop App
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-lg">Windows Version</h4>
                    <p className="text-sm text-muted-foreground">v1.0.0</p>
                  </div>
                  <Button variant="outline" className="ml-auto cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Compatible with Windows 10 and above. Supports MetaTrader 4 &
                  5 for high-frequency trading with IPTRADE.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-lg">macOS Version</h4>
                    <p className="text-sm text-muted-foreground">v1.0.0</p>
                  </div>
                  <Button variant="outline" className="ml-auto cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Compatible with macOS Monterey and above. Optimized for Apple
                  Silicon with IPTRADE support.
                </p>
              </div>
            </div>
          </div>

          {/* EA Source Code */}
          <div className="mb-6">
            <div className="flex items-center  mb-4 gap-4">
              <div className="w-16 h-16 rounded-xl border-2 border-gray-200 flex items-center justify-center shadow">
                <img
                  src="/assets/metatrader5_expert_advisors_logo.png"
                  alt="Expert Advisor"
                  className="w-10 h-10 object-contain bg-gray-50"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                EA Source Code
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-lg">MT4 Expert Advisor</h4>
                    <p className="text-sm text-muted-foreground">
                      MQL4 Source Code
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Download the source code for the MetaTrader 4 Expert Advisor
                  to customize and compile.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-lg">MT5 Expert Advisor</h4>
                    <p className="text-sm text-muted-foreground">
                      MQL5 Source Code
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Download the source code for the MetaTrader 5 Expert Advisor
                  to customize and compile.
                </p>
              </div>
            </div>
          </div>

          {/* MetaTrader Platforms */}
          <div>
            <div className="flex items-center mb-4 gap-4">
              <div className="w-16 h-16 rounded-xl border-2 border-gray-200 flex items-center justify-center shadow">
                <img
                  src="/assets/mql5_logo__2.jpg"
                  alt="MQL5 Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                MQL5 Download Links
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-lg">MetaTrader 4</h4>
                    <p className="text-sm text-muted-foreground">
                      Official Platform
                    </p>
                  </div>
                  <a
                    href="https://www.mql5.com/en/download/mt4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <Button
                      variant="outline"
                      className="ml-auto cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Visit MQL5
                    </Button>
                  </a>
                </div>
                <p className="text-sm text-gray-500">
                  Download the official MetaTrader 4 trading platform from the
                  MQL5 website.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-lg">MetaTrader 5</h4>
                    <p className="text-sm text-muted-foreground">
                      Official Platform
                    </p>
                  </div>
                  <a
                    href="https://www.mql5.com/en/download/mt5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <Button
                      variant="outline"
                      className="ml-auto cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Visit MQL5
                    </Button>
                  </a>
                </div>
                <p className="text-sm text-gray-500">
                  Download the official MetaTrader 5 trading platform from the
                  MQL5 website.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">
              Need help with setup? Check our{" "}
              <Link
                href="/dashboard/guide"
                className="text-black font-medium cursor-pointer"
              >
                guide
              </Link>{" "}
              for detailed installation instructions.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12">
        <div className="px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Ready to <span className="text-black">revolutionize</span> your
              trading?
            </h2>
            <p className="mt-6 text-xl text-gray-600 ">
              Join thousands of traders who trust IPTRADE for lightning-fast
              trade copying between platforms. Perfect for prop firm traders who
              need to maintain compliance while maximizing efficiency.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a href="#download">
                <Button className="bg-black hover:bg-gray-800 text-white border border-transparent rounded-full text-lg px-8 py-6 inline-flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer">
                  Download now
                  <Download className="ml-3 h-5 w-5" />
                </Button>
              </a>
              <Link href="/dashboard/guide">
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-black/5 rounded-full text-lg px-8 py-6 inline-flex items-center justify-center cursor-pointer"
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
