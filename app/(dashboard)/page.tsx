import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Database, BookOpen, Check, Download } from 'lucide-react';
import { Terminal } from './terminal';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Lightning-Fast
                <span className="block text-black">Trade Copier</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Copy trades instantly between MetaTrader accounts while maintaining the same IP address. 
                Perfect for prop firm traders who need lightning-fast execution without triggering IP security alerts.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <a
                  href="#download"
                >
                  <Button className="bg-black hover:bg-gray-800 text-white border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                    Download Now
                    <Download className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/docs">
                  <Button variant="outline" className="rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                    Read the Docs
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

      {/* Software Download Section */}
      <section id="download" className="py-16 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Download Trade Copier</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Get our high-frequency trading software that allows you to copy trades between different MetaTrader platforms from the same computer.
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
              <p className="text-sm text-gray-500">Compatible with Windows 10 and above. Supports MetaTrader 4 & 5 for high-frequency trading.</p>
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
              <p className="text-sm text-gray-500">Compatible with macOS Monterey and above. Optimized for Apple Silicon with MetaTrader support.</p>
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
              <p className="text-sm text-gray-500">For Linux distributions with Wine support. Ideal for server-based trading setups.</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">Need help with setup? Check our <Link href="/dashboard/documents" className="text-black font-medium">documentation</Link> for detailed installation instructions.</p>
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
                  Copy trades between accounts from the same IP address, eliminating the risk of account blocks by prop firms due to IP changes.
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
                  All trading data stays on your computer. No third-party servers involved, ensuring maximum privacy and security for your trading activities.
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
                  Lightning-fast trade copying with minimal latency. Crucial for high-frequency trading where every millisecond counts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Pricing Plans</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Choose the perfect plan for your trading needs. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Basic</h3>
                <p className="mt-4 text-sm text-gray-500">Essential copying features for individual traders.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <Button
                  asChild
                  className="mt-8 block w-full bg-white border border-gray-800 rounded-md py-2 text-sm font-semibold text-gray-900 text-center hover:bg-gray-50"
                >
                  <Link href="/sign-up">Sign up for free</Link>
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">What's included</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Single master account</span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Up to 2 slave accounts</span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Community support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Trader</h3>
                <p className="mt-4 text-sm text-gray-500">Advanced features for serious traders with multiple accounts.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$29</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <Button
                  asChild
                  className="mt-8 block w-full bg-black border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-800"
                >
                  <Link href="/pricing">Go Premium</Link>
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">What's included</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">All Basic features</span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Up to 3 master accounts</span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Up to 5 slave accounts</span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Priority email support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-black rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Professional</h3>
                <p className="mt-4 text-sm text-gray-500">Ultimate solution for professional traders and fund managers.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$79</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <Button
                  asChild
                  className="mt-8 block w-full bg-black border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-800"
                >
                  <Link href="/pricing">Go Premium</Link>
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">What's included</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">All Trader features</span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Unlimited master accounts</span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Unlimited slave accounts</span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">24/7 priority support</span>
                  </li>
                  <li className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">Ultra-low latency mode</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/pricing">
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md text-base font-medium">
                View detailed comparison
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to revolutionize your trading?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Our Trade Copier software provides everything you need to copy trades between platforms with the same IP address. Perfect for prop firm traders who want to maintain compliance while copying trades.
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
