import { prisma } from "@/lib/prisma";
import { BLOG_DEFAULT_IMAGE_PATH } from "@/lib/constants";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";
import { BlogType, TableOfContents } from "@/lib/types";
import { JSDOM } from "jsdom";

/**
 * Extract Table of Contents (TOC) from HTML content.
 */
const extractTableOfContents = (htmlContent: string): TableOfContents[] => {
  if (!htmlContent) return [];

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  return Array.from(headings).map((heading) => {
    const text = (heading as Element).textContent || "untitled";
    const id = (heading as Element).id || text.toLowerCase().replace(/\s+/g, "-");

    return {
      id,
      level: parseInt((heading as Element).tagName.replace("H", ""), 10),
      heading: text,
    };
  });
};

/**
 * Fetch a single blog by slug, including TOC and comments.
 */
export async function getBlogBySlug(slug: string): Promise<BlogType | null> {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: {
      blog_view: true,
      blog_category: true,
      blog_comment: {
        where: { is_approved: true }, // ✅ Only fetch approved comments
        orderBy: { created_at: "desc" }, // ✅ Sort by latest first
      },
    },
  });

  if (!blog) return null;

  // ✅ Ensure TOC is always a valid array
  const table_of_contents: TableOfContents[] = extractTableOfContents(blog.content);

  return {
    id: Number(blog.id),
    title: blog.title,
    slug: blog.slug,
    content: blog.content,
    author: blog.author,
    status: blog.status,
    order: blog.order,
    image: blog.image ? getCloudinaryUrl(blog.image) : BLOG_DEFAULT_IMAGE_PATH,
    overview: blog.overview ?? undefined,
    tags: blog.tags ?? undefined,
    created_at: blog.created_at.toISOString(),
    updated_at: blog.updated_at.toISOString(),
    total_views: blog.blog_view?.length || 0,
    total_likes: blog.blog_view?.filter((v) => v.liked).length || 0,
    user_liked: false,
    category: blog.blog_category
      ? {
          id: Number(blog.blog_category.id),
          name: blog.blog_category.name,
          slug: blog.blog_category.slug,
          created_at: blog.blog_category.created_at.toISOString(),
          updated_at: blog.blog_category.updated_at.toISOString(),
        }
      : undefined,
    table_of_contents,
    blog_comments: blog.blog_comment.map((comment) => ({
      id: Number(comment.id),
      name: comment.name,
      email: comment.email,
      is_approved: comment.is_approved,
      slug: comment.slug,
      comment: comment.comment,
      created_at: comment.created_at.toISOString(),
    })), // ✅ Convert comments into a clean structure
  };
}
