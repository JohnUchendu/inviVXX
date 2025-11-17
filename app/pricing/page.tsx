// app/pricing/page.tsx 

import PricingTiers from '@/components/PricingTiers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - iBiz Invoice Generator',
  description: 'Simple, transparent pricing for Nigerian businesses. Choose the perfect plan for your needs.',
}

export default function PricingPage() {
  return <PricingTiers />
}
