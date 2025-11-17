// types/template.ts
export interface TemplateColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface TemplateLayout {
  header: boolean
  footer: boolean
  logoPosition: 'left' | 'center' | 'right'
  showVat: boolean
  showSignature: boolean
  showQRCode: boolean
}

export interface InvoiceTemplate {
  id: string
  name: string
  type: 'professional' | 'minimal' | 'modern' | 'classic' | 'custom'
  colors?: TemplateColors
  layout?: TemplateLayout
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}