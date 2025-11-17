// app/billing/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Zap, Star, Users, Check } from 'lucide-react'

export default function BillingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const userPlan = (session?.user as any)?.plan || 'free'
  
  const plans = [
    {
      name: 'Free',
      price: '₦0',
      icon: Star,
      features: ['3 invoices per day', 'Email to self', 'Basic templates']
    },
    {
      name: 'Starter', 
      price: '₦2,000',
      icon: Zap,
      features: ['Unlimited invoices', 'Send to clients', '5 templates', 'QR payments']
    },
    {
      name: 'Growth',
      price: '₦8,000', 
      icon: Users,
      features: ['Everything in Starter', 'Bulk sending', '15 templates', 'Advanced analytics']
    },
    {
      name: 'Premium',
      price: '₦25,000',
      icon: Crown,
      features: ['Everything in Growth', 'Multi-user access', 'API access', 'Custom branding']
    }
  ]

  const currentPlan = plans.find(p => p.name.toLowerCase() === userPlan)

  const handleUpgrade = (plan: string, amount: number) => {
    // Same implementation as in PricingTiers
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Plans</h1>
      <p className="text-gray-600 mb-8">Manage your subscription and billing information</p>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {currentPlan && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <currentPlan.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
                  <p className="text-gray-600">{currentPlan.price}/month</p>
                </div>
              </div>
              <Badge className={
                userPlan === 'free' ? 'bg-gray-100 text-gray-800' :
                userPlan === 'starter' ? 'bg-blue-100 text-blue-800' :
                userPlan === 'growth' ? 'bg-purple-100 text-purple-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {userPlan === 'free' ? 'Current' : 'Active'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.filter(p => p.name.toLowerCase() !== userPlan).map((plan) => (
              <Card key={plan.name} className="text-center">
                <CardContent className="p-6">
                  <div className="p-3 rounded-full bg-gray-100 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <plan.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold mb-4">{plan.price}/month</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      const amount = plan.name === 'Starter' ? 2000 : 
                                    plan.name === 'Growth' ? 8000 : 25000
                      handleUpgrade(plan.name.toLowerCase(), amount)
                    }}
                  >
                    Upgrade to {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}