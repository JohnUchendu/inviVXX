// app/api/invoices/route.ts


import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createUserPrisma, prisma } from '@/lib/prisma' // Import both

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user first to get their ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create user-scoped Prisma client for invoice operations
    const userPrisma = createUserPrisma(user.id)
    
    // Use user-scoped client to fetch invoices (RLS will automatically filter by userId)
    const invoices = await userPrisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        invoiceNumber: true,
        clientName: true,
        clientEmail: true,
        total: true,
        paymentStatus: true,
        emailStatus: true,
        createdAt: true,
        businessName: true
      }
    })

    return NextResponse.json({ 
      invoices 
    })
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}