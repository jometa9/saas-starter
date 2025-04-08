import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <div className="w-full p-6 ">
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
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full text-gray-600 hover:text-black hover:bg-gray-200 transition-colors flex items-center justify-center"
          aria-label="Instagram"
        >
          Instagram
        </Link>
        <Link
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full text-gray-600 hover:text-black hover:bg-gray-200 transition-colors flex items-center justify-center"
          aria-label="LinkedIn"
        >
          LinkedIn
        </Link>
      </div>
      <p className="text-sm text-gray-500 pt-4">
        &copy; {new Date().getFullYear()} IPTRADE
      </p>
    </div>
  );
} 