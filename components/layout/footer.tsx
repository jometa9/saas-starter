import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <div>
      <div className="border-t border-gray-200 mx-4"></div>
      <div className="w-full p-4 ">
        <div className="mb-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-black">IPTRADE</span>
          </Link>
          <p className="text-sm text-gray-600 mt-3">
            Professional trading solutions
          </p>
        </div>

        <div className="flex space-x-4 text-sm">
          <Link
            href="https://www.instagram.com/iptradecopier/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            Instagram
          </Link>
          <Link
            href="https://www.linkedin.com/company/iptrade"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            LinkedIn
          </Link>
        </div>
        <p className="text-sm text-gray-500 pt-4">
          &copy; {new Date().getFullYear()} IPTRADE - All rights reserved.
        </p>
      </div>
    </div>
  );
}
