import { PageMeta } from '@/lib/types'
import type { Metadata } from 'next'
import { PUBLIC_SITE_URL } from '@/lib/constants'


const myImage = 'images/numan.png'
const blogImage = 'static-images/blog.png'
const projectImage = 'static-images/project.png'
const snippetImage = 'static-images/code.png'
const logoImage = 'images/logo.png'

export const pageMeta: PageMeta = {
  home: {
    title: 'Home | NIM23',
    description:
      "Hey, I am Numan Ibn Mazid. I'm a Software Engineer who enjoys developing innovative software solutions that are tailored to customer desirability and usability.",
    image: myImage,
    keywords:
      "Numan Ibn Mazid's Portfolio, numan's blog, top blog sites, top 10 blog sites, best blog sites, best portfolio template, best programming blogs",
  },
  stats: {
    title: 'Statistics | NIM23',
    description: 'Here are some statistics about me.',
    image: logoImage,
    keywords: 'stats, Statistics, statistics page, nim23 statistics, this year statistics, github statistics',
  },
  blogs: {
    title: 'Blogs | NIM23',
    description:
      'Here, you will find a collection of insightful and informative articles that I have written on various topics. As a passionate writer and avid learner, I believe in the power of sharing knowledge and experiences through the written word.',
    image: blogImage,
    keywords:
      'numanibnmazid blog, nim23 blog, blog, webdev, react, react blog application, django blog application, programming blogs, top 10 programming blogs, top programming blogs',
  },
  blogDetails: {
    title: 'Blog | NIM23',
    description: 'Read insightful articles on web development, programming, and technology by Numan Ibn Mazid.',
    image: blogImage,
    keywords:
      'blog, programming blog, nim23 blog, numanibnmazid blog, web development blog, react blog, django blog, next js blog, javascript blog, software engineering blog, technology articles',
  },
  certificates: {
    title: 'Certificates | NIM23',
    description:
      'Here, I will showcase the certifications and professional achievements I have earned throughout my career. Each certificate I have obtained represents a milestone in my journey and demonstrates my commitment to excellence.',
    image: logoImage,
    keywords:
      'Certificates, verified, portfolio certificates page, portfolio certificates, certificates page certificate page example, certificates example',
  },
  projects: {
    title: 'Projects | NIM23',
    description:
      "I've been making various types of projects some of them were basics and some of them were complicated.",
    image: projectImage,
    keywords:
      'projects, work, side project, numan projects, mazid projects, portfolio projects, blog projects, projects page template',
  },
  projectDetails: {
    title: 'Project | NIM23',
    description:
      'Detailed insights into a project developed by Numan Ibn Mazid, including its features, technologies used, and implementation details.',
    image: projectImage,
    keywords:
      'project details, software project, web development project, nim23 project, numanibnmazid project, portfolio project, coding project, react project, django project, next js project, software engineering',
  },
  about: {
    title: 'About | NIM23',
    description:
      'Hey, I am Numan Ibn Mazid. Experienced professional Software Engineer who enjoys developing innovative software solutions that are tailored to customer desirability and usability.',
    image: myImage,
    keywords: 'about, about me, about numan, who is numan, mazid, about mazid, portfolio about page',
  },
  media: {
    title: 'Media | NIM23',
    description:
      'Here you will find a collection of my uploaded videos, watched movies and other captivating media content.',
    image: logoImage,
    keywords:
      'media, media page, numan media, mazid media, portfolio media page, media page template, youtube videos, youtube videos page, portfolio videos',
  },
  privacy: {
    title: 'Privacy Policy | NIM23',
    description:
      'At nim23.com, we value and respect your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website.',
    image: logoImage,
    keywords: 'Privacy, Privacy Policies, nim23 privacy policy, numan privacy policy',
  },
  contact: {
    title: 'Contact | NIM23',
    description:
      "Do you have something on your mind that you'd like to discuss? Whether it's work-related or simply a casual conversation, I'm here and eager to lend an ear. Please don't hesitate to get in touch with me at any time.",
    image: logoImage,
    keywords: 'contact, contact page, nim23 contact, contact numan',
  },
  snippets: {
    title: 'Snippets | NIM23',
    description:
      "These are a collection of snippets I've used in the past and saved. These could be useful to you as well.",
    image: snippetImage,
    keywords:
      'Code, Code Snippets, Snippets, nim23 code snippets, numan code snippets, snippets code, numan snippets, nim23 snippets',
  },
  snippetDetails: {
    title: 'Snippet | NIM23',
    description:
      "A detailed look at a specific code snippet from Numan Ibn Mazid's collection, including its purpose, usage, and implementation.",
    image: snippetImage,
    keywords:
      'code snippet, programming snippet, nim23 snippet, numanibnmazid snippet, coding example, useful code, web development snippet, javascript snippet, python snippet, software development',
  },
}

