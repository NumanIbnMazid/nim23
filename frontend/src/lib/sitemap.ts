import { writeFileSync } from "fs";
import { globby } from "globby";

export default async function generate() {
  const pages = await globby([
    "src/app/*.tsx",
    "!src/app/_*.tsx",
    "!src/app/api",
    "!src/app/404.tsx",
  ]);


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map((page) => {
            const path = page
              .replace("pages", "")
              .replace("posts", "/blogs")
              .replace("snippets", "/snippets")
              .replace(".tsx", "")
              .replace(".mdx", "");
            const route = path === "/index" ? "" : path;

            return `
              <url>
                  <loc>${`https://nim23.com${route}`}</loc>
              </url>
            `;
          })
          .join("")}
    </urlset>
    `;

  // eslint-disable-next-line no-sync
  writeFileSync("public/sitemap.xml", sitemap);
}
