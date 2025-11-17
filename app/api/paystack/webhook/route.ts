// app/api/paystack/webhook/route.ts
import { NextResponse } from 'next/server'
import db  from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  const text = await req.text()
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(text)
    .digest('hex')

  const signature = req.headers.get('x-paystack-signature')

  // SECURITY: Verify signature
  if (hash !== signature) {
    console.warn('Invalid Paystack signature')
    return new NextResponse('Invalid signature', { status: 400 })
  }

  const payload = JSON.parse(text)

  // Only handle successful charges
  if (payload.event === 'charge.success') {
    const ref = payload.data.reference

    await db.invoice.updateMany({
      where: { paymentRef: ref }, // Use paymentRef, NOT invoiceNumber
      data: { paymentStatus: 'paid' },
    })
  }

  return NextResponse.json({ received: true })
}
