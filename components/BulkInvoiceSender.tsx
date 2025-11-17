
// components/BulkInvoiceSender.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, Users, CheckCircle, X, Download, Send } from 'lucide-react'
import { canUserPerform } from '@/lib/plan-utils'

interface BulkInvoiceData {
  clientName: string
  clientEmail: string
  clientAddress: string
  amount: number
  description: string
}

interface BulkInvoiceSenderProps {
  className?: string
}

export default function BulkInvoiceSender({ className }: BulkInvoiceSenderProps) {
  const { data: session } = useSession()
  const [csvData, setCsvData] = useState<BulkInvoiceData[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [csvText, setCsvText] = useState('')

  const userPlan = (session?.user as any)?.plan || 'free'
  
  if (!canUserPerform(userPlan, 'canBulkSend')) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Bulk Invoice Sending</h3>
          <p className="text-gray-600 mb-4">
            Upgrade to Growth plan or higher to send invoices to multiple clients at once.
            Save time by processing up to 20 invoices in one go.
          </p>
          <Button onClick={() => window.location.href = '/pricing'}>
            Upgrade to Growth Plan
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setCsvText(text)
      parseCSVData(text)
    }
    reader.readAsText(file)
  }

  const parseCSVData = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) {
      setMessage('CSV file is empty')
      return
    }

    // Simple CSV parsing
    const data: BulkInvoiceData[] = []
    const errors: string[] = []
    
    for (let i = 1; i < lines.length; i++) { // Skip header
      const values = lines[i].split(',').map(v => v.trim())
      
      if (values.length < 3) {
        errors.push(`Line ${i + 1}: Insufficient data`)
        continue
      }

      const [clientName, clientEmail, clientAddress, amount, description] = values
      
      if (!clientName || !clientEmail) {
        errors.push(`Line ${i + 1}: Client name and email are required`)
        continue
      }

      const amountValue = parseFloat(amount || '0')
      if (isNaN(amountValue) || amountValue <= 0) {
        errors.push(`Line ${i + 1}: Invalid amount`)
        continue
      }

      data.push({
        clientName,
        clientEmail,
        clientAddress: clientAddress || '',
        amount: amountValue,
        description: description || 'Invoice'
      })
    }
    
    setCsvData(data)
    
    if (errors.length > 0) {
      setMessage(`Found ${errors.length} errors in CSV. Please fix and try again.`)
    } else if (data.length > 0) {
      setMessage(`Successfully loaded ${data.length} invoices from CSV`)
    }
  }

  const handleTextareaChange = (text: string) => {
    setCsvText(text)
    parseCSVData(text)
  }

  const downloadTemplate = () => {
    const template = `clientName,clientEmail,clientAddress,amount,description
John Doe,john@example.com,"123 Main St, Lagos",50000,Website Development
Jane Smith,jane@company.com,"456 Broad St, Abuja",75000,Consulting Services
Michael Brown,mike@business.ng,"789 Park Ave, Port Harcourt",30000,Product Design`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk-invoice-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const removeInvoice = (index: number) => {
    setCsvData(prev => prev.filter((_, i) => i !== index))
  }

  const sendBulkInvoices = async () => {
    if (csvData.length === 0) {
      setMessage('No invoices to send')
      return
    }

    // Check bulk send limit
    const maxBulkSend = userPlan === 'growth' ? 20 : 100 // Growth: 20, Premium: 100
    if (csvData.length > maxBulkSend) {
      setMessage(`Your plan allows maximum ${maxBulkSend} invoices per bulk send. Please split your CSV.`)
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/invoice/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          invoices: csvData,
          businessInfo: {
            name: session?.user?.name || 'Your Business',
            email: session?.user?.email
          }
        })
      })

      const result = await res.json()

      if (result.success) {
        setMessage(`✅ Successfully sent ${result.sent} out of ${result.total} invoices!`)
        setCsvData([])
        setCsvText('')
      } else {
        setMessage(`❌ ${result.error || 'Failed to send invoices'}`)
      }
    } catch (error) {
      setMessage('❌ Failed to send invoices. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    setCsvData([])
    setCsvText('')
    setMessage('')
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Bulk Invoice Sender
          <Badge className="bg-purple-100 text-purple-800">
            {csvData.length} invoices ready
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How to use Bulk Send:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Download the CSV template below</li>
            <li>Fill in your client and invoice details</li>
            <li>Upload the CSV file or paste the content</li>
            <li>Review and send all invoices at once</li>
          </ol>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadTemplate}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload CSV File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Upload a CSV file with columns: clientName, clientEmail, clientAddress, amount, description
            </p>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="max-w-xs mx-auto"
            />
          </div>
        </div>

        {/* Or Paste CSV */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Or paste CSV content
          </label>
          <Textarea
            value={csvText}
            onChange={(e) => handleTextareaChange(e.target.value)}
            placeholder="Paste your CSV content here..."
            rows={4}
            className="font-mono text-sm"
          />
        </div>

        {/* Preview */}
        {csvData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Preview ({csvData.length} invoices)</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAll}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {csvData.map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-b group hover:bg-gray-50">
                  <div className="flex items-center space-x-3 flex-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium">{invoice.clientName}</p>
                      <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
                      {invoice.clientAddress && (
                        <p className="text-xs text-gray-500">{invoice.clientAddress}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-semibold">₦{invoice.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{invoice.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeInvoice(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span>Total Invoices:</span>
                <span className="font-semibold">{csvData.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Total Amount:</span>
                <span className="font-semibold">
                  ₦{csvData.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <Button 
          onClick={sendBulkInvoices}
          disabled={loading || csvData.length === 0}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending {csvData.length} Invoices...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send {csvData.length} Invoices
            </>
          )}
        </Button>

        {/* Plan Limits Info */}
        <div className="text-xs text-gray-500 text-center">
          {userPlan === 'growth' ? (
            <>Growth plan: Maximum 20 invoices per bulk send</>
          ) : (
            <>Premium plan: Maximum 100 invoices per bulk send</>
          )}
        </div>

        {/* Messages */}
        {message && (
          <p className={`text-center text-sm p-3 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : message.includes('❌')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
