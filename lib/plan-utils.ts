// lib/plan-utils.ts

export const PLAN_FEATURES = {
  free: {
    maxInvoicesPerDay: 3,
    canSendToClient: false,
    maxTemplates: 1,
    canUseQR: false,
    canBulkSend: false,
    maxBulkSend: 0,
    canExportCSV: false,
    hasAdvancedAnalytics: false,
    hasMultiUser: false,
    hasAPIAccess: false,
    hasCustomBranding: false
  },
  starter: {
    maxInvoicesPerDay: Infinity,
    canSendToClient: true,
    maxTemplates: 5,
    canUseQR: true,
    canBulkSend: false,
    maxBulkSend: 0,
    canExportCSV: false,
    hasAdvancedAnalytics: false,
    hasMultiUser: false,
    hasAPIAccess: false,
    hasCustomBranding: false
  },
  growth: {
    maxInvoicesPerDay: Infinity,
    canSendToClient: true,
    maxTemplates: 15,
    canUseQR: true,
    canBulkSend: true,
    maxBulkSend: 20,
    canExportCSV: true,
    hasAdvancedAnalytics: true,
    hasMultiUser: false,
    hasAPIAccess: false,
    hasCustomBranding: false
  },
  premium: {
    maxInvoicesPerDay: Infinity,
    canSendToClient: true,
    maxTemplates: Infinity,
    canUseQR: true,
    canBulkSend: true,
    maxBulkSend: 100,
    canExportCSV: true,
    hasAdvancedAnalytics: true,
    hasMultiUser: true,
    hasAPIAccess: true,
    hasCustomBranding: true
  }
} as const

export type Plan = keyof typeof PLAN_FEATURES

// Define which features are boolean (permissions) vs numbers (limits)
type BooleanFeature = 
  | 'canSendToClient'
  | 'canUseQR'
  | 'canBulkSend'
  | 'canExportCSV'
  | 'hasAdvancedAnalytics'
  | 'hasMultiUser'
  | 'hasAPIAccess'
  | 'hasCustomBranding'

type NumericFeature = 
  | 'maxInvoicesPerDay'
  | 'maxTemplates'
  | 'maxBulkSend'

export function canUserPerform(userPlan: string, feature: BooleanFeature): boolean {
  const plan = userPlan as Plan
  return PLAN_FEATURES[plan]?.[feature] as boolean ?? false
}

export function getUserLimit(userPlan: string, limit: NumericFeature): number {
  const plan = userPlan as Plan
  return PLAN_FEATURES[plan]?.[limit] as number ?? 0
}

// Check if user has reached daily invoice limit
export async function checkInvoiceLimit(userId: string, userPlan: string): Promise<{ canCreate: boolean; remaining: number }> {
  if (userPlan !== 'free') {
    return { canCreate: true, remaining: Infinity }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const prisma = (await import('@/lib/prisma')).default
  const todaysInvoices = await prisma.invoice.count({
    where: {
      userId,
      createdAt: {
        gte: today
      }
    }
  })

  const maxInvoices = getUserLimit(userPlan, 'maxInvoicesPerDay')
  const remaining = Math.max(0, maxInvoices - todaysInvoices)

  return {
    canCreate: todaysInvoices < maxInvoices,
    remaining
  }
}

// Helper to get all features for a plan
export function getPlanFeatures(userPlan: string) {
  const plan = userPlan as Plan
  return PLAN_FEATURES[plan] || PLAN_FEATURES.free
}