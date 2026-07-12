/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for @netlify/plugin-nextjs compatibility
  // Allows Next.js to run on Netlify's serverless functions
  output: "standalone",

  // Allow images from common external sources
  images: {
    domains: [
      "localhost",
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
    ],
    // Use unoptimized for Netlify static image serving
    unoptimized: true,
  },

  // Trailing slash for cleaner Netlify routing
  trailingSlash: false,

  // Environment variable exposure to the browser bundle
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

module.exports = nextConfig;
