// components/ClientList.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Mail, Phone, MapPin, Building, FileText, Edit, Trash2, User } from 'lucide-react'

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

interface ClientListProps {
  onSelectClient?: (client: Client) => void
  onEditClient?: (client: Client) => void
  showActions?: boolean
}

export default function ClientList({ onSelectClient, onEditClient, showActions = true }: ClientListProps) {
  const { data: session } = useSession()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setClients(prev => prev.filter(client => client.id !== clientId))
      } else {
        alert('Failed to delete client')
      }
    } catch (error) {
      alert('Failed to delete client')
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading clients...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Clients ({clients.length})
          </CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
            {showActions && onEditClient && (
              <Button 
                onClick={() => onEditClient({
                  id: '',
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  company: '',
                  taxId: '',
                  notes: '',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                })}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Client
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first client'
              }
            </p>
            {showActions && onEditClient && !searchTerm && (
              <Button 
                onClick={() => onEditClient({
                  id: '',
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  company: '',
                  taxId: '',
                  notes: '',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                })}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add First Client
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                  selectedClient === client.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${onSelectClient ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (onSelectClient) {
                    setSelectedClient(client.id)
                    onSelectClient(client)
                  }
                }}
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {client.name}
                      </h3>
                      {client.invoiceCount && client.invoiceCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {client.invoiceCount} invoices
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      {client.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      
                      {client.company && (
                        <div className="flex items-center gap-2">
                          <Building className="w-3 h-3" />
                          <span className="truncate">{client.company}</span>
                        </div>
                      )}
                      
                      {client.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{client.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showActions && (
                  <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                    {onEditClient && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditClient(client)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteClient(client.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
