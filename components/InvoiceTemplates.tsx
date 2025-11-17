// components/InvoiceTemplates.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Check, Palette, Upload, Image, Zap } from 'lucide-react'

interface TemplatePreviewProps {
  template: any
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
}

const TemplatePreview = ({ template, isSelected, onSelect, onPreview }: TemplatePreviewProps) => {
  return (
    <Card className={`relative overflow-hidden transition-all ${
      isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:shadow-md'
    }`}>
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* Template Preview */}
        <div className="absolute inset-4 bg-white rounded shadow-sm border">
          {/* Header */}
          <div className="h-4 bg-blue-600 rounded-t"></div>
          
          {/* Content */}
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-100 rounded"></div>
            <div className="h-2 bg-gray-100 rounded w-3/4"></div>
            
            {/* Items Table */}
            <div className="space-y-1 mt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between">
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="border-t pt-2 mt-4">
              <div className="h-3 bg-gray-300 rounded w-1/3 ml-auto"></div>
            </div>
          </div>
        </div>
        
        {isSelected && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-600">
              <Check className="w-3 h-3 mr-1" />
              Selected
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{template.type}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onPreview}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              variant={isSelected ? "default" : "outline"} 
              size="sm"
              onClick={onSelect}
            >
              {isSelected ? 'Selected' : 'Use Template'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function InvoiceTemplates() {
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    // Default templates
    const defaultTemplates = [
      {
        id: 'professional',
        name: 'Professional',
        type: 'professional',
        isDefault: true,
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#f59e0b',
          background: '#ffffff',
          text: '#1f2937'
        }
      },
      {
        id: 'minimal',
        name: 'Minimal',
        type: 'minimal', 
        isDefault: true,
        colors: {
          primary: '#000000',
          secondary: '#6b7280',
          accent: '#000000',
          background: '#ffffff',
          text: '#374151'
        }
      },
      {
        id: 'modern',
        name: 'Modern',
        type: 'modern',
        isDefault: true,
        colors: {
          primary: '#7c3aed',
          secondary: '#8b5cf6',
          accent: '#a78bfa',
          background: '#faf5ff',
          text: '#1f2937'
        }
      },
      {
        id: 'classic',
        name: 'Classic',
        type: 'classic',
        isDefault: true,
        colors: {
          primary: '#dc2626',
          secondary: '#b91c1c',
          accent: '#ef4444',
          background: '#fef2f2',
          text: '#1f2937'
        }
      }
    ]
    
    setTemplates(defaultTemplates)
    setLoading(false)
  }

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId)
    // Save user preference
    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultTemplate: templateId })
      })
    } catch (error) {
      console.error('Failed to save template preference:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Invoice Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map(template => (
            <TemplatePreview
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => handleTemplateSelect(template.id)}
              onPreview={() => {/* Implement preview modal */}}
            />
          ))}
        </div>
        
        {/* Custom Branding Section */}
        <div className="mt-8 p-6 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Custom Branding (Premium Feature)
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Upload Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload your company logo</p>
                <Button variant="outline" className="mt-2" disabled>
                  <Image className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand Colors</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: '#2563eb' }}></div>
                  <span>Primary Color</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: '#64748b' }}></div>
                  <span>Secondary Color</span>
                </div>
                <Button variant="outline" disabled>
                  <Palette className="w-4 h-4 mr-2" />
                  Customize Colors
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Badge className="bg-purple-100 text-purple-800">
              Available in Premium Plan
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
