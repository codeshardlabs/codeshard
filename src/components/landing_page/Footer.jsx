import { Twitter } from "lucide-react";
import { Github } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-gray-300 py-10 px-6 mt-10 border-t border-gray-300/20">
      <div className="container mx-auto text-center space-y-6">
        {/* Brand Name */}
        <h2 className="text-2xl font-bold text-white">CODESHARD</h2>
        <p className="text-base text-gray-400">
          Collaborative Code Editor for Seamless Real-Time Coding
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-8 my-6">
          <Link
            href="https://x.com/code_shard"
            aria-label="Follow us on Twitter"
          >
            <Twitter className="h-6 w-6 text-white hover:text-blue-500 transition duration-300" />
          </Link>
          <Link
            href="https://github.com/MridulDhiman/code-shard"
            aria-label="Check our GitHub"
          >
            <Github className="h-6 w-6 text-white hover:text-gray-500 transition duration-300" />
          </Link>
        </div>

        {/* Terms & Conditions / Privacy Policy Links */}
        <div className="space-x-8">
          <Link
            href="/terms"
            className="text-sm text-gray-400 hover:text-gray-200 transition duration-300"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm text-gray-400 hover:text-gray-200 transition duration-300"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Copyright Notice */}
        <p className="text-xs text-gray-500 mt-4">
          &copy; 2024 CodeShard. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
