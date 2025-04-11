import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, Globe, Instagram, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "IPTRADE - About Us",
  description:
    "Learn about IPTRADE, our mission, and the team behind the product.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl text-center font-bold text-gray-900 tracking-tight sm:text-5xl sm:text-left md:text-6xl">
                <span className="italic">About</span>
                <span className="block text-black text-gray-500">
                  IPTRADE
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl text-center sm:text-left">
                We're building the future of trading technology, making it easier
                for traders to copy trades between platforms while maintaining
                IP integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="px-6">
          <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center p-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  At IPTRADE, our mission is to empower traders with the tools
                  they need to succeed in today's competitive market. We believe
                  that technology should make trading more accessible,
                  efficient, and secure.
                </p>
                <p className="mt-3 text-lg text-gray-500">
                  Our software solves a critical problem for prop firm traders:
                  the need to copy trades between different MetaTrader platforms
                  while maintaining the same IP address. This ensures compliance
                  with prop firm policies and eliminates the risk of account
                  blocks.
                </p>
                <div className="mt-8">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border border-blue-600 rounded-full px-4 py-0 inline-flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-xl cursor-pointer border-2"
                  >
                    <Link href="/guide">
                      Learn how it works
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-10 lg:mt-0">
                <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/assets/mission.jpg"
                    alt="IPTRADE Mission"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              The principles that guide everything we do at IPTRADE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Innovation</h3>
              <p className="mt-3 text-gray-500">
                We constantly push the boundaries of what's possible in trading
                technology, always looking for new ways to solve problems and
                improve the trading experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-purple-200 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reliability</h3>
              <p className="mt-3 text-gray-500">
                We understand that traders depend on our software for their
                livelihood. That's why we prioritize stability, performance, and
                security in everything we build.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-green-200 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Transparency</h3>
              <p className="mt-3 text-gray-500">
                We believe in being open and honest with our users. We
                communicate clearly about our product, our pricing, and our
                roadmap for the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-4xl mx-auto">
        <div className="px-6">
          <div className="overflow-hidden">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 p-8">
              <div className="lg:col-span-1 flex justify-center">
                <div className="relative h-60 w-60 rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <Image
                    src="/assets/founder.jpg"
                    alt="IPTRADE Founder"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="mt-10 lg:mt-0 lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Joaquin Metayer
                </h3>
                <p className="mt-1 text-lg text-gray-500">Founder & CEO</p>
                <p className="mt-4 text-gray-500">
                  As a passionate trader and software developer, I created IPTRADE
                  to solve a critical problem I faced while trading with multiple
                  prop firms. Our mission is to make trading more accessible and
                  efficient for everyone.
                </p>
                <div className="mt-6 flex space-x-4">
                  <a
                    href="https://linkedin.com/in/joaquinmetayer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="https://iptrade.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                  <a
                    href="https://instagram.com/joaquinmetayer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
