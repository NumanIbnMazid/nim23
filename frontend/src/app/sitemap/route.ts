import { PUBLIC_SITE_URL } from "@/lib/constants";
import { prisma } from '@/lib/prisma';

export async function GET() {
    // ✅ Fetch all blog and snippet slugs from the database
    const blogs = await prisma.blog.findMany({
      select: { slug: true },
    });
  
    const snippets = await prisma.code_snippet.findMany({
      select: { slug: true },
    });
  
    // ✅ Define static routes
    const staticRoutes = [
      "",
      "about",
      "blogs",
      "snippets",
      "projects",
      "entertainment",
      "contact",
      "privacy",
      "stats",
      "apps",
      "apps/grabit"
    ];
  
    // ✅ Generate sitemap entries
    const sitemapEntries = [
      ...staticRoutes.map(route => `<url><loc>${PUBLIC_SITE_URL}/${route}</loc></url>`),
      ...blogs.map(blog => `<url><loc>${PUBLIC_SITE_URL}/blogs/${blog.slug}</loc></url>`),
      ...snippets.map(snippet => `<url><loc>${PUBLIC_SITE_URL}/snippets/${snippet.slug}</loc></url>`),
    ];
  
    // ✅ Build the XML Sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapEntries.join("\n")}
    </urlset>`;
  
    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
