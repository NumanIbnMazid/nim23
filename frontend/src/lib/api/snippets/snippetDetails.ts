import { prisma } from '@/lib/prisma'
import { getCloudinaryUrl } from '@/lib/utils/cloudinary'
import { SNIPPET_DEFAULT_IMAGE_PATH } from '@/lib/constants'

/**
 * Fetch a single snippet by slug.
 */
export async function getSnippetBySlug(slug: string) {
  try {
    const snippet = await prisma.code_snippet.findUnique({
      where: { slug },
      include: {
        code_snippet_view: true,
        code_snippet_comment: {
          where: { is_approved: true }, // ✅ Fetch only approved comments
          orderBy: { created_at: 'desc' }, // ✅ Sort comments by latest
        },
      },
    })

    await prisma.$disconnect(); // ✅ Close connection after fetching data

    if (!snippet) return null

    return {
      id: snippet.id,
      slug: snippet.slug,
      title: snippet.title,
      overview: snippet.overview ?? undefined,
      image: snippet.image ? getCloudinaryUrl(snippet.image) : SNIPPET_DEFAULT_IMAGE_PATH,
      language: snippet.language ?? '',
      content: snippet.content,
      tags: snippet.tags ?? undefined,
      status: snippet.status,
      order: snippet.order,
      total_views: snippet.code_snippet_view?.length || 0,
      total_likes: snippet.code_snippet_view?.filter((v) => v.liked).length || 0,
      user_liked: false,
      created_at: snippet.created_at.toISOString(),
      updated_at: snippet.updated_at.toISOString(),
      code_snippet_comments: snippet.code_snippet_comment.map((comment) => ({
        id: Number(comment.id),
        name: comment.name,
        email: comment.email,
        is_approved: comment.is_approved,
        slug: comment.slug,
        comment: comment.comment,
        created_at: comment.created_at.toISOString(),
      })), // ✅ Pass comments directly
    }
  } catch (error) {
    console.error('Error fetching snippet details:', error)
    return null
  }
}
