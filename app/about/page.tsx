import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, Github, Twitter } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "IPTRADE - About Us",
  description:
    "Learn about IPTRADE, our mission, and the team behind the product.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="py-16">
        <div className="px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              About IPTRADE
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-4 md:max-w-3xl">
              We're building the future of trading technology, making it easier
              for traders to copy trades between platforms.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="px-4">
          <div className="rounded-xl shadow-lg overflow-hidden">
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
                    className="bg-black hover:bg-gray-800 text-white"
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

      <section className="pb-16">
        <div className="px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              The principles that guide everything we do at IPTRADE.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className=" p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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

      <section className="pb-16">
        <div className="px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 p-8">
              <div className="lg:col-span-1 flex justify-center">
                <div className="relative h-80 w-80 rounded-full overflow-hidden shadow-xl border-4 border-white">
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

                <div className="mt-6 prose prose-lg text-gray-500">
                  <p>
                    Joaquin Metayer is a seasoned trader and software developer
                    with over 10 years of experience in the financial markets.
                    After facing the challenges of copying trades between
                    different MetaTrader platforms while maintaining IP
                    integrity, Joaquin decided to create a solution that would
                    benefit the entire trading community.
                  </p>
                  <p>
                    With a background in computer science and a passion for
                    trading, Joaquin combined his technical expertise with his
                    market knowledge to develop IPTRADE. His vision was to
                    create a tool that would make trading more efficient and
                    accessible while ensuring compliance with prop firm
                    policies.
                  </p>
                  <p>
                    "I created IPTRADE because I was tired of the limitations
                    and risks associated with traditional trade copying methods.
                    I wanted a solution that would work seamlessly while
                    maintaining the same IP address, and I couldn't find one
                    that met my needs. So I built it myself."
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://iptrade.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="p-12 pb-20">
        <div className="px-4 text-center">
          <h2 className="text-3xl font-bold">
            Ready to transform your trading?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-300">
            Join thousands of traders who are already using IPTRADE to copy
            trades between platforms while maintaining IP integrity.
          </p>
          <div className="mt-8">
            <Button asChild className="bg-white text-black hover:bg-gray-100">
              <Link href="/dashboard">
                Get started today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
