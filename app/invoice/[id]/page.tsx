// app/invoice/[id]/page.tsx

import db  from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function InvoiceDetail({ params }: { params: { id: string } }) {
  const invoice = await db.invoice.findUnique({
    where: { id: params.id },
    include: { user: true },
  })

  if (!invoice) notFound()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invoice {invoice.invoiceNumber}</h1>
      <p>Business: {invoice.businessName}</p>
      <p>Client: {invoice.clientName}</p>
      <p>Total: ₦{invoice.total}</p>
      <p>Status: {invoice.paymentStatus}</p>
      {invoice.emailStatus && <p>Email: {invoice.emailStatus}</p>}
    </div>
  )
}
