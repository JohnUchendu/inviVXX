// components/pricing/PublicPricing.tsx
'use client'
import { useState } from 'react'

const publicPlans = [
  {
    name: 'Free',
    price: 0,
    features: ['3 invoices/day', 'PDF to self', '1 template', 'Basic support'],
    cta: 'Get Started'
  },
  {
    name: 'Starter',
    price: 2000,
    features: ['Unlimited invoices', 'Email to clients', '5 templates', 'QR payments'],
    cta: 'Start Trial',
    popular: true
  },
  {
    name: 'Growth', 
    price: 8000,
    features: ['Bulk send', 'Email tracking', '15 templates', 'Advanced analytics'],
    cta: 'Start Trial'
  },
  {
    name: 'Premium',
    price: 25000, 
    features: ['Unlimited everything', 'Multi-user', 'API access', 'Custom branding'],
    cta: 'Contact Sales'
  }
]

export default function PublicPricing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
      {publicPlans.map(plan => (
        <div key={plan.name} className={`border rounded-lg p-6 ${plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}>
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <div className="my-4">
            <span className="text-3xl font-bold">₦{plan.price.toLocaleString()}</span>
            <span className="text-gray-600">/month</span>
          </div>
          <ul className="space-y-2 mb-6">
            {plan.features.map(feature => (
              <li key={feature} className="text-sm">✓ {feature}</li>
            ))}
          </ul>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
            {plan.cta}
          </button>
        </div>
      ))}
    </div>
  )
}