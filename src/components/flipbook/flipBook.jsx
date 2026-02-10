import { forwardRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../hooks/useLocale'
import { formatNumber } from '../../utils/numbers'
import HTMLFlipBook from 'react-pageflip'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './flipBook.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PAGE_ASPECT = 543 / 380
const MIN_PAGE_WIDTH = 230
const MAX_PAGE_WIDTH = 470
const MAX_PAGE_WIDTH_FULLSCREEN = 750

function getPageSize(isFullscreen = false) {
  if (typeof window === 'undefined') return { pageWidth: 380, pageHeight: 543 }
  const w = window.innerWidth
  const h = window.innerHeight
  if (isFullscreen) {
    const padW = 64
    const padH = 180
    const usableW = w - padW
    const usableH = h - padH
    const fromWidth = usableW / 2
    const fromHeight = usableH / PAGE_ASPECT
    let pageWidth = Math.min(fromWidth, fromHeight, MAX_PAGE_WIDTH_FULLSCREEN)
    pageWidth = Math.max(MIN_PAGE_WIDTH, Math.round(pageWidth))
    const pageHeight = Math.round(pageWidth * PAGE_ASPECT)
    return { pageWidth, pageHeight }
  }
  const maxOpenWidth = Math.min(w - 48, 992)
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
  const { locale } = useLocale()
  const { t } = useTranslation()
  const bookRef = useRef(null)
  const fullscreenRef = useRef(null)
  const [numPages, setNumPages] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loading, setLoading] = useState(!!file)
  const [error, setError] = useState(null)
  const [isCoverView, setIsCoverView] = useState(true)
  const [isLastPage, setIsLastPage] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(() => getPageSize(false))
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    const onResize = () => setPageSize(getPageSize(!!document.fullscreenElement))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName) || e.target?.isContentEditable) return
      const flip = bookRef.current?.pageFlip?.()
      if (!flip) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        flip.flipPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        flip.flipNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onFullscreenChange = () => {
      const fullscreen = !!document.fullscreenElement
      setIsFullscreen(fullscreen)
      setPageSize(getPageSize(fullscreen))
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    const flip = bookRef.current?.pageFlip?.()
    if (flip) {
      requestAnimationFrame(() => {
        flip.update()
        requestAnimationFrame(() => flip.update())
      })
    }
  }, [pageSize])

  const toggleFullscreen = () => {
    if (!fullscreenRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      const el = fullscreenRef.current
      el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.() ?? el.msRequestFullscreen?.()
    }
  }

  const updateViewWidth = (pageFlip) => {
    if (!pageFlip) return
    const current = pageFlip.getCurrentPageIndex()
    const total = pageFlip.getPageCount?.() ?? numPages ?? 1
    const last = current === total - 1
    setIsCoverView(current === 0 || last)
    setIsLastPage(last)
    setCurrentPage(current)
  }

  const goToFirstPage = () => {
    const flip = bookRef.current?.pageFlip?.()
    if (flip) flip.turnToPage(0)
    setCurrentPage(0)
    setIsCoverView(true)
    setIsLastPage(false)
  }

  const goToLastPage = () => {
    if (!numPages) return
    const flip = bookRef.current?.pageFlip?.()
    if (flip) {
      flip.turnToPage(numPages - 1)
      flip.update()
      requestAnimationFrame(() => flip.update()) // Ensure redraw after layout
    }
    setCurrentPage(numPages - 1)
    setIsCoverView(true)
    setIsLastPage(true)
  }

  const goToPrevPage = () => {
    const flip = bookRef.current?.pageFlip?.()
    if (flip && currentPage > 0) flip.flipPrev()
  }

  const goToNextPage = () => {
    const flip = bookRef.current?.pageFlip?.()
    if (flip && numPages && currentPage < numPages - 1) flip.flipNext()
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
    const yearDisplay = year ? formatNumber(year, locale) : ''
    return (
      <div className="flipbook-message flipbook-coming-soon">
        <p>{year ? t('maktoub.comingSoon', { year: yearDisplay }) : t('maktoub.comingSoonGeneric')}</p>
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
    <div
      ref={fullscreenRef}
      className={`flipbook-fullscreen-container ${isFullscreen ? 'is-fullscreen' : ''}`}
    >
    <div className="flipbook-wrapper">
      <p className="flipbook-hint">{t('flipbook.hint')}</p>
      <div className="flipbook-center">
        <div
          className={`flipbook-sizer ${isCoverView ? 'flipbook-sizer--cover' : ''} ${isLastPage ? 'flipbook-sizer--last' : ''}`}
          style={{ width: isCoverView ? wrapperClosed : wrapperOpen }}
        >
        <div
          className="flipbook-view"
          style={{
            width: wrapperOpen,
            minHeight: pageHeight,
            ['--flipbook-page-width']: `${pageWidth}px`,
          }}
        >
          <Document file={file} loading="">
            <HTMLFlipBook
              key={isFullscreen ? 'fullscreen' : 'inline'}
              ref={bookRef}
              width={pageWidth}
              height={pageHeight}
              className="flipbook"
              showCover
              startPage={currentPage}
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
      <div className="flipbook-controls">
        <button
          type="button"
          className="flipbook-nav-arrow"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          title={t('flipbook.prevPage')}
          aria-label={t('flipbook.prevPage')}
        >
          &lt;
        </button>
        <span className="flipbook-page-indicator">
          {t('flipbook.pageOf', {
            current: formatNumber(currentPage + 1, locale),
            total: formatNumber(numPages, locale),
          })}
        </span>
        <button
          type="button"
          className="flipbook-nav-arrow"
          onClick={goToNextPage}
          disabled={!numPages || currentPage >= numPages - 1}
          title={t('flipbook.nextPage')}
          aria-label={t('flipbook.nextPage')}
        >
          &gt;
        </button>
        <div
          ref={menuRef}
          className={`flipbook-menu ${menuOpen ? 'is-open' : ''}`}
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            className="flipbook-menu-trigger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={t('flipbook.moreOptions')}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="flipbook-menu-icon" aria-hidden>⋯</span>
          </button>
          <div className="flipbook-dropdown" role="menu">
            <button
              type="button"
              className="flipbook-dropdown-item"
              role="menuitem"
              onClick={() => {
                goToFirstPage()
                setMenuOpen(false)
              }}
            >
              <span className="flipbook-dropdown-icon" aria-hidden>««</span>
              {t('flipbook.firstPage')}
            </button>
            <button
              type="button"
              className="flipbook-dropdown-item"
              role="menuitem"
              onClick={() => {
                goToLastPage()
                setMenuOpen(false)
              }}
            >
              <span className="flipbook-dropdown-icon" aria-hidden>»»</span>
              {t('flipbook.lastPage')}
            </button>
            <button
              type="button"
              className="flipbook-dropdown-item"
              role="menuitem"
              onClick={() => {
                toggleFullscreen()
                setMenuOpen(false)
              }}
            >
              <span className="flipbook-dropdown-icon" aria-hidden>⛶</span>
              {isFullscreen ? t('flipbook.exitFullscreen') : t('flipbook.fullscreen')}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default FlipBook
