// app/api/invoice/bulk/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createUserPrisma, prisma } from '@/lib/prisma'
import { canUserPerform, getUserLimit, checkInvoiceLimit } from '@/lib/plan-utils' // ADD IMPORTS
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user first (use global prisma for user lookup)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // ENHANCED PLAN CHECK
    if (!canUserPerform(user.plan, 'canBulkSend')) {
      return NextResponse.json({ 
        error: 'Bulk sending requires Growth plan or higher',
        upgradeRequired: true,
        requiredPlan: 'growth',
        currentPlan: user.plan
      }, { status: 403 })
    }

    const { invoices } = await req.json()
    
    // CHECK BULK LIMIT
    const maxBulkSend = getUserLimit(user.plan, 'maxBulkSend')
    if (invoices.length > maxBulkSend) {
      return NextResponse.json({
        error: `Bulk send limit exceeded. Your plan allows maximum ${maxBulkSend} invoices per bulk send.`,
        upgradeRequired: true,
        limitReached: true,
        maxAllowed: maxBulkSend,
        attempted: invoices.length
      }, { status: 403 })
    }

    // CHECK DAILY LIMIT FOR BULK OPERATION
    const limitCheck = await checkInvoiceLimit(user.id, user.plan)
    if (!limitCheck.canCreate || invoices.length > limitCheck.remaining) {
      return NextResponse.json({
        error: `Cannot process bulk send. You can only create ${limitCheck.remaining} more invoices today.`,
        upgradeRequired: true,
        limitReached: true,
        remaining: limitCheck.remaining
      }, { status: 403 })
    }

    // Create user-scoped Prisma client for invoice operations
    const userPrisma = createUserPrisma(user.id)

    let sentCount = 0
    const errors: string[] = []

    // Process each invoice
    for (const invoiceData of invoices) {
      try {
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${sentCount}`
        
        const invoice = await (userPrisma as any).invoice.create({
          data: {
            invoiceNumber,
            businessName: user.businessName || 'Your Business',
            businessEmail: user.businessEmail || user.email,
            clientName: invoiceData.clientName,
            clientEmail: invoiceData.clientEmail,
            clientAddress: invoiceData.clientAddress,
            items: [{ 
              description: invoiceData.description, 
              qty: 1, 
              price: invoiceData.amount 
            }],
            subtotal: invoiceData.amount,
            total: invoiceData.amount,
            paymentStatus: 'pending',
            emailStatus: 'sent'
          }
        })

        sentCount++

      } catch (error) {
        const errorMsg = `Failed to process invoice for ${invoiceData.clientEmail}`
        console.error(errorMsg, error)
        errors.push(errorMsg)
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: sentCount,
      total: invoices.length,
      errors: errors,
      message: `Successfully processed ${sentCount} out of ${invoices.length} invoices` 
    })
  } catch (error) {
    console.error('Bulk invoice error:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk invoices' },
      { status: 500 }
    )
  }
}