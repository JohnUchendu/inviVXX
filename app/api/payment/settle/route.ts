// app/api/payment/settle/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { invoiceId } = await request.json()

    // Get invoice with user relation included
    const invoice = await prisma.invoice.findFirst({
      where: { 
        id: invoiceId,
        userId: session.user.id,
        paymentStatus: 'paid',
        settlementStatus: 'pending' // This field exists in your schema
      },
      include: { 
        user: true // FIX: Include the user relation
      }
    })

    if (!invoice) {
      return NextResponse.json({ 
        error: 'Invoice not found, already settled, or not paid' 
      }, { status: 404 })
    }

    // Check if user has bank account setup
    if (!invoice.user.accountNumber || !invoice.user.bankCode) {
      return NextResponse.json({ 
        error: 'Bank account not setup. Please add your bank details in settings.' 
      }, { status: 400 })
    }

    // Check if user is on free plan (no settlements for free)
    if (invoice.user.plan === 'free') {
      return NextResponse.json({ 
        error: 'Bank settlements not available on free plan. Upgrade to settle payments.' 
      }, { status: 403 })
    }

    // Check if user has Paystack recipient code
    if (!invoice.user.paystackRecipientCode) {
      return NextResponse.json({ 
        error: 'Bank account not verified. Please verify your bank account in settings.' 
      }, { status: 400 })
    }

    // Calculate settlement amount (total - platform fee)
    const platformFee = invoice.total * 0.015 // 1.5% platform fee
    const settlementAmount = invoice.total - platformFee

    // Ensure settlement amount is positive
    if (settlementAmount <= 0) {
      return NextResponse.json({ 
        error: 'Settlement amount must be greater than zero' 
      }, { status: 400 })
    }

    // Initiate transfer via Paystack
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: Math.round(settlementAmount * 100), // Convert to kobo
        recipient: invoice.user.paystackRecipientCode,
        reason: `Settlement for invoice ${invoice.invoiceNumber}`,
        reference: `SETTLE_${invoice.invoiceNumber}_${Date.now()}`
      })
    })

    const transferData = await transferResponse.json()

    if (!transferData.status) {
      console.error('Paystack transfer error:', transferData.message)
      return NextResponse.json({ 
        error: transferData.message || 'Transfer failed' 
      }, { status: 400 })
    }

    // Update invoice with settlement details
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        settlementStatus: 'processing', // This field exists
        settlementAmount: settlementAmount, // This field exists
        platformFee: platformFee, // This field exists
        transferReference: transferData.data.reference // This field exists
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Settlement initiated successfully',
      transferReference: transferData.data.reference,
      settlementAmount: settlementAmount,
      platformFee: platformFee
    })

  } catch (error) {
    console.error('Settlement error:', error)
    return NextResponse.json({ 
      error: 'Internal server error. Please try again.' 
    }, { status: 500 })
  }
}