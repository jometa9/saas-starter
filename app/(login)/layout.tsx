import "../globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IPTRADE - Login",
  description: "The high-frequency trade copier software for MetaTrader",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex flex-col min-h-screen`}>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </main>
      <footer className="py-6 border-t bg-gray-50">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} IPTRADE. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
