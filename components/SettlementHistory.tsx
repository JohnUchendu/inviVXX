// components/SettlementHistory.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Calendar, DollarSign, Clock } from 'lucide-react'
import { Button } from './ui/button'

interface Settlement {
  id: string
  amount: number
  status: 'success' | 'pending' | 'failed'
  settlementDate: string
  expectedDate: string
  reference: string
}

export default function SettlementHistory() {
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettlements()
  }, [])

  const fetchSettlements = async () => {
    try {
      const res = await fetch('/api/paystack/settlements')
      if (res.ok) {
        const data = await res.json()
        setSettlements(data.settlements)
      }
    } catch (error) {
      console.error('Failed to fetch settlements:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Settlement History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {settlements.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No settlements yet</h3>
            <p className="text-gray-600">
              Your settlement history will appear here once you receive payments
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {settlements.map(settlement => (
              <div key={settlement.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">₦{settlement.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusBadge(settlement.status)}>
                        {settlement.status}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {new Date(settlement.settlementDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Ref: {settlement.reference}</p>
                  {settlement.status === 'pending' && (
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <Clock className="w-3 h-3" />
                      Expected: {new Date(settlement.expectedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export Button */}
        {settlements.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Settlement Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
