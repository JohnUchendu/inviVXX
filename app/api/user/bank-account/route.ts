// app/api/user/bank-account/route.ts

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

    const { bankCode, accountNumber, accountName, bankName } = await req.json()

    // Create transfer recipient in Paystack
    const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'nuban',
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: 'NGN'
      })
    })

    const recipientData = await recipientResponse.json()

    if (!recipientData.status) {
      return NextResponse.json({ error: recipientData.message }, { status: 400 })
    }

    // Save to database with type assertion
    await (prisma as any).user.update({
      where: { email: session.user.email },
      data: {
        bankCode,
        accountNumber,
        accountName,
        bankName,
        paystackRecipientCode: recipientData.data.recipient_code
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Bank account setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup bank account' },
      { status: 500 }
    )
  }
}
