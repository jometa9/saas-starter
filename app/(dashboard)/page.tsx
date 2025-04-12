import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Check, Download, Zap } from "lucide-react";

import { Terminal } from "./terminal";

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl text-center font-bold text-gray-900 tracking-tight sm:text-5xl sm:text-left md:text-6xl">
                <span className="italic ">Lightning-Fast</span>
                <span className="block text-black text-gray-500">
                  Trade Copier
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl text-center sm:text-left">
                Copy trades instantly between MetaTrader accounts while
                maintaining the same IP address. Perfect for traders who need
                lightning-fast execution without triggering IP security alerts.
              </p>
              <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center md:justify-center lg:justify-start gap-4 mx-auto lg:mx-0">
                <a href="/sign-up">
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
                <p className="text-gray-600 text-sm">
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
                <p className="text-gray-600 text-sm">
                  Maintain compliance with prop firm requirements by ensuring
                  all your trading accounts operate from the same IP address.
                </p>
              </div>
            </div>

            {/* Benefit 7 - Data Privacy */}
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
                <h3 className="text-xl font-bold mb-2">Data Privacy First</h3>
                <p className="text-gray-600 text-sm">
                  Your trading data is never stored or shared. Each request to
                  IPTRADE is processed in real-time and immediately discarded,
                  ensuring complete privacy and confidentiality of your trading
                  activities.
                </p>
              </div>
            </div>

            {/* Benefit 8 - Unlimited Accounts */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-orange-200">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Unlimited Account Connections
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect as many trading accounts as you need - there's no
                  limit since IPTRADE runs locally on your computer. Perfect for
                  managing multiple prop firm accounts or extensive trading
                  portfolios.
                </p>
              </div>
            </div>

            {/* Benefit 10 - Cross Platform */}
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
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Cross-Platform Compatibility
                </h3>
                <p className="text-gray-600 text-sm">
                  Run IPTRADE seamlessly on both Windows and macOS. The
                  application is natively optimized for each operating system,
                  ensuring the same high-performance trade copying experience
                  regardless of your platform choice.
                </p>
              </div>
            </div>

            {/* Benefit 11 - Offline Mode */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-rose-200">
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
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Local Network Operation
                </h3>
                <p className="text-gray-600 text-sm">
                  IPTRADE operates entirely on your local network, requiring no
                  constant internet connection for trade copying. This ensures
                  maximum security and minimal latency, as all operations are
                  processed directly on your machine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 pb-10 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center">
              {/* MT5 Master */}
              <div className="text-center z-10">
                <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center mx-auto shadow-xl">
                  <img
                    src="/assets/mt5.png"
                    alt="MetaTrader 5 Icon"
                    className="w-16 h-16 object-contain rounded-xl shadow-lg"
                  />
                </div>
                <h3 className="mt-2 mb-2 font-semibold text-gray-500">
                  Master
                </h3>
              </div>

              {/* Connecting Line */}
              <div className="w-20 mb-10 h-px bg-gray-300"></div>

              {/* IPTRADE APP */}
              <div className="text-center z-20">
                <div className="w-32 h-32 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center mx-auto shadow-xl">
                  <img
                    src="/assets/iconShadow025.png"
                    alt="IPTRADE Icon"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="mt-2 mb-2 text-lg font-semibold">IPTRADE APP</h3>
              </div>

              {/* Connecting Line */}
              <div className="w-20 mb-10 h-px bg-gray-300"></div>

              {/* Slave Accounts Container */}
              <div className="text-center gap-4 z-10">
                <div className="text-center flex bg-gray-100 rounded-xl border-2 border-gray-200 shadow-xl">
                  <div className="w-24 h-24 flex justify-center items-center">
                    <img
                      src="/assets/mt4.png"
                      alt="MetaTrader 4 Icon"
                      className="w-16 h-16 object-contain rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="w-24 h-24 flex justify-center items-center">
                    <img
                      src="/assets/mt5.png"
                      alt="MetaTrader 5 Icon"
                      className="w-16 h-16 object-contain rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="w-24 h-24 flex justify-center items-center">
                    <img
                      src="/assets/mt4.png"
                      alt="MetaTrader 4 Icon"
                      className="w-16 h-16 object-contain rounded-xl shadow-lg"
                    />
                  </div>
                </div>
                <h3 className="mt-2 mb-2 font-semibold text-gray-500">
                  Slaves
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-12">
        <div className="px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose IPTRADE?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Compare IPTRADE with other trade copying solutions
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <div className="border-2 border-gray-200 rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left rounded-tl-xl"></th>
                    <th className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <img
                          src="/assets/iconShadow025.png"
                          alt="IPTRADE Icon"
                          className="w-12 h-12 object-contain mb-2"
                        />
                        <span className="font-bold">IPTRADE</span>
                      </div>
                    </th>
                    <th className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <img
                          src="/assets/socialtradertools.png"
                          alt="Social Trade Tools Icon"
                          className="w-18 h-10 object-contain mb-2"
                        />
                        <span className="font-bold">Social Trade Tools</span>
                      </div>
                    </th>
                    <th className="p-4 text-center rounded-tr-xl">
                      <div className="flex flex-col items-center">
                        <img
                          src="/assets/tradersconnect.png"
                          alt="Traders Connect Icon"
                          className="w-10 h-10 p-1 object-contain mb-2"
                        />
                        <span className="font-bold">Traders Connect</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-2 border-gray-100">
                    <td className="p-4 font-medium text-lg">
                      Local Network Operation
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <svg
                        className="h-5 w-5 text-red-500 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </td>
                    <td className="p-4 text-center">
                      <svg
                        className="h-5 w-5 text-red-500 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-100">
                    <td className="p-4 font-medium text-lg">
                      Unlimited Account Connections
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <svg
                        className="h-5 w-5 text-red-500 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-100">
                    <td className="p-4 font-medium text-lg">
                      Cross-Platform Compatibility
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <svg
                        className="h-5 w-5 text-red-500 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-100">
                    <td className="p-4 font-medium text-lg">No Data Storage</td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <svg
                        className="h-5 w-5 text-red-500 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </td>
                    <td className="p-4 text-center">
                      <svg
                        className="h-5 w-5 text-red-500 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-lg rounded-bl-xl">
                      Lightning-Fast Execution
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <svg
                        className="h-5 w-5 text-red-500 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </td>
                    <td className="p-4 text-center rounded-br-xl">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-6">
            {/* IPTRADE Card */}
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-600 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/assets/iconShadow025.png"
                  alt="IPTRADE Icon"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="ml-4 text-2xl font-bold">IPTRADE</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="ml-3 text-gray-700">
                    Local Network Operation
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="ml-3 text-gray-700">
                    Unlimited Account Connections
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="ml-3 text-gray-700">
                    Cross-Platform Compatibility
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="ml-3 text-gray-700">No Data Storage</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="ml-3 text-gray-700">
                    Lightning-Fast Execution
                  </span>
                </li>
              </ul>
            </div>

            {/* Social Trade Tools Card */}
            <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/assets/socialtradertools.png"
                  alt="Social Trade Tools Icon"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="ml-4 text-2xl font-bold">Social Trade Tools</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-500 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">
                    Local Network Operation
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-500 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">
                    Unlimited Account Connections
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="ml-3 text-gray-700">
                    Cross-Platform Compatibility
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-500 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">No Data Storage</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-500 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">
                    Lightning-Fast Execution
                  </span>
                </li>
              </ul>
            </div>

            {/* Traders Connect Card */}
            <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/assets/tradersconnect.png"
                  alt="Traders Connect Icon"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="ml-4 text-2xl font-bold">Traders Connect</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-500 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">
                    Local Network Operation
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="ml-3 text-gray-700">
                    Unlimited Account Connections
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-500 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">
                    Cross-Platform Compatibility
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-500 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">No Data Storage</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="ml-3 text-gray-700">
                    Lightning-Fast Execution
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

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
            <div className="lg:col-span-3 border border-gray-200 rounded-2xl shadow-lg bg-white p-8">
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
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Single master account
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Unlimited accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Fixed lot size (0.01)
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <a href="/sign-up">
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
            <div className="lg:col-span-3 border-2 border-green-600 rounded-2xl shadow-xl bg-white p-8 relative">
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
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Customizable lot sizes
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Up to 10 total accounts (master and slave)
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Single IP for all accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Priority support
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Advanced risk management
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    asChild
                    className="w-full py-6 text-lg bg-green-700 hover:bg-green-900 text-white cursor-pointer"
                  >
                    <Link href="/sign-up">Go Premium</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Unlimited Plan */}
            <div className="lg:col-span-3 border-2 border-blue-500 rounded-2xl shadow-xl bg-white p-8 relative">
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  UNLIMITED ACCOUNTS
                </span>
              </div>

              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Unlimited
                  </h3>
                  <p className="mt-4 text-gray-600">
                    No limits on connected accounts
                  </p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-gray-900">
                      $50
                    </span>
                    <span className="text-xl text-gray-500">/month</span>
                  </div>
                </div>

                <div className="mt-8 flex-grow">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        All Premium features
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Unlimited slave accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Multiple master accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Single IP for all accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        24/7 Priority support
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    asChild
                    className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    <Link href="/sign-up">Go Unlimited</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="lg:col-span-3 border-2 border-purple-500 rounded-2xl shadow-xl bg-white p-8 relative">
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
                      $999
                    </span>
                    <span className="text-xl text-gray-500">/month</span>
                  </div>
                </div>

                <div className="mt-8 flex-grow">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        All Premium features
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Dedicated VPS server
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Single IP for all accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Up to 50 slave accounts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        24/7 server monitoring
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 text-sm">
                        Full setup & configuration
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    asChild
                    className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                    disabled
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
              <div className="border border-black border-2 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow">
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

              <div className="border border-black border-2 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow">
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
              <div className="border border-blue-800 border-2 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow">
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

              <div className="border border-blue-800 border-2 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow">
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
              <div className="border border-yellow-600 border-2 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow">
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

              <div className="border border-yellow-600 border-2 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow">
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
