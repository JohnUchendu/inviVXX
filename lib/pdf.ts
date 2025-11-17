// lib/pdf.ts 

import { PDFDocument, StandardFonts } from 'pdf-lib'

export async function createInvoicePDF(text: string) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const page = pdfDoc.addPage([600, 800])
  const { height } = page.getSize()

  page.drawText(text, {
    x: 50,
    y: height - 100,
    size: 12,
    font: font,
    lineHeight: 18,
  })

  return await pdfDoc.save()
}