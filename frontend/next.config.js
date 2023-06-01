/**
 * @type {import('next').NextConfig}
 */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  publicExcludes: ["!resume.pdf"],
});

module.exports = withPWA({
  // TODO: Uncomment for production
  // reactStrictMode: true,
  images: {
    domains: [
      "ucarecdn.com",
      "cdn.buymeacoffee.com",
      "res.cloudinary.com",
      "imgur.com",
      "i.imgur.com",
      "cutt.ly",
      "activity-graph.herokuapp.com",
      "i.scdn.co", // images from spotify
      "images.unsplash.com",
      "m.media-amazon.com", // for imdb images
      "encrypted-tbn0.gstatic.com", // TEMP
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  env:{
    BACKEND_API_BASE_URL : process.env.BACKEND_API_BASE_URL
  }
});
