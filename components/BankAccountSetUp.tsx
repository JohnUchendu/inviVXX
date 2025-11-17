// components/BankAccountSetup.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Banknote, Check, AlertCircle, Download } from 'lucide-react'

interface BankAccount {
  bankCode: string
  accountNumber: string
  accountName: string
  bankName: string
}

export default function BankAccountSetUp() {
  const { data: session } = useSession()
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const banks = [
    { code: '057', name: 'Zenith Bank' },
    { code: '058', name: 'GTBank' },
    { code: '039', name: 'First Bank' },
    { code: '032', name: 'Union Bank' },
    { code: '033', name: 'UBA' },
    { code: '035', name: 'Wema Bank' },
    { code: '068', name: 'Standard Chartered' },
    { code: '070', name: 'Fidelity Bank' },
    // Add more banks as needed
  ]

  const handleBankAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifying(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const bankCode = formData.get('bankCode') as string
    const accountNumber = formData.get('accountNumber') as string

    try {
      // Verify account with Paystack
      const res = await fetch('/api/paystack/verify-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankCode, accountNumber })
      })

      const result = await res.json()

      if (result.success) {
        setBankAccount({
          bankCode,
          accountNumber,
          accountName: result.data.account_name,
          bankName: banks.find(b => b.code === bankCode)?.name || ''
        })
      } else {
        alert('Account verification failed: ' + result.error)
      }
    } catch (error) {
      alert('Failed to verify account')
    } finally {
      setVerifying(false)
    }
  }

  const saveBankAccount = async () => {
    if (!bankAccount) return

    setLoading(true)
    try {
      const res = await fetch('/api/user/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankAccount)
      })

      const result = await res.json()

      if (result.success) {
        alert('Bank account saved successfully!')
      } else {
        alert('Failed to save bank account: ' + result.error)
      }
    } catch (error) {
      alert('Failed to save bank account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="w-5 h-5" />
          Bank Account Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!bankAccount ? (
          <form onSubmit={handleBankAccountSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankCode">Bank Name</Label>
                <select
                  id="bankCode"
                  name="bankCode"
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Bank</option>
                  {banks.map(bank => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  placeholder="0000000000"
                  required
                  maxLength={10}
                />
              </div>
            </div>

            <Button type="submit" disabled={verifying} className="w-full">
              {verifying ? 'Verifying Account...' : 'Verify Account'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Account Verified</p>
                  <p className="text-green-700">{bankAccount.accountName}</p>
                  <p className="text-green-600">
                    {bankAccount.bankName} - {bankAccount.accountNumber}
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={saveBankAccount} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Saving...' : 'Save Bank Account'}
            </Button>

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setBankAccount(null)}
              >
                Change Account
              </Button>
            </div>
          </div>
        )}

        {/* Settlement Information */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            How You Get Paid
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Funds are automatically settled to your bank account</li>
            <li>Standard settlement: Next business day (T+1)</li>
            <li>No action required from you</li>
            <li>View settlement history in your Paystack dashboard</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
