// components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="w-5 h-5 bg-blue-600 rounded"></div>
              iBiz
            </div>
            <p className="text-sm text-gray-600">
              Professional invoices for Nigerian businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/pricing" className="hover:text-blue-600 transition">Pricing</Link></li>
              <li><a href="/features" className="hover:text-blue-600 transition">Features</a></li>
              <li><a href="/templates" className="hover:text-blue-600 transition">Templates</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-blue-600 transition">About</a></li>
              <li><a href="/blog" className="hover:text-blue-600 transition">Blog</a></li>
              <li><a href="/contact" className="hover:text-blue-600 transition">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/privacy" className="hover:text-blue-600 transition">Privacy</a></li>
              <li><a href="/terms" className="hover:text-blue-600 transition">Terms</a></li>
              <li><a href="/cookies" className="hover:text-blue-600 transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} iBiz. Made with love in Nigeria</p>
        </div>
      </div>
    </footer>
  )
}