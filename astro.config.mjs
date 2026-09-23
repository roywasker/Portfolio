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
  compressHTML: true,
});
