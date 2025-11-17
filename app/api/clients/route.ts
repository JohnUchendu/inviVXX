// app/api/clients/route.ts 
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
        _count: {
          select: { invoices: true }
        },
        invoices: {
          select: { total: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Add proper type annotations
    const formattedClients = clients.map((client: any) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      company: client.company,
      taxId: client.taxId,
      notes: client.notes,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      invoiceCount: client._count.invoices,
      totalRevenue: client.invoices.reduce((sum: number, inv: any) => sum + inv.total, 0)
    }))

    return NextResponse.json({ clients: formattedClients })
  } catch (error) {
    console.error('Failed to fetch clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
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

    const { name, email, phone, address, company, taxId, notes } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
    }

    const userPrisma = createUserPrisma(user.id)

    // Check if client with same email already exists for this user
    if (email) {
      const existingClient = await (userPrisma as any).client.findFirst({
        where: { 
          email,
          userId: user.id // Make sure to check within the same user
        }
      })

      if (existingClient) {
        return NextResponse.json({ error: 'Client with this email already exists' }, { status: 400 })
      }
    }

    // The userId will be automatically added by the AuthenticatedPrismaClient middleware
    const client = await (userPrisma as any).client.create({
      data: {
        name,
        email,
        phone,
        address,
        company,
        taxId,
        notes
        // userId is automatically added by the middleware in createUserPrisma
      }
    })

    return NextResponse.json({ 
      success: true, 
      client: {
        ...client,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString()
      } 
    })
  } catch (error) {
    console.error('Failed to create client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
