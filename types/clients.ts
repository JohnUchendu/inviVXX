// types/client.ts
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  company?: string
  taxId?: string
  notes?: string
  createdAt: string
  updatedAt: string
  invoiceCount?: number
  totalRevenue?: number
}

export interface ClientFormData {
  name: string
  email?: string
  phone?: string
  address?: string
  company?: string
  taxId?: string
  notes?: string
}