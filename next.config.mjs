/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The legacy static *.html pages (index.html, the 50 city pages, etc.) live at
  // the repo root. They are preserved on disk but are NOT served by Next.js.
  // Migrating them into the App Router is scheduled for later fases (7/8/12).
  // See content-gaps.json and the FASE-1/2 report for the Vercel-preset caveat.
};

export default nextConfig;
