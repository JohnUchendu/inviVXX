// app/api/paystack/verify-account/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bankCode, accountNumber } = await req.json()

    // Verify account with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        account_name: paystackData.data.account_name
      }
    })
  } catch (error) {
    console.error('Account verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify account' },
      { status: 500 }
    )
  }
}
