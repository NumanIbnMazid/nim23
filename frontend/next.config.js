/**
 * @type {import('next').NextConfig}
 */

const path = require('path')
const dotenv = require('dotenv')

dotenv.config({path: '../.env'})

const runtimeCaching = require("next-pwa/cache")

const withPWA = require('next-pwa')({
  dest: "public",
  runtimeCaching,
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  publicExcludes: ["!resume.pdf", "!robots.txt"]
})

module.exports = withPWA({
  generateBuildId: async () => {
    return 'nim23-build'
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: [
      // Insert Allowed Domains Here
      "https://postimg.cc",
      "https://i.postimg.cc",
    ],
    // unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env:{
    BACKEND_API_BASE_URL : process.env.BACKEND_API_BASE_URL,
    BACKEND_API_TOKEN : process.env.BACKEND_API_TOKEN,
    GITHUB_ACCESS_TOKEN : process.env.GITHUB_ACCESS_TOKEN,
    EMAIL_JS_SERVICE_ID : process.env.EMAIL_JS_SERVICE_ID,
    EMAIL_JS_TEMPLATE_ID : process.env.EMAIL_JS_TEMPLATE_ID,
    EMAIL_JS_PUBLIC_KEY : process.env.EMAIL_JS_PUBLIC_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID : process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    GA_PROPERTY_ID : process.env.GA_PROPERTY_ID,
    GA_PROJECT_ID : process.env.GA_PROJECT_ID,
    GA_CLIENT_EMAIL : process.env.GA_CLIENT_EMAIL,
    GA_PRIVATE_KEY : process.env.GA_PRIVATE_KEY,
    DARKSTAR_GOOGLE_API_KEY : process.env.DARKSTAR_GOOGLE_API_KEY,
  }
})
