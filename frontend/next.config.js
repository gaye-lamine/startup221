/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: Do NOT use output: "standalone" with @netlify/plugin-nextjs
  // The plugin handles serverless function bundling automatically.

  images: {
    domains: [
      "localhost",
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
    ],
    unoptimized: true,
  },

  // Environment variable exposure to the browser bundle
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

module.exports = nextConfig;
