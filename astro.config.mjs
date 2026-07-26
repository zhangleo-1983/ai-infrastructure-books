import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL?.trim() || undefined;
const rawBase = process.env.BASE_PATH?.trim() || "/";
const base =
  rawBase === "/" ? "/" : `/${rawBase.replace(/^\/+|\/+$/g, "")}/`;

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  integrations: [
    mdx(),
    ...(site
      ? [
          sitemap({
            filter: (page) =>
              !page.endsWith("/404/") && !page.endsWith("/print/"),
          }),
        ]
      : []),
  ],
});
