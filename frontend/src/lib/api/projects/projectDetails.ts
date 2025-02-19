import { prisma } from '@/lib/prisma';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { PROJECT_DEFAULT_IMAGE_PATH } from '@/lib/constants';
import { getDuration, getDurationInDays } from '@/utils/date';

/**
 * Fetch a single project by slug, including duration calculations.
 */
export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        project_media: true, // ✅ Ensure project_media is included
      },
    });

    if (!project) return null;

    return {
      id: String(project.id),
      title: project.title,
      slug: project.slug,
      image: project.image ? getCloudinaryUrl(project.image) : PROJECT_DEFAULT_IMAGE_PATH,
      short_description: project.short_description,
      technology: project.technology ?? undefined,
      duration: getDuration(project.start_date, project.end_date, project.present),
      duration_in_days: getDurationInDays(project.start_date, project.end_date, project.present),
      preview_url: project.preview_url ?? undefined,
      github_url: project.github_url ?? undefined,
      description: project.description ?? "",
      created_at: project.created_at.toISOString(),
      updated_at: project.updated_at.toISOString(),
      project_media: project.project_media?.map((media) => ({
        id: Number(media.id), // ✅ Convert `bigint` to `number`
        title: media.title,
        slug: media.slug,
        description: media.description ?? "", // ✅ Ensure description is always a string
        file: media.file ? getCloudinaryUrl(media.file) : "",
        created_at: media.created_at.toISOString(), // ✅ Convert `Date` to `string`
        updated_at: media.updated_at.toISOString(), // ✅ Convert `Date` to `string`
      })) ?? [],
    };
  } catch (error) {
    console.error('Error fetching project details:', error);
    return null;
  }
}
