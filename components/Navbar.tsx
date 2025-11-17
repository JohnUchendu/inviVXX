// components/Navbar.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'

export default function Navbar() {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useClickOutside(() => setIsDropdownOpen(false))

  if (!session) {
    return null
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">iBiz</div>
            <span className="text-sm text-gray-500">Invoices</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Create Invoice
            </Link>
            <Link 
              href="/dashboard/invoices" 
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              My Invoices
            </Link>
            <Link 
              href="/dashboard/clients" 
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Clients
            </Link>
            <Link 
              href="/dashboard/analytics" 
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Analytics
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Pricing
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="text-right hidden sm:block">
                <div className="font-medium text-gray-900">
                  {session.user.name || session.user.email}
                </div>
                <div className="text-gray-500 text-xs capitalize">
                  {session.user.plan} Plan
                </div>
              </div>
              
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-blue-600 font-semibold text-lg">
                    {(session.user.name || session.user.email)?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                  Signed in as<br />
                  <span className="font-medium text-gray-900">{session.user.email}</span>
                </div>
                
                <Link
                  href="/dashboard/settings/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile Settings
                </Link>
                
                <Link 
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/settings/billing"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {session.user.plan === 'free' ? 'Upgrade to Pro' : 'Billing & Plans'}
                </Link>

                <Link
                  href="/dashboard/settings/bank"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Bank Account
                </Link>

                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                    setIsDropdownOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="container mx-auto px-4 py-2 flex justify-around">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-blue-600 font-medium text-sm"
          >
            Create
          </Link>
          <Link 
            href="/dashboard/invoices" 
            className="text-gray-700 hover:text-blue-600 font-medium text-sm"
          >
            Invoices
          </Link>
          <Link 
            href="/dashboard/clients" 
            className="text-gray-700 hover:text-blue-600 font-medium text-sm"
          >
            Clients
          </Link>
          <Link 
            href="/pricing" 
            className="text-gray-700 hover:text-blue-600 font-medium text-sm"
          >
            Pricing
          </Link>
        </div>
      </div>
    </nav>
  )
}