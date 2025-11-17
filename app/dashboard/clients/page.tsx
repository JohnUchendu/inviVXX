// app/clients/page.tsx
'use client'

import { useState } from 'react'
import ClientList from '@/components/ClientList'
import ClientForm from '@/components/ClientForm'
import ClientAnalytics from '@/components/ClientAnalytics'

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

export default function ClientsPage() {
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSaveClient = async (clientData: ClientFormData) => {
    setSaving(true)
    try {
      const url = editingClient?.id ? `/api/clients/${editingClient.id}` : '/api/clients'
      const method = editingClient?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      })

      const result = await res.json()

      if (result.success) {
        setEditingClient(null)
        // The ClientList will refetch automatically due to key change
        window.location.reload() // Simple refresh to update the list
      } else {
        alert(result.error || 'Failed to save client')
      }
    } catch (error) {
      alert('Failed to save client')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
          <p className="text-gray-600">
            Manage your clients, track relationships, and view analytics
          </p>
        </div>
      </div>

      {/* Analytics */}
      <div className="mb-8">
        <ClientAnalytics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client List - 2/3 width */}
        <div className="lg:col-span-2">
          <ClientList 
            onEditClient={setEditingClient}
            showActions={true}
          />
        </div>

        {/* Client Form or Empty State - 1/3 width */}
        <div>
          {editingClient ? (
            <ClientForm
              client={editingClient}
              onSave={handleSaveClient}
              onCancel={() => setEditingClient(null)}
              loading={saving}
            />
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No client selected</h3>
              <p className="text-gray-600 mb-4">
                Select a client to edit or click "New Client" to add one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}