'use client' // ✅ Ensure Client Component

import { useEffect } from 'react'
import { usePathname } from 'next/navigation' // ✅ Correct Hook
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { Toaster } from 'sonner' // ✅ Import Toaster here
import { useDarkMode } from '@/context/darkModeContext' // ✅ Now works in Client Component

NProgress.configure({
  easing: 'ease',
  speed: 800,
  showSpinner: false,
})

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() // ✅ Detects navigation changes
  const { isDarkMode } = useDarkMode() // ✅ Now works

  useEffect(() => {
    if (typeof window !== 'undefined') {
      NProgress.start()
      const timer = setTimeout(() => {
        NProgress.done()
      }, 500)

      return () => {
        clearTimeout(timer)
        NProgress.done()
      }
    }
  }, [pathname])

  return (
    <>
      {process.env.NODE_ENV === 'production' && <GoogleAnalytics strategy="lazyOnload" />}

      {children}
      
      {/* ✅ Add the Sonner Toaster */}
      <Toaster
        position="top-right"
        closeButton={true}
        offset={{ top: '60px', right: '10px' }}
        richColors
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </>
  )
}