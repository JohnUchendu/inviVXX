// app/payment/verify/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function PaymentVerify() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference')
      
      if (!reference) {
        setStatus('error')
        setMessage('No payment reference found')
        return
      }

      try {
        const res = await fetch(`/api/payment/verify?reference=${reference}`)
        const data = await res.json()

        if (data.success) {
          setStatus('success')
          setMessage(data.message || 'Payment verified successfully!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Payment verification failed')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Failed to verify payment')
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Verifying your payment...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-green-600 mb-4">{message}</p>
              <Button onClick={() => router.push('/')}>
                Go to Dashboard
              </Button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{message}</p>
              <Button onClick={() => router.push('/pricing')}>
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
