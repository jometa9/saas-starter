// components/DownloadSection.tsx

import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";

const DownloadCard = ({ compactMode = false }: { compactMode?: boolean }) => {
  return (
    <section
      id="download"
      className={` w-full${compactMode ? "pt-4" : "py-12 "}`}
    >
      <div className={`${compactMode ? "" : "px-4"}`}>
        {!compactMode && (
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Download IPTRADE
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-gray-600">
              Get everything you need to start copying trades between MetaTrader
              platforms
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* IPTRADE Desktop App */}
          <div className={"w-full"}>
            {!compactMode && (
              <div className="flex items-center mb-4 gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center shadow">
                  <img
                    src="/assets/iconShadow025.png"
                    alt="IPTRADE Icon"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-xl">IPTRADE App</h3>
              </div>
            )}
            <div>
              <DownloadContainer title="IPTRADE Windows App" version="v1.0.0" />
              <DownloadContainer title="IPTRADE macOS App" version="v1.0.0" />
            </div>
          </div>

          {/* EA Source Code */}
          <div className="w-full">
            {!compactMode && (
              <div className="flex items-center mb-4 gap-4">
                <div className="w-16 h-16 rounded-xl border-2 border-gray-200 flex items-center justify-center shadow">
                  <img
                    src="/assets/metatrader5_expert_advisors_logo.png"
                    alt="Expert Advisor"
                    className="w-10 h-10 object-contain bg-gray-50"
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-xl">
                  EA Source Code
                </h3>
              </div>
            )}
            <div>
              <DownloadContainer
                title="MT4 EA File"
                version="Direct File Download"
                color="blue"
              />
              <DownloadContainer
                title="MT5 EA File"
                version="Direct File Download"
                color="blue"
              />
            </div>
          </div>

          {/* MetaTrader Platforms */}
          <div className="w-full">
            {!compactMode && (
              <div className="flex items-center mb-4 gap-4">
                <div className="w-16 h-16 rounded-xl border-2 border-gray-200 flex items-center justify-center shadow">
                  <img
                    src="/assets/mql5_logo__2.jpg"
                    alt="MQL5 Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-xl">
                  MQL5 Direct Download
                </h3>
              </div>
            )}
            <div>
              <ExternalLinkCard
                title="MQL5 Market MT4 EA"
                version="Official Platform Download"
                href="https://www.mql5.com/en/download/mt4"
              />
              <ExternalLinkCard
                title="MQL5 Market MT5 EA"
                version="Official Platform Download"
                href="https://www.mql5.com/en/download/mt5"
              />
            </div>
          </div>
        </div>

        {!compactMode && (
          <div className="text-center mt-2">
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
        )}
      </div>
    </section>
  );
};

const DownloadContainer = ({
  title,
  version,
  color = "black",
}: {
  title: string;
  version: string;
  color?: "black" | "blue";
}) => {
  const base = {
    black: "border-black bg-gray-50",
    blue: "border-blue-800 bg-blue-50",
  };

  return (
    <div
      className={`border-2 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow mb-4 cursor-pointer ${base[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-lg">{title}</h4>
          <p className="text-sm text-muted-foreground">{version}</p>
        </div>
        <Download className="h-8 w-8 p-1" />
      </div>
    </div>
  );
};

const ExternalLinkCard = ({
  title,
  version,
  href,
}: {
  title: string;
  version: string;
  href: string;
}) => {
  return (
    <div className="border border-yellow-600 border-2 rounded-lg p-6 bg-yellow-50 shadow-sm hover:shadow-lg transition-shadow mb-4 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-lg">{title}</h4>
          <p className="text-sm text-muted-foreground">{version}</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <ExternalLink className="h-8 w-8 p-1" />
        </a>
      </div>
    </div>
  );
};

export default DownloadCard;
