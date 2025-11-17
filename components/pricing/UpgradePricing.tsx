// components/pricing/UpgradePricing.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const upgradePlans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Unlimited basic invoices',
      'PDF email to self', 
      '1 professional template',
      'PWA offline drafting',
      '3 invoices per day limit',
      'Basic email support'
    ],
    limitations: ['Send to clients disabled', 'Limited to 3 invoices/day'],
    cta: 'Current Plan',
    current: true
  },
  {
    name: 'Starter',
    price: 2000,
    description: 'For freelancers & small businesses',
    features: [
      'Everything in Free',
      'Unlimited invoices',
      '5 professional templates', 
      'QR code payments',
      'Email to clients',
      'Basic analytics (opens)',
      'Priority email support'
    ],
    limitations: ['No bulk sending', 'Limited templates'],
    cta: 'Upgrade to Starter',
    popular: true
  },
  {
    name: 'Growth', 
    price: 8000,
    description: 'For growing businesses',
    features: [
      'Everything in Starter',
      'Send to clients',
      'Full email tracking',
      '15 professional templates',
      'Bulk send (20 invoices)',
      'CSV export',
      'Advanced analytics',
      'Priority phone support'
    ],
    limitations: ['No multi-user access'],
    cta: 'Upgrade to Growth'
  },
  {
    name: 'Premium',
    price: 25000,
    description: 'For teams & scaling businesses', 
    features: [
      'Everything in Growth',
      'Unlimited templates',
      'Multi-user access (3 users)',
      'API access',
      'Custom branding',
      'Advanced reporting',
      'Dedicated account manager',
      'White-label options'
    ],
    limitations: [],
    cta: 'Contact Sales'
  }
]

interface UpgradePricingProps {
  currentPlan: string
}

export default function UpgradePricing({ currentPlan }: UpgradePricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly')
  const { data: session, update } = useSession()
  const router = useRouter()

  const handleUpgrade = async (planName: string, price: number) => {
    if (planName === 'Premium') {
      // Redirect to contact form
      router.push('/contact')
      return
    }

    try {
      // For now, just update the user's plan in the session
      // Later, integrate with Paystack subscription
      const response = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planName.toLowerCase(),
          billingCycle
        })
      })

      if (response.ok) {
        await update() // Refresh session
        router.push('/dashboard?upgrade=success')
      }
    } catch (error) {
      console.error('Upgrade failed:', error)
    }
  }

  const getPrice = (plan: typeof upgradePlans[0]) => {
    const quarterlyPrice = Math.floor(plan.price * 3 * 0.9) // 10% discount for quarterly
    return billingCycle === 'monthly' ? plan.price : quarterlyPrice
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You're currently on the <strong>{currentPlan}</strong> plan. Upgrade to unlock more features.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex rounded-md bg-white p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingCycle === 'quarterly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Quarterly (Save 10%)
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {upgradePlans.map((plan) => {
            const isCurrentPlan = plan.name.toLowerCase() === currentPlan.toLowerCase()
            const price = getPrice(plan)
            const isQuarterly = billingCycle === 'quarterly'
            
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl bg-white p-8 shadow-sm border-2 ${
                  plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : 
                  isCurrentPlan ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ₦{price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/{isQuarterly ? 'quarter' : 'month'}</span>
                    {isQuarterly && plan.price > 0 && (
                      <div className="text-sm text-green-600 mt-1">
                        Save ₦{(plan.price * 3 - price).toLocaleString()} vs monthly
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-700">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Limitations:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="text-sm text-gray-600">• {limitation}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.name, price)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-sm ${
                    isCurrentPlan
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.cta}
                </button>
              </div>
            )
          })}
        </div>

        {/* Upgrade API Route Note */}
        <div className="mt-12 text-center text-gray-600">
          <p>💡 Need help choosing a plan? <a href="/contact" className="text-blue-600 hover:underline">Contact our sales team</a></p>
        </div>
      </div>
    </div>
  )
}
