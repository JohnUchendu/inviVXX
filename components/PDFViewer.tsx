// components/PDFViewer.tsx

'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerProps {
  pdfUrl: string
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  return (
    <div className="flex flex-col items-center">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">Loading PDF...</div>
          </div>
        }
        error={
          <div className="flex items-center justify-center h-96 text-red-500">
            Failed to load PDF preview
          </div>
        }
      >
        <Page 
          pageNumber={pageNumber} 
          width={350} 
          loading={
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">Rendering page...</div>
            </div>
          }
        />
      </Document>
      {numPages && numPages > 1 && (
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
