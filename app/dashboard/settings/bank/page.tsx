// app/dashboard/settings/bank/page.tsx
'use client'

import BankAccountSetUp from '@/components/BankAccountSetUp'
import SettlementHistory from '@/components/SettlementHistory'

export default function BankSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Settings</h1>
        <p className="text-gray-600">
          Set up your bank account to receive payments and view settlement history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BankAccountSetUp />
        <SettlementHistory />
      </div>
    </div>
  )
}