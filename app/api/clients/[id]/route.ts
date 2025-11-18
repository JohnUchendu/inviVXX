// // app/api/clients/[id]/route.ts


// import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'
// import { createUserPrisma, prisma } from '@/lib/prisma'

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email }
//     })

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 })
//     }

//     const userPrisma = createUserPrisma(user.id)
    
//     const client = await userPrisma.client.findUnique({
//       where: { id: params.id },
//       include: {
//         invoices: {
//           orderBy: { createdAt: 'desc' },
//           select: {
//             id: true,
//             invoiceNumber: true,
//             total: true,
//             paymentStatus: true,
//             createdAt: true
//           }
//         }
//       }
//     })

//     if (!client) {
//       return NextResponse.json({ error: 'Client not found' }, { status: 404 })
//     }

//     return NextResponse.json({ client })
//   } catch (error) {
//     console.error('Failed to fetch client:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch client' },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email }
//     })

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 })
//     }

//     const { name, email, phone, address, company, taxId, notes } = await req.json()

//     if (!name) {
//       return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
//     }

//     const userPrisma = createUserPrisma(user.id)

//     // Check if client exists and belongs to user
//     const existingClient = await userPrisma.client.findUnique({
//       where: { id: params.id }
//     })

//     if (!existingClient) {
//       return NextResponse.json({ error: 'Client not found' }, { status: 404 })
//     }

//     // Check if email is being changed and if it conflicts with another client
//     if (email && email !== existingClient.email) {
//       const emailConflict = await userPrisma.client.findFirst({
//         where: { 
//           email,
//           id: { not: params.id }
//         }
//       })

//       if (emailConflict) {
//         return NextResponse.json({ error: 'Another client with this email already exists' }, { status: 400 })
//       }
//     }

//     const client = await userPrisma.client.update({
//       where: { id: params.id },
//       data: {
//         name,
//         email,
//         phone,
//         address,
//         company,
//         taxId,
//         notes
//       }
//     })

//     return NextResponse.json({ 
//       success: true, 
//       client: {
//         ...client,
//         createdAt: client.createdAt.toISOString(),
//         updatedAt: client.updatedAt.toISOString()
//       } 
//     })
//   } catch (error) {
//     console.error('Failed to update client:', error)
//     return NextResponse.json(
//       { error: 'Failed to update client' },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email }
//     })

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 })
//     }

//     const userPrisma = createUserPrisma(user.id)

//     // Check if client exists and belongs to user
//     const existingClient = await userPrisma.client.findUnique({
//       where: { id: params.id },
//       include: { _count: { select: { invoices: true } } }
//     })

//     if (!existingClient) {
//       return NextResponse.json({ error: 'Client not found' }, { status: 404 })
//     }

//     if (existingClient._count.invoices > 0) {
//       return NextResponse.json({ 
//         error: 'Cannot delete client with existing invoices. Please delete or reassign invoices first.' 
//       }, { status: 400 })
//     }

//     await userPrisma.client.delete({
//       where: { id: params.id }
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Failed to delete client:', error)
//     return NextResponse.json(
//       { error: 'Failed to delete client' },
//       { status: 500 }
//     )
//   }
// }



// app/api/clients/[id]/route.ts


import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createUserPrisma, prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

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
    
    const client = await userPrisma.client.findUnique({
      where: { id: id },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            paymentStatus: true,
            createdAt: true
          }
        }
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json({ client })
  } catch (error) {
    console.error('Failed to fetch client:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

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

    // Check if client exists and belongs to user
    const existingClient = await userPrisma.client.findUnique({
      where: { id: id }
    })

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Check if email is being changed and if it conflicts with another client
    if (email && email !== existingClient.email) {
      const emailConflict = await userPrisma.client.findFirst({
        where: { 
          email,
          id: { not: id }
        }
      })

      if (emailConflict) {
        return NextResponse.json({ error: 'Another client with this email already exists' }, { status: 400 })
      }
    }

    const client = await userPrisma.client.update({
      where: { id: id },
      data: {
        name,
        email,
        phone,
        address,
        company,
        taxId,
        notes
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
    console.error('Failed to update client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

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

    // Check if client exists and belongs to user
    const existingClient = await userPrisma.client.findUnique({
      where: { id: id },
      include: { _count: { select: { invoices: true } } }
    })

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if (existingClient._count.invoices > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete client with existing invoices. Please delete or reassign invoices first.' 
      }, { status: 400 })
    }

    await userPrisma.client.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete client:', error)
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}