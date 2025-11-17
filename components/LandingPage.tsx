
'use client'

import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import InvoiceForm from './InvoiceForm'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  if (session) {
    return (
      <main className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-8">
          <InvoiceForm isFreeMode={session.user.plan === 'free'} />
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors">
      {/* Main Content */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Hero */}
        <div className={`flex flex-col justify-center px-8 py-16 transition-all duration-500 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}>
          <div className="max-w-md mx-auto w-full">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-12">
              <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded"></div>
              <span className="text-lg font-semibold">iBiz</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Get paid
              <span className="block text-gray-600 dark:text-gray-400">
                faster.
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Everything you need to manage invoices, track payments, and grow your Nigerian business.
            </p>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              {[
                'Create professional invoices in seconds',
                'Track client payments and reminders',
                'Send bulk invoices to multiple clients',
                'Monitor opened and viewed invoices',
                'Manage client database efficiently',
                'Secure bank account integration',
                'Real-time payment notifications',
                'Automated receipt generation'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
              
              <Link
                href="/register"
                className="block w-full text-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
              >
                Start Free Trial
              </Link>

              <Link
                href="/login"
                className="block w-full text-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                Already have an account? Sign in
              </Link>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-500 text-center">
              Trusted by 10,000+ Nigerian businesses
            </div>
          </div>
        </div>

        {/* Right Side - Interactive Demo */}
        <div className={`flex items-center justify-center p-8 transition-all duration-500 delay-200 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}>
          <div className="relative w-full max-w-md h-[600px]">
            {/* Client List Card */}
            <div className="absolute top-4 left-0 w-80 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Client List</h3>
                <span className="text-xs text-gray-500">4 clients</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Femi Adebayo', email: 'femi@adebayostores.com', status: 'active' },
                  { name: 'Chioma Nwosu', email: 'chioma@nwosuent.com', status: 'active' },
                  { name: 'Kunle Adeyemi', email: 'kunle@adeyemicorp.com', status: 'pending' },
                  { name: 'Aisha Bello', email: 'aisha@bellogroup.com', status: 'active' }
                ].map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{client.name}</p>
                        <p className="text-xs text-gray-500">{client.email}</p>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      client.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Account Card */}
            <div className="absolute top-48 right-0 w-72 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Bank Accounts</h3>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  + Add
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">GTBank</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">•••• 2345</p>
                  <p className="text-xs text-gray-500">₦450,000.00</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Zenith Bank</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">•••• 6789</p>
                  <p className="text-xs text-gray-500">₦780,000.00</p>
                </div>
              </div>
            </div>

            {/* Bulk Invoices Card */}
            <div className="absolute bottom-32 left-4 w-76 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Bulk Invoice</h3>
                <span className="text-xs text-green-600 dark:text-green-400">Ready</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Recipients</span>
                  <span className="font-medium">12 clients</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                  <span className="font-medium">₦2,450,000</span>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300">Scheduled</span>
                    <span className="text-blue-700 dark:text-blue-300">Tomorrow, 10:00 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Tracking Card */}
            <div className="absolute bottom-4 right-8 w-80 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Invoice Tracking</h3>
                <span className="text-xs text-gray-500">#INV-001</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Sent to Femi Adebayo</span>
                  <span className="text-green-600 dark:text-green-400">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Invoice opened</span>
                  <span className="text-blue-600 dark:text-blue-400">1 hour ago</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Payment received</span>
                  <span className="text-green-600 dark:text-green-400">Just now</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {/* <div className="py-16 px-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Get Paid</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Client Management',
                description: 'Organize all your clients with contact details and payment history',
                icon: '👥'
              },
              {
                title: 'Bank Integration',
                description: 'Connect multiple bank accounts and track payments automatically',
                icon: '🏦'
              },
              {
                title: 'Bulk Invoicing',
                description: 'Send invoices to multiple clients at once with personalized templates',
                icon: '📨'
              },
              {
                title: 'Real-time Tracking',
                description: 'See when clients open your invoices and track payment status',
                icon: '📊'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-xl mb-4 mx-auto border border-gray-200 dark:border-gray-700">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Simple Footer */}
      {/* <footer className="border-t border-gray-200 dark:border-gray-800 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-4 h-4 bg-gray-900 dark:bg-white rounded"></div>
              <span className="text-sm font-medium">iBiz</span>
            </div>
            
            <div className="flex space-x-6 text-xs text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help</a>
            </div>
            
            <div className="mt-4 md:mt-0 text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} iBiz
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  )
}
