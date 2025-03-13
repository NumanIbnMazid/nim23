import { prisma } from '@/lib/prisma';
import { BLOG_DEFAULT_IMAGE_PATH } from '@/lib/constants';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';

// This forces Next.js to always fetch fresh data.
export const dynamic = "force-dynamic";

/**
 * Fetch blogs from the database with optional limit support.
 */
export async function getAllBlogs(limit?: number) {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: "Published",  // ✅ Ensure only published blogs appear
      },
      orderBy: [
        { order: 'desc' }, // ✅ Order blogs by custom order first
        { created_at: 'desc' }, // ✅ Then order by creation date (latest first)
      ],
      include: {
        blog_view: true,
        blog_category: true,
      },
      ...(limit ? { take: limit } : {}), // ✅ Apply limit if provided
    });

    return blogs.map((blog) => ({
      ...blog,
      id: Number(blog.id),
      category_id: blog.category_id ? Number(blog.category_id) : null,
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
    }));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}
