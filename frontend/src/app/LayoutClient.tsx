'use client' // ✅ Ensure Client Component

import { useEffect, useState } from 'react'
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
  const { isDarkMode } = useDarkMode()
  const [prismLoaded, setPrismLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      NProgress.start()

      const timer = setTimeout(() => {
        NProgress.done()

        // ✅ FIX: Delay Prism.js until everything is fully loaded
        setTimeout(() => {
          if (!prismLoaded) {
            import('@/lib/prismSetup').then((Prism) => {
              Prism.default.highlightAll()
              setPrismLoaded(true) // ✅ Ensure it only runs once
            })
          }
        }, 300) // Slight delay to ensure Next.js hydration is complete
      }, 500)

      return () => {
        clearTimeout(timer)
        NProgress.done()
      }
    }
  }, [pathname, prismLoaded]) // ✅ Runs once per route change, ensuring Prism doesn't reset

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
