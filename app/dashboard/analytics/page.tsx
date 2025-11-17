'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PaymentAnalytics from '@/components/PaymentAnalytics'
import ClientAnalytics from '@/components/ClientAnalytics'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Track your business performance and payment analytics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentAnalytics />
        <ClientAnalytics />
      </div>

      {/* Additional analytics cards can be added here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Revenue chart coming soon
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoice Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Performance metrics coming soon
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Client Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Client analytics coming soon
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}