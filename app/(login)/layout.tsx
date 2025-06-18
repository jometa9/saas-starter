import "../globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IPTRADE",
  description: "The high-frequency trade copier software for MetaTrader",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-[80vh] flex flex-col`}>
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
