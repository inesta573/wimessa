import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import HTMLFlipBook from 'react-pageflip'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './flipBook.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PAGE_ASPECT = 543 / 380
const MIN_PAGE_WIDTH = 280
const MAX_PAGE_WIDTH = 520

function getPageSize() {
  if (typeof window === 'undefined') return { pageWidth: 380, pageHeight: 543 }
  const maxOpenWidth = Math.min(window.innerWidth - 48, 1040)
  const pageWidth = Math.max(MIN_PAGE_WIDTH, Math.min(MAX_PAGE_WIDTH, maxOpenWidth / 2))
  const pageHeight = Math.round(pageWidth * PAGE_ASPECT)
  return { pageWidth, pageHeight }
}

const PdfFlipPage = forwardRef(({ pageNumber, pageWidth, pageHeight }, ref) => (
  <div ref={ref} className="flipbook-page">
    <Page
      pageNumber={pageNumber}
      width={pageWidth}
      height={pageHeight}
      renderTextLayer
      renderAnnotationLayer
    />
  </div>
))

PdfFlipPage.displayName = 'PdfFlipPage'

const FlipBook = ({ file, year }) => {
  const { t } = useTranslation()
  const [numPages, setNumPages] = useState(null)
  const [loading, setLoading] = useState(!!file)
  const [error, setError] = useState(null)
  const [isCoverView, setIsCoverView] = useState(true)
  const [pageSize, setPageSize] = useState(getPageSize)

  useEffect(() => {
    const onResize = () => setPageSize(getPageSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const updateViewWidth = (pageFlip) => {
    if (!pageFlip) return
    const current = pageFlip.getCurrentPageIndex()
    setIsCoverView(current === 0)
  }

  useEffect(() => {
    if (!file) return
    setNumPages(null)
    setLoading(true)
    setError(null)
    pdfjs.getDocument(file).promise
      .then((pdf) => setNumPages(pdf.numPages))
      .catch((err) => {
        console.error('PDF load error:', err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [file])

  if (!file) {
    return (
      <div className="flipbook-message flipbook-coming-soon">
        <p>{year ? t('maktoub.comingSoon', { year }) : t('maktoub.comingSoonGeneric')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flipbook-message flipbook-error">
        <p>{t('flipbook.loadError')}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flipbook-message">
        <p>{t('flipbook.loading')}</p>
      </div>
    )
  }

  if (!numPages || numPages < 1) {
    return null
  }

  const { pageWidth, pageHeight } = pageSize
  const wrapperClosed = pageWidth
  const wrapperOpen = pageWidth * 2

  return (
    <div className="flipbook-wrapper">
      <div
        className={`flipbook-sizer ${isCoverView ? 'flipbook-sizer--cover' : ''}`}
        style={{ width: isCoverView ? wrapperClosed : wrapperOpen }}
      >
        <div
          className="flipbook-view"
          style={{
            width: wrapperOpen,
            ['--flipbook-page-width']: `${pageWidth}px`,
          }}
        >
          <Document file={file} loading="">
            <HTMLFlipBook
              width={pageWidth}
              height={pageHeight}
              className="flipbook"
              showCover
              onInit={(e) => updateViewWidth(e?.object)}
              onFlip={(e) => updateViewWidth(e?.object)}
              onChangeState={(e) => updateViewWidth(e?.object)}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <PdfFlipPage
                  key={i}
                  pageNumber={i + 1}
                  pageWidth={pageWidth}
                  pageHeight={pageHeight}
                />
              ))}
            </HTMLFlipBook>
          </Document>
        </div>
      </div>
    </div>
  )
}

export default FlipBook
