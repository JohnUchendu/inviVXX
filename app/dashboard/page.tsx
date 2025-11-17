// app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, Users, BarChart3, Settings, 
  Plus, Zap, Crown, Palette 
} from 'lucide-react'

// Import all our components
import InvoiceForm from '@/components/InvoiceForm'
import BulkInvoiceSender from '@/components/BulkInvoiceSender'

// import EmailAnalytics from '@/components/'
import InvoiceTemplates from '@/components/InvoiceTemplates'

export default function Dashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('create')
  const userPlan = (session?.user as any)?.plan || 'free'

  const PlanBadge = () => {
    const getPlanColor = () => {
      switch (userPlan) {
        case 'free': return 'bg-gray-100 text-gray-800'
        case 'starter': return 'bg-blue-100 text-blue-800'
        case 'growth': return 'bg-purple-100 text-purple-800'
        case 'premium': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    const getPlanIcon = () => {
      switch (userPlan) {
        case 'free': return <Zap className="w-3 h-3" />
        case 'starter': return <Zap className="w-3 h-3" />
        case 'growth': return <Crown className="w-3 h-3" />
        case 'premium': return <Crown className="w-3 h-3" />
        default: return <Zap className="w-3 h-3" />
      }
    }

    return (
      <Badge className={`flex items-center gap-1 ${getPlanColor()}`}>
        {getPlanIcon()}
        {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {session?.user?.name || session?.user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PlanBadge />
              <Button 
                onClick={() => window.location.href = '/pricing'}
                variant={userPlan === 'free' ? 'default' : 'outline'}
                size="sm"
              >
                {userPlan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Invoice</span>
            </TabsTrigger>
            
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
           
          </TabsList>

          {/* Create Invoice Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InvoiceForm isFreeMode={userPlan === 'free'} />
              </div>
              <div className="space-y-6">
                {/* Bulk Send for Growth/Premium */}
                {(userPlan === 'growth' || userPlan === 'premium') && (
                  <BulkInvoiceSender />
                )}
                
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Invoices This Month</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Payments</span>
                      <Badge variant="secondary">₦150,000</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Clients</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          
          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <InvoiceTemplates />
            
            {/* Template Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Brand Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Business Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Business Logo</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Upload your company logo</p>
                          <Button variant="outline" size="sm">
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Brand Colors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Primary Color</span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded border" style={{ backgroundColor: '#2563eb' }}></div>
                          <span className="text-xs text-gray-600">#2563eb</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Secondary Color</span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded border" style={{ backgroundColor: '#64748b' }}></div>
                          <span className="text-xs text-gray-600">#64748b</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Palette className="w-4 h-4 mr-2" />
                        Customize Colors
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

      
        </Tabs>
      </div>
    </div>
  )
}