// app/api/payment/initialize/route.ts initialize payment for plans
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

    const { plan, amount, email } = await req.json()
    
    // Validate plan
    const validPlans = ['starter', 'growth', 'premium']
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || session.user.email,
        amount: amount * 100, // Paystack expects amount in kobo
        metadata: {
          plan,
          userId: (session.user as any).id,
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: plan
            }
          ]
        },
        callback_url: `${process.env.NEXTAUTH_URL}/payment/verify`
      })
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message }, { status: 400 })
    }

    // Store payment reference in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        subscriptionId: paystackData.data.reference
      }
    })

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
