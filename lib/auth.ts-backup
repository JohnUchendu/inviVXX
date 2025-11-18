// lib/auth.ts

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

// Re-export authOptions
export { authOptions }

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requirePaid() {
  const user = await requireAuth()
  if ((user as any).plan === 'free') throw new Error('Upgrade required')
  return user
}