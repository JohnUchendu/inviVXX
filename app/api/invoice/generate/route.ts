// app/api/invoice/generate/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createUserPrisma, prisma } from '@/lib/prisma' 
import { checkInvoiceLimit } from '@/lib/plan-utils'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    
    // Get user to check plan (use global prisma for user lookup)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // CHECK DAILY LIMIT FOR FREE USERS
    const limitCheck = await checkInvoiceLimit(user.id, user.plan)
    if (!limitCheck.canCreate) {
      return NextResponse.json({
        error: `Daily limit reached. Free plan allows 3 invoices per day. Upgrade for unlimited invoices.`,
        upgradeRequired: true,
        limitReached: true,
        remaining: limitCheck.remaining,
        currentPlan: user.plan
      }, { status: 403 })
    }

    // Extract form data
    const businessName = formData.get('businessName') as string
    const businessEmail = formData.get('businessEmail') as string
    const businessPhone = formData.get('businessPhone') as string
    const businessWebsite = formData.get('businessWebsite') as string
    const businessRegNo = formData.get('businessRegNo') as string
    const businessTin = formData.get('businessTin') as string
    const businessAddress = formData.get('businessAddress') as string
    const clientName = formData.get('clientName') as string
    const clientEmail = formData.get('clientEmail') as string
    const clientAddress = formData.get('clientAddress') as string
    const invoiceNo = formData.get('invoiceNo') as string
    const date = formData.get('date') as string
    const dueDate = formData.get('dueDate') as string
    const itemsData = JSON.parse(formData.get('items') as string)
    const vatEnabled = formData.get('vatEnabled') === 'true'
    const notes = formData.get('notes') as string
    const signature = formData.get('signature') as string
    const subtotal = parseFloat(formData.get('subtotal') as string)
    const vatAmount = parseFloat(formData.get('vatAmount') as string)
    const total = parseFloat(formData.get('total') as string)

    // Validate required fields
    if (!businessName || !clientName || !clientAddress) {
      return NextResponse.json({ 
        error: 'Business name, client name, and client address are required' 
      }, { status: 400 })
    }

    // Transform items to ensure consistent field names
    const items = itemsData.map((item: any) => ({
      description: item.desc || item.description || '',
      qty: item.qty || 0,
      price: item.price || 0
    }))

    // Validate items
    if (!items.length) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 })
    }

    // Generate invoice number if not provided
    const finalInvoiceNo = invoiceNo || `INV-${Date.now().toString().slice(-6)}`

    // Generate payment URL and QR code
    const paymentUrl = `http://localhost:3000/api/payment/${finalInvoiceNo}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(paymentUrl)}`

    // Create user-scoped Prisma client for invoice operations
    const userPrisma = createUserPrisma(user.id)

    // Create invoice in database using user-scoped client with type assertion
    const invoice = await (userPrisma as any).invoice.create({
      data: {
        invoiceNumber: finalInvoiceNo,
        businessName,
        businessEmail,
        businessPhone,
        businessWebsite: businessWebsite || null,
        businessRegNo: businessRegNo || null,
        businessTin: businessTin || null,
        clientName,
        clientEmail: clientEmail || null,
        clientAddress,
        items,
        subtotal,
        vatEnabled,
        vatAmount,
        total,
        notes: notes || null,
        signature: signature || null,
        paymentStatus: 'pending',
        qrCode: qrCodeUrl,
        paymentLink: paymentUrl
      }
    })

    // Generate PDF with QR code
    const pdfBuffer = await generateInvoicePDF(invoice)

    try {
      // Send email to business owner (user) using Resend
      const emailResult = await resend.emails.send({
        from: 'iBiz Invoices <invoice@mail.ibiz.name.ng>',
        to: user.email,
        subject: `Your Invoice ${finalInvoiceNo}`,
        html: generateEmailToMeTemplate(invoice),
        attachments: [
          {
            filename: `invoice-${finalInvoiceNo}.pdf`,
            content: pdfBuffer.toString('base64')
          }
        ]
      })

      console.log('Invoice generated and emailed successfully to:', user.email)
      
      // Update invoice with email ID if available
      if (emailResult.data?.id) {
        await (userPrisma as any).invoice.update({
          where: { id: invoice.id },
          data: { 
            emailId: emailResult.data.id,
            emailStatus: 'sent_to_owner'
          }
        })
      }

    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails - invoice is still created
    }

    return NextResponse.json({ 
      success: true, 
      invoiceId: invoice.id,
      invoiceNumber: finalInvoiceNo,
      message: 'Invoice created successfully!',
      pdfGenerated: true,
      emailSent: true
    })
  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

