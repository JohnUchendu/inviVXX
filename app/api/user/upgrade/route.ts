// app/api/user/upgrade/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan, billingCycle } = await req.json()

    // TODO: Integrate with Paystack subscription API
    // For now, just update the user's plan in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        plan: plan,
        // Add subscription fields later
      }
    })

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error('Upgrade error:', error)
    return NextResponse.json({ error: 'Upgrade failed' }, { status: 500 })
  }
}
