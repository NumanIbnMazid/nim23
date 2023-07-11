/**
 * @type {import('next').NextConfig}
 */

// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   publicExcludes: ["!resume.pdf"],
// })

// module.exports = withPWA({
//   // TODO: Uncomment for production
//   // reactStrictMode: true,
//   images: {
//     domains: [
//       "ucarecdn.com",
//       "cdn.buymeacoffee.com",
//       "res.cloudinary.com",
//       "imgur.com",
//       "i.imgur.com",
//       "cutt.ly",
//       "activity-graph.herokuapp.com",
//       "i.scdn.co", // images from spotify
//       "images.unsplash.com",
//       "m.media-amazon.com", // for imdb images
//       "encrypted-tbn0.gstatic.com", // TEMP
//     ],
//     // unoptimized: true,
//   },
//   typescript: {
//     ignoreBuildErrors: false,
//   },
//   env:{
//     BACKEND_API_BASE_URL : process.env.BACKEND_API_BASE_URL,
//     BACKEND_API_TOKEN : process.env.BACKEND_API_TOKEN,
//     GITHUB_ACCESS_TOKEN : process.env.GITHUB_ACCESS_TOKEN,
//     EMAIL_JS_SERVICE_ID : process.env.EMAIL_JS_SERVICE_ID,
//     EMAIL_JS_TEMPLATE_ID : process.env.EMAIL_JS_TEMPLATE_ID,
//     EMAIL_JS_PUBLIC_KEY : process.env.EMAIL_JS_PUBLIC_KEY,
//   }
// });

module.exports = {
  // TODO: Uncomment for production
  // reactStrictMode: true,
  images: {
    domains: [
      // Insert Allowed Domains Here
    ],
    // unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  env:{
    BACKEND_API_BASE_URL : process.env.BACKEND_API_BASE_URL,
    BACKEND_API_TOKEN : process.env.BACKEND_API_TOKEN,
    GITHUB_ACCESS_TOKEN : process.env.GITHUB_ACCESS_TOKEN,
    EMAIL_JS_SERVICE_ID : process.env.EMAIL_JS_SERVICE_ID,
    EMAIL_JS_TEMPLATE_ID : process.env.EMAIL_JS_TEMPLATE_ID,
    EMAIL_JS_PUBLIC_KEY : process.env.EMAIL_JS_PUBLIC_KEY,
  }
}
