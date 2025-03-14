import { prisma } from "@/lib/prisma";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";
import { SNIPPET_DEFAULT_IMAGE_PATH } from '@/lib/constants';

/**
 * Fetch all snippets from the database.
 */
export async function getAllSnippets() {
  try {
    const snippets = await prisma.code_snippet.findMany({
      where: {
        status: "Published",  // ✅ Ensure only published snippets appear
      },
      orderBy: [
        { order: 'desc' }, // ✅ Order snippets by custom order first
        { created_at: 'desc' }, // ✅ Then order by creation date (latest first)
      ],
      include: {
        code_snippet_comment: true,
        code_snippet_view: true,
      },
    });

    await prisma.$disconnect(); // ✅ Close connection after fetching data

    return snippets.map((snippet) => ({
      id: snippet.id,
      slug: snippet.slug,
      title: snippet.title,
      overview: snippet.overview ?? undefined,
      image: snippet.image ? getCloudinaryUrl(snippet.image) : SNIPPET_DEFAULT_IMAGE_PATH,
      language: snippet.language ?? "",
      content: snippet.content,
      tags: snippet.tags ?? undefined,
      status: snippet.status,
      order: snippet.order,
      total_views: snippet.code_snippet_view?.length || 0,
      total_likes: snippet.code_snippet_view?.filter((v) => v.liked).length || 0,
      user_liked: false,
      created_at: snippet.created_at.toISOString(),
      updated_at: snippet.updated_at.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return [];
  }
}
