// app/api/payment/verify/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json({ error: 'No reference provided' }, { status: 400 })
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    const { plan, userId } = paystackData.data.metadata

    // Update user plan
    await prisma.user.update({
      where: { id: userId },
      data: { 
        plan,
        subscriptionId: reference
      }
    })

    return NextResponse.json({ 
      success: true,
      plan,
      message: 'Payment verified and plan upgraded successfully!' 
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
