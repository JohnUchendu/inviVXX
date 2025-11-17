// components/PricingTiers.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Users, Crown, Image, Banknote, RotateCcw } from 'lucide-react'

const tiers = [
  {
    name: 'Free',
    price: '₦0',
    description: 'Perfect for getting started',
    target: 'New users & occasional use',
    icon: Star,
    features: [
      'Unlimited basic invoices',
      'PDF email to self',
      '1 professional template',
      'PWA offline drafting',
      '3 invoices per day limit',
      'Basic email support',
      '✅ Logo support', // ADDED: Logo for all plans
      '✅ Beautiful invoice templates' // ADDED: Enhanced templates
    ],
    limitations: ['Send to clients disabled', 'Limited to 3 invoices/day'],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Starter',
    price: '₦2,000',
    description: 'For freelancers & small businesses',
    target: '1-5 clients per month',
    icon: Zap,
    features: [
      'Everything in Free',
      'Unlimited invoices',
      '5 professional templates',
      'QR code payments',
      'Email to clients',
      'Basic analytics (opens)',
      'Priority email support',
      '✅ Logo & branding', // ADDED
      '✅ Bank transfers', // ADDED: Auto-settle to bank account
      '✅ Recurring billing' // ADDED: Monthly subscriptions
    ],
    limitations: ['No bulk sending', 'Limited templates'],
    cta: 'Start here',
    popular: true
  },
  {
    name: 'Growth',
    price: '₦8,000',
    description: 'For growing businesses',
    target: '5-15 clients per month',
    icon: Users,
    features: [
      'Everything in Starter',
      'Send to clients',
      'Full email tracking',
      '15 professional templates',
      'Bulk send (20 invoices)',
      'CSV export',
      'Advanced analytics',
      'Priority phone support',
      '✅ Enhanced branding', // ADDED
      '✅ Auto bank settlements', // ADDED
      '✅ Cancel anytime' // ADDED: Subscription flexibility
    ],
    limitations: ['No multi-user access'],
    cta: 'Start 7-Day Trial',
    popular: false
  },
  {
    name: 'Premium',
    price: '₦25,000',
    description: 'For teams & scaling businesses',
    target: '15+ clients per month',
    icon: Crown,
    features: [
      'Everything in Growth',
      'Unlimited templates',
      'Multi-user access (3 users)',
      'API access',
      'Custom branding',
      'Advanced reporting',
      'Dedicated account manager',
      'White-label options',
      '✅ Full bank integration', // ADDED
      '✅ Instant settlements', // ADDED
      '✅ Flexible billing cycles' // ADDED
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false
  }
]

export default function PricingTiers() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'quarterly'>('monthly')
  const { data: session } = useSession()

  // Calculate quarterly pricing with 20% discount
  const getPrice = (price: string) => {
    if (billingPeriod === 'quarterly' && price !== '₦0') {
      const monthlyPrice = parseInt(price.replace('₦', '').replace(',', ''))
      const quarterlyPrice = monthlyPrice * 3 * 0.8 // 20% discount
      return `₦${quarterlyPrice.toLocaleString()}`
    }
    return price
  }

  const getPeriod = () => {
    return billingPeriod === 'quarterly' ? '/quarter' : '/month'
  }

  // NEW: Handle subscription upgrades with recurring billing
  const handleUpgrade = async (plan: string, amount: number) => {
    try {
      const res = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          amount: amount * 1, // Convert to kobo
          email: session?.user?.email,
          type: 'subscription', // NEW: Flag as recurring subscription
          interval: 'monthly' // NEW: 30-day recurring cycle
        })
      })

      const data = await res.json()

      if (data.authorization_url) {
        // Redirect to Paystack for payment
        window.location.href = data.authorization_url
      } else {
        alert(data.error || 'Failed to initialize payment')
      }
    } catch (error) {
      alert('Failed to process payment')
    }
  }

  // NEW: Handle free plan signup/redirect
  const handleFreePlan = () => {
    if (session) {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/register'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            All plans include logo support & beautiful invoices. Cancel anytime.
          </p>
          
          {/* NEW: Enhanced billing toggle with subscription info */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'quarterly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'quarterly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingPeriod === 'quarterly' ? 'text-blue-600' : 'text-gray-500'}`}>
              Quarterly
              {billingPeriod === 'quarterly' && (
                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                  20% OFF
                </Badge>
              )}
            </span>
          </div>

          {/* NEW: Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-green-600" />
              <span>Logo support on all plans</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-green-600" />
              <span>Auto bank transfers</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-green-600" />
              <span>Cancel subscription anytime</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier) => (
            <Card 
              key={tier.name}
              className={`relative transition-all duration-300 hover:scale-105 ${
                tier.popular 
                  ? 'border-2 border-blue-500 shadow-xl' 
                  : 'border border-gray-200 shadow-lg'
              }`}
            >
              {/* Popular Plan Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                {/* Plan Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    tier.name === 'Free' ? 'bg-gray-100' :
                    tier.name === 'Starter' ? 'bg-blue-100' :
                    tier.name === 'Growth' ? 'bg-purple-100' : 'bg-yellow-100'
                  }`}>
                    <tier.icon className={`w-6 h-6 ${
                      tier.name === 'Free' ? 'text-gray-600' :
                      tier.name === 'Starter' ? 'text-blue-600' :
                      tier.name === 'Growth' ? 'text-purple-600' : 'text-yellow-600'
                    }`} />
                  </div>
                </div>
                
                {/* Plan Details */}
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <p className="text-gray-600 text-sm mt-2">{tier.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {getPrice(tier.price)}
                  </span>
                  <span className="text-gray-600">{getPeriod()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{tier.target}</p>
              </CardHeader>
              
              <CardContent>
                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Limitations */}
                {tier.limitations.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 font-medium mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {tier.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start">
                          <span className="text-xs text-gray-500">• {limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Action Button */}
                <Button 
                  className={`w-full ${
                    tier.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : tier.name === 'Free'
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  onClick={() => {
                    if (tier.name !== 'Free') {
                      const amount = tier.name === 'Starter' ? 2000 : 
                                    tier.name === 'Growth' ? 8000 : 25000
                      handleUpgrade(tier.name.toLowerCase(), amount)
                    } else {
                      handleFreePlan()
                    }
                  }}
                >
                  {tier.cta}
                </Button>
                
                {/* Free Plan Note */}
                {tier.name === 'Free' && (
                  <p className="text-xs text-center text-gray-500 mt-3">
                    No credit card required
                  </p>
                )}
                
                {/* NEW: Subscription info for paid plans */}
                {tier.name !== 'Free' && (
                  <p className="text-xs text-center text-gray-500 mt-3">
                    🔄 30-day recurring • Cancel anytime
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-600 text-sm">Yes! Cancel anytime from your billing settings. No lock-in contracts.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do bank transfers work?</h3>
              <p className="text-gray-600 text-sm">Client payments auto-settle to your bank account within 24 hours.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do all plans support logos?</h3>
              <p className="text-gray-600 text-sm">Yes! Upload your business logo on any plan for professional invoices.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">All major Nigerian payment methods: bank transfer, card payments, and USSD.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}