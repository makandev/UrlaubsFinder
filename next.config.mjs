/** @type {import('next').NextConfig} */

// GitHub Pages liefert unter https://<user>.github.io/<repo>/ aus — daher der
// Unterpfad (basePath). Lokal (ohne GITHUB_PAGES) bleibt alles unter "/".
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "UrlaubsFinder";

const nextConfig = {
  reactStrictMode: true,
  output: "export", // erzeugt statische Dateien in out/ für GitHub Pages
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isPages ? `/${repo}` : "",
};

export default nextConfig;
