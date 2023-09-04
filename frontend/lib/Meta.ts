// import type { Metadata } from 'next'
// import useWindowLocation from '@hooks/useWindowLocation'

// type Props = {
//   title: string
//   description: string
//   previewImage?: string
//   keywords?: string
//   suffix?: string
// }

// export async function generateMetadata(): Promise<Metadata> {
//   const { currentURL } = useWindowLocation()

//   const pageTitle = suffix ? `${title} - ${suffix}` : title
//   const pageDescription = description ? description : "Numan Ibn Mazid's Portfolio Web Application"

//   const pagePreviewImage = previewImage ? previewImage : '/images/numan.png'

//   const defaultKeywords = [
//     'Numan',
//     'Numan Ibn Mazid',
//     'numanibnmazid',
//     'nmn',
//     'nim23',
//     'nim23.com',
//     'numan blog',
//     'blog application',
//     'portfolio application',
//     'portfolio template',
//     'programming blog',
//     'web development blog',
//     'web development',
//     'web development portfolio',
//     'web development portfolio template',
//     'portfolio application',
//     'portfolio website',
//     'portfolio website template',
//     'Noman',
//     'Noman Ibne Mojid',
//     'Noman Blog',
//     'Numan Ibne Mojid',
//     'Noman Ibne Mazid',
//     'Numan Ibne Mazid',
//     'Numan Ibn Majid',
//     'Mazid Blog',
//     'Mazid Portfolio',
//   ]
//   const keywordArray = keywords ? keywords.split(',').map((keyword) => keyword.trim()) : []
//   const keywordList = defaultKeywords.concat(keywordArray.filter((keyword) => !defaultKeywords.includes(keyword)))

//   return {
//     // Main
//     title: pageTitle,
//     description: pageDescription,
//     keywords: keywordList,
//     // Icons
//     icons: {
//       icon: '/favicon.ico',
//       shortcut: '/favicon-dark.ico',
//       apple: '/icons/icon-192x192.png',
//     },
//     // Others
//     generator: 'Next.js',
//     applicationName: 'NIM23',
//     authors: [{ name: 'Numan Ibn Mazid', url: 'https://www.linkedin.com/in/numanibnmazid/' }],
//     referrer: 'origin-when-cross-origin',
//     viewport: {
//       width: 'device-width',
//       initialScale: 1,
//       maximumScale: 1,
//     },
//     themeColor: 'black',
//     manifest: '/manifest.json',
//     robots: {
//       index: true,
//       follow: true,
//       nocache: true,
//       googleBot: {
//         index: true,
//         follow: true,
//         noimageindex: false,
//         'max-video-preview': -1,
//         'max-image-preview': 'large',
//         'max-snippet': -1,
//       },
//     },
//     // Open Graph
//     openGraph: {
//       title: pageTitle,
//       description: pageDescription,
//       url: currentURL,
//       siteName: 'NIM23',
//       authors: ['Numan Ibn Mazid'],
//       images: [
//         {
//           url: pagePreviewImage,
//           alt: pageTitle ? pageTitle : 'nim23.com || Numan Ibn Mazid',
//           // width: 800,
//           // height: 600,
//         },
//       ],
//     },
//     // Twitter
//     twitter: {
//       card: 'summary_large_image',
//       title: pageTitle,
//       description: pageDescription,
//       creator: '@NumanIbnMazid',
//       images: [
//         {
//           url: pagePreviewImage,
//           alt: pageTitle ? pageTitle : 'nim23.com || Numan Ibn Mazid',
//           // width: 800,
//           // height: 600,
//         },
//       ],
//     },
//   }
// }
