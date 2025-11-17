// app/upgrade/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import UpgradePricing from '@/components/pricing/UpgradePricing'

export default async function UpgradePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  return <UpgradePricing currentPlan={session.user.plan} />
}
