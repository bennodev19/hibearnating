/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'route.ts'],
  // ignoreBuildErrors: true, // https://github.com/vercel/next.js/blob/canary/docs/api-reference/next.config.js/ignoring-typescript-errors.md
};

module.exports = nextConfig;
