import React, { useState, useLayoutEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

// Set the worker URL for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PDFViewerProps {
  base64String: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ base64String }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [isSmallDevice, setIsSmallDevice] = useState(false)

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 1024)
    }

    handleResize() // Initial check

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  return (
    <div className="w-full h-full overflow-auto">
      <Document
        file={base64String}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages || 0), (el, index) => (
          <div
            key={`page_${index + 1}`}
            className="max-w-full max-h-full"
            // style={{ minHeight: 'calc(100vh - 200px)', minWidth: 'calc(100vw - 200px)' }}
          >
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="max-w-full max-h-full"
              width={isSmallDevice ? 600 : undefined}
              height={isSmallDevice ? 600 : undefined}
            />
          </div>
        ))}
      </Document>
    </div>
  )
}

export default PDFViewer
