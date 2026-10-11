import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.roywasker.com",
  output: "static",
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    build: {
      // Keep scroll timelines as longhands; combining them into animation
      // shorthand is not supported by the browsers used for this portfolio.
      cssMinify: "esbuild",
    },
  },
  compressHTML: true,
});
