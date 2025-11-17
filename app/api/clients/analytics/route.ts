// app/api/clients/analytics/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createUserPrisma, prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userPrisma = createUserPrisma(user.id)
    
    const clients = await userPrisma.client.findMany({
      include: {
        invoices: {
          select: { total: true }
        }
      }
    })

    // Add proper type annotations to reduce functions
    const totalClients = clients.length
    const clientsWithInvoices = clients.filter((client: any) => client.invoices.length > 0).length
    const totalRevenue = clients.reduce((sum: number, client: any) => 
      sum + client.invoices.reduce((invSum: number, inv: any) => invSum + inv.total, 0), 0
    )
    const averageRevenue = totalClients > 0 ? totalRevenue / totalClients : 0

    const stats = {
      totalClients,
      clientsWithInvoices,
      totalRevenue,
      averageRevenue
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Failed to fetch client analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client analytics' },
      { status: 500 }
    )
  }
}
