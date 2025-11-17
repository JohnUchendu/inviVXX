// components/DashboardLayout.tsx
import { ReactNode } from 'react'
import UpgradeBanner from './UpgradeBanner'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <UpgradeBanner />
      <main className="p-6">{children}</main>
    </div>
  )
}
