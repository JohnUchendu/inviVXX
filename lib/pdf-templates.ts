// lib/pdf-templates.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function generateStyledInvoicePDF(invoice: any, template: any = null) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const page = pdfDoc.addPage([600, 800])
  const { width, height } = page.getSize()

  // Default template colors
  const colors = template?.colors || {
    primary: rgb(0.149, 0.388, 0.922), // #2563eb
    secondary: rgb(0.392, 0.455, 0.549), // #64748b
    accent: rgb(0.961, 0.62, 0.043), // #f59e0b
    background: rgb(1, 1, 1), // #ffffff
    text: rgb(0.122, 0.161, 0.224) // #1f2937
  }

  let y = height - 50

  // Header with template color
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width,
    height: 80,
    color: colors.primary,
  })

  // Invoice Title
  page.drawText('INVOICE', {
    x: 50,
    y: height - 45,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
  })

  y = height - 120

  // Invoice Details with template styling
  page.drawText(`Invoice No: ${invoice.invoiceNumber}`, {
    x: 50, y, size: 12, font, color: colors.text
  })
  y -= 20
  
  page.drawText(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, {
    x: 50, y, size: 12, font, color: colors.text
  })
  y -= 40

  // Continue with rest of PDF generation using template colors...
  // [Rest of your existing PDF generation code with color updates]

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}