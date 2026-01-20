/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // <=== Enables static HTML export
  basePath: "/golum-ai-landing", // <=== Required for GitHub Pages (unless you use a custom domain)
  images: {
    unoptimized: true, // <=== Required because GitHub Pages cannot optimize images on the fly
  },
};

export default nextConfig;
