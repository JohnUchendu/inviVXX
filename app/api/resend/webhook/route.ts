// app/api/resend/webhook/route.ts

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const payload = await req.json()
  if (payload.event === 'email.opened') {
    await db.invoice.updateMany({
      where: { emailId: payload.email_id },
      data: { emailStatus: 'opened' }
    })
  }
  return NextResponse.json({ received: true })
}