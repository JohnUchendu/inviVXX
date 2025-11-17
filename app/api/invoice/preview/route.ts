// app/api/invoice/preview/route.ts

import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts } from 'pdf-lib'

export async function POST(req: Request) {
  const data = await req.json()
  const {
    businessName, businessEmail, businessPhone, businessWebsite,
    businessRegNo, businessTin, clientName, clientAddress,
    items, vatEnabled, notes, signature
  } = data

  const subtotal = items.reduce((s: number, i: any) => s + i.qty * i.price, 0)
  const vatAmount = vatEnabled ? subtotal * 0.075 : 0
  const total = subtotal + vatAmount
  const invoiceNo = `INV-${Date.now().toString().slice(-6)}`

  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const page = pdfDoc.addPage([600, 800])
  const { height } = page.getSize()

  const lines = [
    `INVOICE`,
    `No: ${invoiceNo}`,
    ``,
    `From: ${businessName}`,
    businessEmail && `Email: ${businessEmail}`,
    businessPhone && `Phone: ${businessPhone}`,
    businessWebsite && `Web: ${businessWebsite}`,
    businessRegNo && `RC: ${businessRegNo}`,
    businessTin && `TIN: ${businessTin}`,
    ``,
    `Bill To: ${clientName}`,
    clientAddress,
    ``,
    `Items:`,
    ...items.map((i: any) => `  • ${i.description} × ${i.qty} @ ₦${i.price.toLocaleString()} = ₦${(i.qty * i.price).toLocaleString()}`),
    ``,
    `Subtotal: ₦${subtotal.toLocaleString()}`,
    vatEnabled && `VAT (7.5%): ₦${vatAmount.toLocaleString()}`,
    `TOTAL: ₦${total.toLocaleString()}`,
    notes && ``,
    notes,
    signature && ``,
    signature && `Signed: ${signature}`,
  ].filter(Boolean)

  let y = height - 50
  lines.forEach(line => {
    page.drawText(line, { x: 50, y, size: 11, font, lineHeight: 16 })
    y -= 16
  })

  const pdfBytes = await pdfDoc.save()
  
  // Fix the response - convert to Buffer
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=preview.pdf',
    },
  })
}