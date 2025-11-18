// // app/api/payment/[invoiceNumber]/route.ts
// import { NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'

// export async function GET(
//   request: Request,
//   { params }: { params: { invoiceNumber: string } }
// ) {
//   try {
//     const invoiceNumber = params.invoiceNumber
    
//     // Get invoice details
//     const invoice = await prisma.invoice.findUnique({
//       where: { invoiceNumber },
//       include: { user: true }
//     })

//     if (!invoice) {
//       return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
//     }

//     if (!invoice.user.paystackRecipientCode) {
//       return NextResponse.json({ 
//         error: 'Business owner needs to set up bank account to receive payments' 
//       }, { status: 400 })
//     }

//     // Create Paystack payment link
//     const paystackData = {
//       email: invoice.clientEmail || 'customer@example.com',
//       amount: Math.round(invoice.total * 100), // Convert to kobo
//       reference: `INV-${invoiceNumber}-${Date.now()}`,
//       callback_url: `https://yourapp.com/payment/success?invoice=${invoiceNumber}`,
//       metadata: {
//         invoiceNumber: invoiceNumber,
//         invoiceId: invoice.id,
//         userId: invoice.userId,
//         recipient_code: invoice.user.paystackRecipientCode // For settlements
//       }
//     }

//     // Initialize Paystack transaction
//     const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(paystackData)
//     })

//     const paystackResult = await paystackResponse.json()

//     if (!paystackResult.status) {
//       return NextResponse.json({ error: paystackResult.message }, { status: 400 })
//     }

//     // Update invoice with payment reference
//     await prisma.invoice.update({
//       where: { id: invoice.id },
//       data: { 
//         paymentRef: paystackData.reference,
//         paymentStatus: 'processing'
//       }
//     })

//     // Redirect to Paystack checkout
//     return NextResponse.redirect(paystackResult.data.authorization_url)
//   } catch (error) {
//     console.error('Payment initialization error:', error)
//     return NextResponse.json({ error: 'Payment failed to initialize' }, { status: 500 })
//   }
// }



// app/api/payment/[invoiceNumber]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceNumber: string }> }
) {
  try {
    const resolvedParams = await params;
    const invoiceNumber = resolvedParams.invoiceNumber;
    
    // Get invoice details with user
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: { user: true }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice.user.paystackRecipientCode) {
      return NextResponse.json({ 
        error: 'Business owner needs to set up bank account to receive payments' 
      }, { status: 400 });
    }

    // Prepare Paystack initialization data
    const paystackData = {
      email: invoice.clientEmail || 'customer@example.com',
      amount: Math.round(invoice.total * 100), // Convert to kobo (assuming NGN)
      reference: `INV-${invoiceNumber}-${Date.now()}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?invoice=${invoiceNumber}`,
      metadata: {
        invoiceNumber: invoiceNumber,
        invoiceId: invoice.id,
        userId: invoice.userId,
        recipient_code: invoice.user.paystackRecipientCode // For settlements
      }
    };

    // Initialize Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackData)
    });

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      console.error('Paystack API error:', errorData);
      return NextResponse.json({ error: errorData.message || 'Payment initialization failed' }, { status: 500 });
    }

    const paystackResult = await paystackResponse.json();

    if (!paystackResult.status) {
      return NextResponse.json({ error: paystackResult.message || 'Payment initialization failed' }, { status: 400 });
    }

    // Update invoice with payment reference
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { 
        paymentRef: paystackData.reference,
        paymentStatus: 'processing'
      }
    });

    // Redirect to Paystack checkout
    return NextResponse.redirect(paystackResult.data.authorization_url);
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json({ error: 'Payment failed to initialize' }, { status: 500 });
  }
}