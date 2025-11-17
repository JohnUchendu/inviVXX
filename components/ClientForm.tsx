// components/ClientForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save, X, User } from 'lucide-react'

interface Client {
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

interface ClientFormData {
  name: string
  email?: string
  phone?: string
  address?: string
  company?: string
  taxId?: string
  notes?: string
}

interface ClientFormProps {
  client?: Client
  onSave: (client: ClientFormData) => void
  onCancel: () => void
  loading?: boolean
}

export default function ClientForm({ client, onSave, onCancel, loading = false }: ClientFormProps) {
  const isEditing = !!client?.id

  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    defaultValues: {
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      address: client?.address || '',
      company: client?.company || '',
      taxId: client?.taxId || '',
      notes: client?.notes || '',
    }
  })

  const onSubmit = (data: ClientFormData) => {
    onSave(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {isEditing ? 'Edit Client' : 'Add New Client'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Client Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Client name is required' })}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="client@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="123 Main Street, City, State"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="taxId">Tax ID / RC Number</Label>
            <Input
              id="taxId"
              {...register('taxId')}
              placeholder="RC123456789 or TIN123456789"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about this client..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditing ? 'Update Client' : 'Save Client'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