// Email template for sending to business owner
function generateEmailToMeTemplate(invoice: any) {
  const paymentUrl = `http://localhost:3000/api/payment/${invoice.invoiceNumber}`
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoice.invoiceNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">INVOICE GENERATED</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">${invoice.invoiceNumber}</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2563eb; margin-top: 0;">Hello ${invoice.businessName},</h2>
        <p>Your invoice <strong>${invoice.invoiceNumber}</strong> has been successfully generated and is attached to this email.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="margin-top: 0; color: #1f2937;">Invoice Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Client:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${invoice.clientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Invoice Number:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${invoice.invoiceNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Date Issued:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${new Date(invoice.createdAt).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;"><strong>Total Amount:</strong></td>
              <td style="padding: 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: #059669;">NGN ${invoice.total.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <!-- Payment Section -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${paymentUrl}" 
             style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">
            💳 Pay Invoice Now - NGN ${invoice.total.toLocaleString()}
          </a>
        </div>

        <!-- QR Code Section -->
        ${invoice.qrCode ? `
        <div style="text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 8px;">
          <p style="margin-bottom: 15px; color: #6b7280; font-size: 14px;">
            📱 <strong>Scan to Pay</strong><br>
            Use your mobile banking app
          </p>
          <img src="${invoice.qrCode}" alt="Payment QR Code" style="max-width: 150px; border: 1px solid #e5e7eb; border-radius: 8px;" />
        </div>
        ` : ''}

        <!-- Action Buttons -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/invoices/${invoice.id}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold; margin: 0 10px;">
            📊 View in Dashboard
          </a>
          ${invoice.clientEmail ? `
          <a href="http://localhost:3000/invoices/send/${invoice.id}" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold; margin: 0 10px;">
            📧 Send to Client
          </a>
          ` : ''}
        </div>

        <!-- Upgrade Prompt for Free Users -->
        ${!invoice.clientEmail ? `
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
          <h4 style="margin: 0; color: #92400e;">💡 Want to send this invoice directly to your client?</h4>
          <p style="margin: 8px 0 0 0; color: #92400e;">
            Upgrade to <strong>Starter plan</strong> to send invoices directly to clients and get paid faster!
          </p>
          <a href="http://localhost:3000/upgrade" 
             style="color: #d97706; font-weight: bold; text-decoration: none;">
            Upgrade Now →
          </a>
        </div>
        ` : ''}

        <!-- Additional Information -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
            <strong>Next Steps:</strong><br>
            • Share the attached PDF with your client<br>
            • Use the payment link to collect payments<br>
            • Track payment status in your dashboard
          </p>
          
          ${invoice.notes ? `
          <p style="color: #6b7280; font-size: 14px; margin: 15px 0;">
            <strong>Your Notes:</strong><br>
            ${invoice.notes}
          </p>
          ` : ''}
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>
          This invoice was generated using iBiz Invoice Generator.<br>
          Need help? <a href="https://ibiz.name.ng/contact" style="color: #6b7280;">Contact support</a>
        </p>
      </div>
    </body>
    </html>
  `
}

// PDF Generation Function with QR Code
async function generateInvoicePDF(invoice: any): Promise<Buffer> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  let y = height - 50;

  // Invoice Header
  page.drawText('INVOICE', { x: 50, y, size: 20, font, color: rgb(0, 0, 0) });
  y -= 30;
  
  page.drawText(`Invoice No: ${invoice.invoiceNumber}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, { x: 50, y, size: 12, font });
  y -= 30;

  // From Section
  page.drawText(`From: ${invoice.businessName}`, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
  y -= 15;
  if (invoice.businessEmail) {
    page.drawText(`Email: ${invoice.businessEmail}`, { x: 50, y, size: 10, font });
    y -= 12;
  }
  if (invoice.businessPhone) {
    page.drawText(`Phone: ${invoice.businessPhone}`, { x: 50, y, size: 10, font });
    y -= 12;
  }
  if (invoice.businessAddress) {
    page.drawText(`Address: ${invoice.businessAddress}`, { x: 50, y, size: 10, font });
    y -= 12;
  }
  y -= 10;

  // To Section
  page.drawText(`To: ${invoice.clientName}`, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
  y -= 15;
  page.drawText(`Address: ${invoice.clientAddress}`, { x: 50, y, size: 10, font });
  y -= 20;

  // Items Table Header
  page.drawText('Description', { x: 50, y, size: 11, font, color: rgb(0, 0, 0) });
  page.drawText('Qty', { x: 350, y, size: 11, font, color: rgb(0, 0, 0) });
  page.drawText('Price', { x: 400, y, size: 11, font, color: rgb(0, 0, 0) });
  page.drawText('Total', { x: 500, y, size: 11, font, color: rgb(0, 0, 0) });
  y -= 20;

  // Items
  const items = Array.isArray(invoice.items) ? invoice.items : [];
  items.forEach((item: any) => {
    const description = item.desc || item.description || 'No description';
    const qty = item.qty || 0;
    const price = item.price || 0;
    
    const safeDescription = String(description).substring(0, 50);
    
    page.drawText(safeDescription, { x: 50, y, size: 10, font });
    page.drawText(String(qty), { x: 350, y, size: 10, font });
    page.drawText(`NGN ${Number(price).toLocaleString()}`, { x: 400, y, size: 10, font });
    page.drawText(`NGN ${(Number(qty) * Number(price)).toLocaleString()}`, { x: 500, y, size: 10, font });
    y -= 15;
  });

  y -= 20;

  // Totals
  page.drawText(`Subtotal: NGN ${Number(invoice.subtotal).toLocaleString()}`, { x: 400, y, size: 11, font });
  y -= 15;
  if (invoice.vatEnabled) {
    page.drawText(`VAT (7.5%): NGN ${Number(invoice.vatAmount).toLocaleString()}`, { x: 400, y, size: 11, font });
    y -= 15;
  }
  page.drawText(`TOTAL: NGN ${Number(invoice.total).toLocaleString()}`, { 
    x: 400, y, size: 12, font, color: rgb(0, 0, 0) 
  });
  y -= 40;

  // QR Code Section in PDF
  if (invoice.qrCode) {
    try {
      page.drawText('Scan QR Code to Pay:', { x: 50, y, size: 10, font, color: rgb(0, 0, 0) });
      y -= 15;
      
      // Note: For production, you might want to generate QR code as image and embed it
      // For now, we'll just show the payment link
      page.drawText(`Payment Link: ${invoice.paymentLink}`, { 
        x: 50, y, size: 8, font, color: rgb(0.2, 0.4, 0.8) 
      });
      y -= 20;
    } catch (error) {
      console.error('Failed to add QR code to PDF:', error);
      // Fallback: just show payment link
      page.drawText(`Pay Online: ${invoice.paymentLink}`, { 
        x: 50, y, size: 9, font, color: rgb(0.2, 0.4, 0.8) 
      });
      y -= 20;
    }
  }

  // Notes
  if (invoice.notes) {
    const safeNotes = String(invoice.notes).substring(0, 200);
    page.drawText(`Notes: ${safeNotes}`, { x: 50, y, size: 10, font });
    y -= 20;
  }

  // Signature
  if (invoice.signature) {
    const safeSignature = String(invoice.signature).substring(0, 50);
    page.drawText(`Authorized by: ${safeSignature}`, { x: 50, y, size: 10, font });
    y -= 20;
  }

  // Footer
  page.drawText('Thank you for your business!', { x: 50, y, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
  y -= 15;
  page.drawText('Generated by iBiz Invoice Generator', { x: 50, y, size: 8, font, color: rgb(0.7, 0.7, 0.7) });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}