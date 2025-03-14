import { prisma } from "@/lib/prisma";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";
import { EDUCATION_DEFAULT_IMAGE_PATH } from "@/lib/constants";
import { getDuration } from '@/utils/date';
/**
 * ✅ Fetch all educations, ensuring Prisma data matches Django’s serializer.
 */
export async function getAllEducations() {
  try {
    const educations = await prisma.education.findMany({
      orderBy: { start_date: "desc" },
      include: { education_media: true }, // ✅ Ensure media is included
    });

    await prisma.$disconnect(); // ✅ Close connection after fetching data

    return educations.map((edu) => {
      const startDate = new Date(edu.start_date);
      const endDate = edu.end_date ? new Date(edu.end_date) : null;
      const isPresent = edu.present;

      return {
        id: Number(edu.id),
        slug: edu.slug,
        school: edu.school,
        degree: edu.degree,
        field_of_study: edu.field_of_study ?? undefined, // ✅ Convert null to undefined
        duration: getDuration(startDate, endDate, isPresent), // ✅ Compute duration
        grade: edu.grade ?? undefined, // ✅ Convert null to undefined
        activities: edu.activities ?? undefined, // ✅ Convert null to undefined
        description: edu.description ?? undefined, // ✅ Convert null to undefined
        image: edu.image ? getCloudinaryUrl(edu.image) : EDUCATION_DEFAULT_IMAGE_PATH, // ✅ Fetch from Cloudinary or default
        address: edu.address ?? undefined, // ✅ Convert null to undefined
        start_date: startDate.toISOString(),
        end_date: endDate ? endDate.toISOString() : null,
        created_at: new Date(edu.created_at).toISOString(),
        updated_at: new Date(edu.updated_at).toISOString(),
        education_media: edu.education_media.map((media) => ({
          id: Number(media.id),
          title: media.title,
          slug: media.slug,
          description: media.description ?? "",
          file: media.file ? getCloudinaryUrl(media.file) : "",
          created_at: new Date(media.created_at).toISOString(),
          updated_at: new Date(media.updated_at).toISOString(),
        })),
      };
    });
  } catch (error) {
    console.error("Error fetching educations:", error);
    return [];
  }
}
