import '@/styles/globals.css' // ✅ Load global styles
import { Inter } from 'next/font/google'
import { DarkModeProvider } from '@/context/darkModeContext'
import { ClientIDProvider } from '@/context/clientIdContext'
import LayoutAppMain from '@/layout/LayoutAppMain'
import AppClientLayout from '@/app/apps/AppLayoutClient'
import { Metadata } from 'next'
import { pageMeta } from '@/lib/Meta'
import SitemapPrefetch from '@/components/SitemapPrefetch'

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: pageMeta.home.title,
  description: pageMeta.home.description,
  icons: { icon: '/favicon.ico' },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload Fonts */}
        <link
          rel="preload"
          href="/fonts/Barlow/Barlow-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Barlow/Barlow-500.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Barlow/Barlow-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Barlow/Barlow-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Barlow/Barlow-800.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/fonts/Inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="/fonts/Sarina/Sarina-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <DarkModeProvider>
          <ClientIDProvider>
            <LayoutAppMain>
              <AppClientLayout>{children}</AppClientLayout>
              <SitemapPrefetch />
            </LayoutAppMain>
          </ClientIDProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}