export const commonMeta: Metadata = {
  title: 'NIM23 - Portfolio of Numan Ibn Mazid',
  description: "Numan Ibn Mazid's Portfolio Web Application",
  keywords: [
    'Numan',
    'Numan Ibn Mazid',
    'numanibnmazid',
    'nmn',
    'nim23',
    'nim23.com',
    'numan blog',
    'blog application',
    'portfolio application',
    'portfolio template',
    'programming blog',
    'web development blog',
    'web development',
    'web development portfolio',
    'web development portfolio template',
    'portfolio application',
    'portfolio website',
    'portfolio website template',
    'Noman',
    'Noman Ibne Mojid',
    'Noman Blog',
    'Numan Ibne Mojid',
    'Noman Ibne Mazid',
    'Numan Ibne Mazid',
    'Numan Ibn Majid',
    'Mazid Blog',
    'Mazid Portfolio',
    'Next Js template',
    'Next Js portfolio template',
    'Next Js portfolio',
    'django blog',
    'django portfolio',
    'django portfolio template',
    'django tutorial',
    'next js tutorial',
    'javascript blog',
    'javascript portfolio',
    'javascript portfolio template',
    'javascript tutorial',
    'html css blog',
    'html css portfolio',
    'html css portfolio template',
    'html css tutorial',
    'free template',
    'free template download',
  ].join(', '), // ✅ Add keywords here
  metadataBase: new URL(PUBLIC_SITE_URL), // ✅ Fix Open Graph & Twitter image resolution
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-dark.ico',
    apple: '/icons/icon-192x192.png',
  },
  generator: 'NIM23',
  applicationName: 'NIM23',
  authors: [{ name: 'Numan Ibn Mazid', url: 'https://www.linkedin.com/in/numanibnmazid/' }],
  referrer: 'origin-when-cross-origin',
  // viewport: {
  //   width: 'device-width',
  //   initialScale: 1,
  //   maximumScale: 1,
  // },
  // themeColor: 'black',
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'NIM23 - Portfolio of Numan Ibn Mazid',
    description: "Numan Ibn Mazid's Portfolio",
    url: 'https://nim23.com',
    siteName: 'NIM23',
    authors: ['Numan Ibn Mazid'],
    images: [
      {
        url: myImage,
        alt: 'NIM23 - Portfolio of Numan Ibn Mazid',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NIM23 - Portfolio of Numan Ibn Mazid',
    description: "Numan Ibn Mazid's Portfolio",
    creator: '@NumanIbnMazid',
    images: [
      {
        url: myImage,
        alt: 'NIM23 - Portfolio of Numan Ibn Mazid',
      },
    ],
  },
}

// ✅ Reusable function to generate dynamic metadata
export function getPageMetadata({
  title,
  description,
  image,
  keywords,
  url,
}: {
  title?: string
  description?: string
  image?: string
  keywords?: string | string[]
  url?: string
}): Metadata {
  return {
    title: title || commonMeta.title,
    description: description || commonMeta.description,
    keywords: keywords ? (Array.isArray(keywords) ? keywords.join(', ') : keywords) : '',
    metadataBase: new URL(PUBLIC_SITE_URL), // ✅ Ensures correct OG image resolution
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-dark.ico',
      apple: '/icons/icon-192x192.png',
    },
    generator: 'NIM23',
    applicationName: 'NIM23',
    authors: [{ name: 'Numan Ibn Mazid', url: 'https://www.linkedin.com/in/numanibnmazid/' }],
    referrer: 'origin-when-cross-origin',
    manifest: '/manifest.json',
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: title || commonMeta.openGraph?.title,
      description: description || commonMeta.openGraph?.description,
      url: url || commonMeta.openGraph?.url,
      siteName: 'NIM23',
      images: [
        {
          url: image || myImage,
          alt: title || 'NIM23 - Portfolio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || commonMeta.twitter?.title,
      description: description || commonMeta.twitter?.description,
      images: [
        {
          url: image || myImage,
          alt: title || 'NIM23 - Portfolio',
        },
      ],
    },
  }
}


// ✅ Export viewport separately as required by Next.js 14+
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// ✅ Export themeColor separately as required by Next.js 14+
export const themeColor = 'black'
