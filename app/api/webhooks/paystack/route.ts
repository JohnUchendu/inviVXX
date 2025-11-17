// app/api/webhooks/paystack/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Paystack Webhook Handler
 */
export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-paystack-signature')
    const body = await req.json()

    // Verify webhook signature
    if (!verifyPaystackSignature(body, signature)) {
      console.error('Invalid Paystack webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const { event, data } = body
    console.log('✅ Paystack webhook received:', event)

    switch (event) {
      case 'charge.success':
        await handlePaymentSuccess(data)
        break
      case 'charge.failed':
        await handlePaymentFailed(data)
        break
      case 'transfer.success':
        await handleTransferSuccess(data)
        break
      default:
        console.log('⚠️ Unhandled Paystack event:', event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Paystack webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

/**
 * Verify Paystack webhook signature
 */
function verifyPaystackSignature(body: any, signature: string | null): boolean {
  if (!signature) return false
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(body))
    .digest('hex')
  return hash === signature
}

/**
 * Handle successful payments with auto-settlement
 */
async function handlePaymentSuccess(data: any) {
  const invoiceRef = data.metadata?.invoiceNumber || data.reference
  
  if (!invoiceRef) {
    console.log('No invoice reference found in payment data')
    return
  }

  // Update invoice as paid
  await (prisma as any).invoice.updateMany({
    where: { 
      OR: [
        { invoiceNumber: invoiceRef },
        { paymentRef: data.reference }
      ]
    },
    data: { 
      paymentStatus: 'paid',
      paidAt: new Date(),
      paymentMethod: data.channel,
      paymentRef: data.reference,
      amountPaid: data.amount / 100
    }
  })

  // Get invoice with user details for settlement
  const invoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: invoiceRef },
    include: { user: true }
  })

  if (!invoice || !invoice.user.paystackRecipientCode) {
    console.log('Invoice or recipient code not found - payment recorded but no settlement')
    // Still send confirmation emails even if settlement fails
    await sendPaymentConfirmation(invoiceRef, data)
    return
  }

  // Auto-settle to user's bank account (minus your platform fee)
  await initiateSettlementToUser(invoice, data.amount)

  // Send payment confirmation emails
  await sendPaymentConfirmation(invoiceRef, data)
}

/**
 * Settlement function
 */
async function initiateSettlementToUser(invoice: any, amountInKobo: number) {
  try {
    // Calculate amount after platform fee (2% example)
    const platformFee = Math.round(amountInKobo * 0.02) // 2% platform fee
    const settlementAmount = amountInKobo - platformFee

    // Initiate transfer to user's bank account
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: settlementAmount,
        recipient: invoice.user.paystackRecipientCode,
        reason: `Settlement for invoice ${invoice.invoiceNumber}`
      })
    })

    const transferResult = await transferResponse.json()

    if (transferResult.status) {
      console.log(`💰 Settlement initiated for invoice ${invoice.invoiceNumber}: ₦${(settlementAmount/100).toLocaleString()}`)
      
      // Update invoice with settlement info
      await (prisma as any).invoice.update({
        where: { id: invoice.id },
        data: {
          settlementStatus: 'processing',
          settlementAmount: settlementAmount / 100,
          platformFee: platformFee / 100,
          transferReference: transferResult.data.reference
        }
      })
    } else {
      console.error('Settlement failed:', transferResult.message)
      // Mark settlement as failed but payment is still recorded
      await (prisma as any).invoice.update({
        where: { id: invoice.id },
        data: {
          settlementStatus: 'failed'
        }
      })
    }
  } catch (error) {
    console.error('Settlement initiation error:', error)
    // Mark settlement as failed but payment is still recorded
    await (prisma as any).invoice.update({
      where: { id: invoice.id },
      data: {
        settlementStatus: 'failed'
      }
    })
  }
}

/**
 * Handle failed payments
 */
async function handlePaymentFailed(data: any) {
  const invoiceRef = data.metadata?.invoiceNumber || data.reference
  
  // Use type assertion for consistency
  await (prisma as any).invoice.updateMany({
    where: {
      OR: [
        { invoiceNumber: invoiceRef },
        { paymentRef: data.reference }
      ]
    },
    data: {
      paymentStatus: 'failed'
    }
  })
}

/**
 * Handle successful transfers
 */
async function handleTransferSuccess(data: any) {
  console.log('💸 Transfer successful:', data)
  
  // Update invoice settlement status when transfer is successful
  if (data.reference) {
    await (prisma as any).invoice.updateMany({
      where: {
        transferReference: data.reference
      },
      data: {
        settlementStatus: 'completed'
      }
    })
  }
}

/**
 * Send email notifications
 */
async function sendPaymentConfirmation(invoiceRef: string, paymentData: any) {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: invoiceRef },
      include: { user: true }
    })

    if (!invoice) return

    // Send confirmation to business owner
    await resend.emails.send({
      from: 'iBiz Payments <payments@mail.ibiz.name.ng>',
      to: invoice.user.email,
      subject: `💰 Payment Received for Invoice ${invoiceRef}`,
      html: generatePaymentConfirmationTemplate(invoice, paymentData, 'owner'),
    })

    // Send receipt to client
    if (invoice.clientEmail) {
      await resend.emails.send({
        from: 'iBiz Payments <payments@mail.ibiz.ng>',
        to: invoice.clientEmail,
        subject: `✅ Payment Confirmation - Invoice ${invoiceRef}`,
        html: generatePaymentConfirmationTemplate(invoice, paymentData, 'client'),
      })
    }
  } catch (error) {
    console.error('Failed to send payment confirmation emails:', error)
  }
}

/**
 * Generate Email Template
 */
function generatePaymentConfirmationTemplate(invoice: any, paymentData: any, recipient: 'owner' | 'client'): string {
  const amount = (paymentData.amount / 100).toLocaleString()
  const paymentDate = new Date(paymentData.paid_at).toLocaleDateString()

  if (recipient === 'owner') {
    return `
      <html>
        <body style="font-family: Arial; background: #f9fafb; padding: 20px;">
          <h1 style="color: #059669;">💰 Payment Received!</h1>
          <p>Your client <strong>${invoice.clientName}</strong> has paid invoice <strong>${invoice.invoiceNumber}</strong>.</p>
          <p><b>Amount:</b> ₦${amount}</p>
          <p><b>Method:</b> ${paymentData.channel || 'Card'}</p>
          <p><b>Date:</b> ${paymentDate}</p>
          <hr />
          <p>Funds will be settled to your account within 24 hours.</p>
          <p style="font-size: 12px; color: #6b7280;">Processed by iBiz Invoice Generator.</p>
        </body>
      </html>
    `
  } else {
    return `
      <html>
        <body style="font-family: Arial; background: #f9fafb; padding: 20px;">
          <h1 style="color: #059669;">✅ Payment Confirmed</h1>
          <p>Your payment for invoice <strong>${invoice.invoiceNumber}</strong> has been received.</p>
          <p><b>Amount:</b> ₦${amount}</p>
          <p><b>Date:</b> ${paymentDate}</p>
          <p><b>Paid To:</b> ${invoice.businessName}</p>
          <hr />
          <p style="font-size: 12px; color: #6b7280;">Generated by iBiz Invoice Generator.</p>
        </body>
      </html>
    `
  }
}
