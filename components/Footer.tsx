// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t dark:bg-black text-gray-900 dark:text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"  // <-- Replace with your NebulaPay logo
                alt="NebulaPay Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="font-bold text-xl">NebulaPay</span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Superfast invoicing, smart tracking, and effortless client
              management for freelancers and businesses across Africa.
            </p>
          </div>

          {/* Product */}
          {/* <div>
            <h3 className="font-semibold text-gray-800 mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/pricing" className="hover:text-blue-600 transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-blue-600 transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-blue-600 transition">
                  Invoice Templates
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Company */}
          {/* <div>
            <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-blue-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-600 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Legal */}
          {/* <div>
            <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-blue-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-blue-600 transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div> */}

        </div>

        {/* Creator Line */}
        <div className="mt-10 pt-8 border-t text-center">
          <p className="text-sm text-gray-700">
            Hey 👋 I'm John. The creator of NebulaPay.  
            You can follow my work on{" "}
            <Link
              href="https://x.com/itsjohnuchendu"
              target="_blank"
              className="text-blue-600 hover:underline font-medium"
            >
              Twitter
            </Link>.
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Built with ❤️ in Nigeria.
          </p>

          <p className="text-sm text-gray-400 mt-1">
            &copy; {new Date().getFullYear()} NebulaPay. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
