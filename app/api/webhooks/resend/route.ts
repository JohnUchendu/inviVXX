// app/api/webhooks/resend/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, data } = body

    console.log('Resend webhook received:', type, data)

    // Handle different webhook events
    switch (type) {
      case 'email.sent':
        await handleEmailSent(data)
        break
      case 'email.delivered':
        await handleEmailDelivered(data)
        break
      case 'email.opened':
        await handleEmailOpened(data)
        break
      case 'email.clicked':
        await handleEmailClicked(data)
        break
      case 'email.bounced':
        await handleEmailBounced(data)
        break
      case 'email.complained':
        await handleEmailComplained(data)
        break
      default:
        console.log('Unhandled webhook type:', type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleEmailSent(data: any) {
  // Email was successfully sent
  await (prisma as any).invoice.updateMany({
    where: { emailId: data.email_id },
    data: { 
      emailStatus: 'sent',
      sentAt: new Date()
    }
  })
}

async function handleEmailDelivered(data: any) {
  // Email was delivered to recipient
  await (prisma as any).invoice.updateMany({
    where: { emailId: data.email_id },
    data: { 
      emailStatus: 'delivered',
      deliveredAt: new Date()
    }
  })
}

async function handleEmailOpened(data: any) {
  // Recipient opened the email
  await (prisma as any).invoice.updateMany({
    where: { emailId: data.email_id },
    data: { 
      emailStatus: 'opened',
      openedAt: new Date(),
      openedCount: { increment: 1 },
      lastOpenedAt: new Date()
    }
  })
}

async function handleEmailClicked(data: any) {
  // Recipient clicked a link in the email
  await (prisma as any).invoice.updateMany({
    where: { emailId: data.email_id },
    data: { 
      clickedAt: new Date(),
      clickCount: { increment: 1 },
      lastClickedAt: new Date()
    }
  })
}

async function handleEmailBounced(data: any) {
  // Email bounced
  await (prisma as any).invoice.updateMany({
    where: { emailId: data.email_id },
    data: { 
      emailStatus: 'bounced',
      bouncedAt: new Date()
    }
  })
}

async function handleEmailComplained(data: any) {
  // Recipient marked as spam
  await (prisma as any).invoice.updateMany({
    where: { emailId: data.email_id },
    data: { 
      emailStatus: 'complained',
      complainedAt: new Date()
    }
  })
}
