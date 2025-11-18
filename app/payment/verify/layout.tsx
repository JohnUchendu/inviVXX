// app/payment/verify/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Verification - InvoicePay',
  description: 'Verify your payment status',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}