// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv')

dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-var-requires
const runtimeCaching = require('next-pwa/cache')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching,
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: ['.next/static/chunks/pages/*.js'], // ✅ Prevents slow initial navigation
  publicExcludes: ['!resume.pdf', '!robots.txt', '!sitemap.xml', '!workbox-*.js', '!sw.js'],
})

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  experimental: {
    // turbo: {}, // ✅ Ensure Turbopack is enabled correctly
    serverActions: {}, // ✅ Ensure Server Actions are enabled correctly,
    workerThreads: false, // ✅ Ensure service worker updates
  },
  generateBuildId: async () => {
    return 'nim23-build'
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows images from any external host
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    MODE: process.env.MODE,
    NIM23_DATABASE_URL: process.env.NIM23_DATABASE_URL,
    BACKEND_API_BASE_URL: process.env.BACKEND_API_BASE_URL,
    BACKEND_API_TOKEN: process.env.BACKEND_API_TOKEN,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
    EMAIL_JS_SERVICE_ID: process.env.EMAIL_JS_SERVICE_ID,
    EMAIL_JS_TEMPLATE_ID: process.env.EMAIL_JS_TEMPLATE_ID,
    EMAIL_JS_COMMENT_TEMPLATE_ID: process.env.EMAIL_JS_COMMENT_TEMPLATE_ID,
    EMAIL_JS_PUBLIC_KEY: process.env.EMAIL_JS_PUBLIC_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    GA_PROPERTY_ID: process.env.GA_PROPERTY_ID,
    GA_PROJECT_ID: process.env.GA_PROJECT_ID,
    GA_CLIENT_EMAIL: process.env.GA_CLIENT_EMAIL,
    GA_PRIVATE_KEY: process.env.GA_PRIVATE_KEY,
    DARKSTAR_GOOGLE_API_KEY: process.env.DARKSTAR_GOOGLE_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_DEFAULT_VERSION: process.env.CLOUDINARY_DEFAULT_VERSION,
    NEXT_PUBLIC_BLOGS_GRID_ITEMS_PER_PAGE: process.env.NEXT_PUBLIC_BLOGS_GRID_ITEMS_PER_PAGE,
    NEXT_PUBLIC_BLOGS_LIST_ITEMS_PER_PAGE: process.env.NEXT_PUBLIC_BLOGS_LIST_ITEMS_PER_PAGE,
    NEXT_PUBLIC_SNIPPETS_ITEMS_PER_PAGE: process.env.NEXT_PUBLIC_SNIPPETS_ITEMS_PER_PAGE,
    NEXT_PUBLIC_PROJECTS_ITEMS_PER_PAGE: process.env.NEXT_PUBLIC_PROJECTS_ITEMS_PER_PAGE,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      }
    }
    config.resolve.alias.canvas = false
    return config
  },
})

module.exports = nextConfig
// TEST Comment