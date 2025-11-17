// components/SessionLoader.tsx

'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function SessionLoader() {
  const { data: session, status } = useSession()

  // Force a session refresh on mount (optional)
  useEffect(() => {
    if (status === 'loading') return
  }, [status])

  return null
}
