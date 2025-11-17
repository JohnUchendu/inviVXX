// components/UpgradeBanner.tsx
'use client'
import { useSession } from 'next-auth/react'

export default function UpgradeBanner() {
  const { data: session } = useSession()
  if (session?.user?.plan !== 'free') return null

  return (
    <div className="bg-yellow-100 p-4 text-center">
      <p>
        You are on the <strong>Free</strong> plan.{' '}
        <a href="/upgrade" className="underline text-blue-600">
          Upgrade now
        </a>{' '}
        to send to clients, track opens, and more!
      </p>
    </div>
  )
}
